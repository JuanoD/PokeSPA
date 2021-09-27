import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { PokeHome, Details } from "./components";
import { Provider } from "react-redux";
import pokeStore from "./pokemonStore";

function App() {
    return (
        <Provider store={pokeStore}>
            <Router>
                <PokeHome />
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
