import React from "react";  // Import react into the bundle
import ReactDOM from "react-dom";
import "../styles/index.css";  // Include your index.scss file into the bundle
import Router from "./Router.js";  // Import your own components
import "../styles/index.css"


ReactDOM.render(<Router />, document.querySelector("#app"));  // Render your react application
