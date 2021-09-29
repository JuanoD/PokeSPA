import axios, { AxiosResponse } from "axios";
import { Dispatch, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as Loader } from "loader.svg";
import {
    PokemonStore,
    PokeAction,
    Pokemon,
    GenderResponse,
    TypeResponse,
    ColorResponse,
} from "interfaces";
import { Card } from ".";

const PokeHome: React.FC = (props) => {
    const { loading, filter } = useSelector<PokemonStore, PokemonStore>(
        (state) => state
    );
    const search = useSelector<PokemonStore, string>((store) => store.search);
    const pokemon = useSelector<PokemonStore, Pokemon[]>(
        (store) => store.pokemon
    );
    const dispatch = useDispatch<Dispatch<PokeAction>>();
    const [list, setList] = useState([...pokemon]);
    const [pages, setPages] = useState(1);
    useEffect(() => {
        const cache = localStorage.getItem("pokemon");
        if (cache) {
            dispatch({
                type: "pokemon",
                payload: { pokemon: JSON.parse(cache) },
            });
            console.log("Pokemon list was cached!");
        } else
            axios
                .get<{
                    pokemon_entries: {
                        entry_number: number;
                        pokemon_species: { name: string; url: string };
                    }[];
                }>("https://pokeapi.co/api/v2/pokedex/national")
                .then((res) => {
                    const list = res.data.pokemon_entries.map((v) => {
                        return {
                            name: v.pokemon_species.name,
                            id: v.entry_number,
                        };
                    });
                    localStorage.setItem("pokemon", JSON.stringify(list));
                    dispatch({
                        type: "pokemon",
                        payload: {
                            pokemon: list,
                        },
                    });
                })
                .catch((err) => console.error(err)); // eslint-disable-next-line
    }, []);
    useEffect(() => {
        dispatch({ type: "loading", payload: true });
        const filterPokemon = async () => {
            setPages(1);
            const { color, type, gender } = filter;
            let req: Promise<
                AxiosResponse<ColorResponse | TypeResponse | GenderResponse>
            >[] = [];
            let listToFilter = [...pokemon];
            if (color && color.length > 0)
                req = [
                    ...req,
                    ...color.map((v) =>
                        axios.get<ColorResponse>(
                            `https://pokeapi.co/api/v2/pokemon-color/${v}/`
                        )
                    ),
                ];
            if (type.length > 0)
                req = [
                    ...req,
                    ...type.map((v) =>
                        axios.get<TypeResponse>(
                            `https://pokeapi.co/api/v2/type/${v}/`
                        )
                    ),
                ];
            if (gender !== 0)
                req.push(
                    axios.get<GenderResponse>(
                        `https://pokeapi.co/api/v2/gender/${gender}/`
                    )
                );
            if (req.length > 0) {
                // This requests can be cached
                // Also check performance and offload map-reduce-filter to worker
                let res = await axios.all(req);
                let parsedFilter = res
                    .map((v) => {
                        if ("pokemon_species" in v.data)
                            // Check if ColorResponse
                            return v.data.pokemon_species.map((pk) =>
                                Number(pk.url.split("/").slice(-2)[0])
                            );
                        if ("pokemon" in v.data)
                            // Check if TypeResponse
                            return v.data.pokemon.map((pk) =>
                                Number(pk.pokemon.url.split("/").slice(-2)[0])
                            );
                        // Only possibility left is GenderResponse
                        return v.data.pokemon_species_details.map((pk) =>
                            Number(
                                pk.pokemon_species.url.split("/").slice(-2)[0]
                            )
                        );
                    })
                    .reduce((left, right, i) =>
                        left.filter((v) => right.includes(v))
                    );
                listToFilter = listToFilter.filter((v) =>
                    parsedFilter.includes(v.id)
                );
            }
            // Match search term
            if (search !== "")
                listToFilter = listToFilter.filter((v) => {
                    const regex = RegExp(search.toLowerCase());
                    return regex.test(`${v.id}`) || regex.test(v.name);
                });
            setList([...listToFilter]);
            dispatch({ type: "loading", payload: false });
        };
        const t = setTimeout(filterPokemon, 1000); //Debounce
        return () => clearTimeout(t);
        // eslint-disable-next-line
    }, [pokemon, search, filter]);
    return (
        <div className="browse">
            <p>Choose a pokemon to get more information</p>
            <div className="pokemon-list">
                {list.slice(0, pages * 20).map((pk) => (
                    <Card key={pk.id} name={pk.name} id={pk.id} />
                ))}
            </div>
            {loading ? (
                <div className="loading">
                    <Loader />
                    <p>Loading...</p>
                </div>
            ) : pages * 20 < list.length ? (
                <label className="styled-button">
                    <p>Load More</p>
                    <input
                        type="button"
                        value="Load more"
                        onClick={() => setPages((state) => state + 1)}
                    />
                </label>
            ) : (
                ""
            )}
            {list.length === 0 && !loading ? <div className="loading">
                    <img src="/no-result.png" alt="no-result" />
                    <p>No results found.</p>
                </div> : ""}
        </div>
    );
};

export default PokeHome;
