import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app/App";
import "./style/style.scss";

/* import MarvelServices from "./services/MarvelServices";
const marver = new MarvelServices();
marver.getAllCharacters()
.then(res => console.log(res)) */

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
