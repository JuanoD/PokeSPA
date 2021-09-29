import axios from "axios";
import { Pokemon } from "interfaces";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface EvolutionChain {
    evolves_to: EvolutionChain[] | null;
    species: Pokemon;
}

const renderEvolutionChain = (evolChain: EvolutionChain | null) => {
    if (evolChain === null) return "";
    return (
        <div key={evolChain.species.id} className="evol-container">
            <div className="evolution">
                <Link to={`/details/${evolChain.species.id}`}>
                    <img
                        src={`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${String(
                            evolChain.species.id
                        ).padStart(3, "0")}.png`}
                        alt={evolChain.species.name}
                    />
                    <p>{evolChain.species.name}</p>
                </Link>
            </div>
            {evolChain.evolves_to !== null ? (
                <div className="evol-flex">
                    {evolChain.evolves_to.map(renderEvolutionChain)}
                </div>
            ) : (
                ""
            )}
        </div>
    );
};

const parseEvolutionChain = (data: any) => {
    if (data)
        return {
            species: {
                name: data.species.name as string,
                id: Number(data.species.url.split("/").slice(-2)[0]),
            },
            evolves_to:
                data.evolves_to.length > 0
                    ? data.evolves_to.map(parseEvolutionChain)
                    : null,
        };
    else return null;
};

const Details: React.FC = (props) => {
    const { id } = useParams<{ id: string }>();
    const [info, setInfo] = useState<{
        name: string;
        description: string;
        height: number;
        weight: number;
        category: string;
        gender: string;
        habitat: string;
        color: string;
        types: string[];
        evolution: EvolutionChain | null;
    }>({
        name: "",
        description: "",
        height: 0,
        weight: 0,
        category: "",
        gender: "",
        habitat: "",
        color: "",
        types: [],
        evolution: null,
    });
    useEffect(() => {
        const getData = async () => {
            const result = await axios.all(
                [
                    `https://pokeapi.co/api/v2/pokemon/${id}`,
                    `https://pokeapi.co/api/v2/pokemon-species/${id}`,
                ].map((v) => axios.get(v))
            );
            const data = { ...result[0].data, ...result[1].data };
            const evolution = await axios.get(data.evolution_chain.url);
            const newInfo = { ...info };
            newInfo.name = data.name;
            newInfo.description = data.flavor_text_entries.filter(
                (v: any) => v.language.name === "en"
            )[0].flavor_text;
            newInfo.height = data.height;
            newInfo.weight = data.weight;
            newInfo.category = data.genera.filter(
                (v: any) => v.language.name === "en"
            )[0].genus;
            switch (data.gender_rate) {
                case 0:
                    newInfo.gender = "Male";
                    break;
                case 8:
                    newInfo.gender = "Female";
                    break;
                case -1:
                    newInfo.gender = "Genderless";
                    break;
                default:
                    newInfo.gender = "Male - Female";
                    break;
            }
            newInfo.habitat = data.habitat?.name || "Undefined";
            newInfo.color = data.color.name;
            newInfo.types = data.types.map((v: any) => v.type.name);
            newInfo.evolution = parseEvolutionChain(evolution.data.chain);
            setInfo(newInfo);
            document.title = `PokeSPA | ${data.name.toUpperCase()} Details`;
        };
        getData();
        return () => {
            document.title = "PokeSPA";
        };
        // eslint-disable-next-line
    }, [id]);
    return (
        <>
            <Link to="/">
                <div className="overlay"></div>
            </Link>
            <div className="details">
                <img
                    src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id.padStart(
                        3,
                        "0"
                    )}.png`}
                    alt={`pk-${id}`}
                />
                <div className="data">
                    <div>
                        <p>{info.name}</p>
                        <p>{id.padStart(3, "0")}</p>
                    </div>
                    <p>{info.description}</p>
                    <div>
                        <p>Height</p>
                        <p>{info.height * 10} cm</p>
                    </div>
                    <div>
                        <p>Weight</p>
                        <p>{info.weight * 100} g</p>
                    </div>
                    <div>
                        <p>Category</p>
                        <p>{info.category}</p>
                    </div>
                    <div>
                        <p>Gender</p>
                        <p>{info.gender}</p>
                    </div>
                    <div>
                        <p>Habitat</p>
                        <p>{info.habitat}</p>
                    </div>
                    <div>
                        <p>Color</p>
                        <p>{info.color}</p>
                    </div>
                    <div className="pokemon-detail-types">
                        <p>Types:</p>
                        <div>
                            {info.types.map((v) => (
                                <p key={v}>{v}</p>
                            ))}
                        </div>
                    </div>
                </div>
                {info.evolution?.evolves_to === null ? (
                    <div>This pokemon does not evolve</div>
                ) : (
                    renderEvolutionChain(info.evolution)
                )}
                <Link to="/">
                    <div className="close">X</div>
                </Link>
            </div>
        </>
    );
};

export default Details;
