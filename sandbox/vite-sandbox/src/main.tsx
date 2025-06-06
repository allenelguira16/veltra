import { createRoot } from "@veltra/app";
import { App } from "./App";

import "./main.css";

createRoot(document.getElementById("app")!, () => <App />);
