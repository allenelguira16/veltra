import { createRoot } from "../mini-app";
import { App } from "./App";

import "./main.css";

createRoot(document.getElementById("app")!, <App />);
