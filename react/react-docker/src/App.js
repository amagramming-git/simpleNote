import React from 'react';
import { Route, BrowserRouter, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Auth from './components/Auth';
import MainPage from "./components/MainPage";

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Auth} />
          <Route exact path="/home" component={MainPage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
