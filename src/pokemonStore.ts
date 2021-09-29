import { createStore } from "redux";
import { PokemonStore, PokeAction } from "interfaces";

const PokemonReducer = (
    state: PokemonStore = {
        pokemon: [],
        search: "",
        filter: { color: [], type: [], gender: 0 },
        loading: true,
    },
    action: PokeAction
): PokemonStore => {
    switch (action.type) {
        case "pokemon":
            return {
                ...state,
                pokemon: action.payload.pokemon,
                loading: false,
            };
        case "loading":
            return { ...state, loading: action.payload };
        case "filter":
            const { gender, color, type } = action.payload;
            return {
                ...state,
                filter: {
                    gender: gender,
                    color: color,
                    type: type,
                },
            };
        case "search":
            return { ...state, search: action.payload };
        default:
            return state;
    }
};

const pokeStore = createStore(
    PokemonReducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

export default pokeStore;
