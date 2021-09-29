import { PokemonStore } from "interfaces";
import { useDispatch, useSelector } from "react-redux";
import logo256 from "logo256.png"

const Bar: React.FC = (props) => {
    const search = useSelector<PokemonStore, string>((store) => store.search);
    const dispatch = useDispatch();
    return (
        <div className="bar">
            <img src={logo256} alt="logo" />
            <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                    dispatch({ type: "search", payload: e.target.value });
                }}
            />
        </div>
    );
};

export default Bar;
