import axios from "axios";
import { FilterResults, PokeAction } from "interfaces";
import { useEffect, useState } from "react";
import { Dispatch } from "redux";
import { useDispatch } from "react-redux";
import logo256 from "logo256.png"

const Filter: React.FC = (props) => {
    const dispatch = useDispatch<Dispatch<PokeAction>>();
    const [types, setTypes] = useState<
        { name: string; id: number; checked: boolean }[]
    >([]);
    const [colors, setColors] = useState<
        { name: string; id: number; checked: boolean }[]
    >([]);
    const [genders, setGenders] = useState<{ name: string; id: number }[]>([]);
    const [selectedGender, setSelectedGender] = useState(0);
    useEffect(() => {
        dispatch({
            type: "filter",
            payload: {
                gender: selectedGender,
                color: [...colors.filter((v) => v.checked).map((v) => v.id)],
                type: [...types.filter((v) => v.checked).map((v) => v.id)],
            },
        });
        // eslint-disable-next-line
    }, [selectedGender, colors, types]);
    useEffect(() => {
        axios
            .all([
                axios.get<FilterResults>("https://pokeapi.co/api/v2/type"),
                axios.get<FilterResults>(
                    "https://pokeapi.co/api/v2/pokemon-color"
                ),
                axios.get<FilterResults>("https://pokeapi.co/api/v2/gender"),
            ])
            .then(
                axios.spread((typeRes, colorRes, genderRes) => {
                    setTypes(
                        typeRes.data.results.map((v) => {
                            return {
                                name: v.name,
                                id: Number(v.url.split("/").slice(-2)[0]),
                                checked: false,
                            };
                        })
                    );
                    setColors(
                        colorRes.data.results.map((v) => {
                            return {
                                name: v.name,
                                id: Number(v.url.split("/").slice(-2)[0]),
                                checked: false,
                            };
                        })
                    );
                    setGenders([
                        { name: "All", id: 0 },
                        ...genderRes.data.results.map((v) => {
                            return {
                                name: v.name,
                                id: Number(v.url.split("/").slice(-2)[0]),
                            };
                        }),
                    ]);
                })
            )
            .catch((err) => console.error(err));
        // eslint-disable-next-line
    }, []);
    return (
        <div className="filter">
            <label className="styled-button">
                <p>Reset Filters</p>
                <input
                    type="button"
                    value="Reset Filters"
                    onClick={() => {
                        setColors((status) =>
                            status.map((v) => {
                                return { ...v, checked: false };
                            })
                        );
                        setTypes((status) =>
                            status.map((v) => {
                                return { ...v, checked: false };
                            })
                        );
                        dispatch({type: "search", payload: ""})
                        setSelectedGender(0);
                    }}
                />
            </label>
            <p>Types:</p>
            <div className="type">
                {types.map(
                    (
                        v,
                        i // Render type checkboxes
                    ) => (
                        <label key={`types-${v.id}`}>
                            <input
                                type="checkbox"
                                name={v.name}
                                id={`type-${v.id}`}
                                checked={v.checked}
                                onChange={(e) =>
                                    setTypes((oldState) => {
                                        const newState = [...oldState];
                                        newState[i].checked = e.target.checked;
                                        return newState;
                                    })
                                }
                            />
                            <span>{`${v.name}`}</span>
                            <img src={logo256} alt={`check-${v.name}`} />
                        </label>
                    )
                )}
            </div>
            <p>Colors:</p>
            <div className="colors">
                {colors.map(
                    (
                        v,
                        i // Render colors checkboxes
                    ) => (
                        <label
                            key={`color-${v.id}`}
                            style={{ ["--bg" as any]: `${v.name}` }}
                        >
                            <input
                                type="checkbox"
                                name={v.name}
                                id={`color-${v.id}`}
                                checked={v.checked}
                                onChange={(e) =>
                                    setColors((oldState) => {
                                        const newState = [...oldState];
                                        newState[i].checked = e.target.checked;
                                        return newState;
                                    })
                                }
                            />
                            <span>{`${v.name}`}</span>
                        </label>
                    )
                )}
            </div>
            <p>Genders:</p>
            <div className="genders">
                {genders.map((v) => {
                    // Render gender radios
                    return (
                        <label key={`gender-${v.id}`}>
                            <input
                                type="radio"
                                name={v.name}
                                id={`gender-${v.id}`}
                                checked={selectedGender === v.id}
                                onChange={() => setSelectedGender(v.id)}
                            />
                            <span>{`${v.name}`}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};

export default Filter;
