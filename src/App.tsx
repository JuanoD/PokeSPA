import "./App.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { PokeHome, Details, Bar, Filter } from "./components";
import { Provider } from "react-redux";
import pokeStore from "./pokemonStore";

function App() {
    return (
        <Provider store={pokeStore}>
            <Router>
                <div className="main">
                  <Bar />
                  <Filter />
                  <PokeHome />
                </div>
                <Switch>
                    <Route path="/details/:id">
                        <Details />
                    </Route>
                </Switch>
            </Router>
        </Provider>
    );
}

export default App;
