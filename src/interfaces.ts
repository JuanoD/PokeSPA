export interface Pokemon {
    name: string;
    id: number;
}

export interface PokemonStore {
    pokemon: Pokemon[];
    search: string;
    filter: Filter;
    loading: boolean;
}

export interface Filter {
    color: number[];
    type: number[];
    gender: number;
}

export interface PokeAction {
    type: string;
    payload: any;
}

export interface FilterResult {
    name: string;
    url: string;
}

export interface FilterResults {
    results: FilterResult[];
}

export interface GenderResponse {
    id: number;
    name: string;
    pokemon_species_details: { pokemon_species: FilterResult; rate: number }[];
}

export interface TypeResponse {
    pokemon: { pokemon: FilterResult; slot: number }[];
}

export interface ColorResponse {
    name: string;
    pokemon_species: FilterResult[];
}
