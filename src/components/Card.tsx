import React from "react";
import { Link } from "react-router-dom";

const Card: React.FC<{ name: string; id: number }> = React.memo(
    ({ name, id }) => {
        return (
            <Link to={`/details/${id}`}>
                <div className="pokemon">
                    <img
                        src={`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${String(
                            id
                        ).padStart(3, "0")}.png`}
                        alt={`${name}-img`}
                    />
                    <p>{name.toUpperCase()}</p>
                </div>
            </Link>
        );
    }
);
export default Card;
