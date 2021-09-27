import { createStore } from "redux";

interface Pokemon {
    name: string;
}

interface PokemonStore {
    pokemon: Pokemon[];
    next: string;
}

interface action {
    type: string;
    payload: any;
}

const PokemonReducer = (
    state: PokemonStore = { pokemon: [], next: "" },
    action: action
) => {
    switch (action.type) {
        case "initial-load":
            const pokemon = localStorage.getItem("pokemon");
            if (pokemon !== null) return JSON.parse(pokemon);
            return state;
        case "more":
            return {
                next: action.payload.next,
                pokemon: [...state.pokemon, ...action.payload.more],
            };
        default:
            return state;
    }
};

const pokeStore = createStore(PokemonReducer);

export default pokeStore;
