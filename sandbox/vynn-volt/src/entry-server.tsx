/// <reference types="vinxi/types/server" />
import "./main.css";

import { Assets, createServer, Scripts, VynnApp } from "@vynn/volt/server";

function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vynn App</title>
        <Assets />
      </head>
      <body>
        <VynnApp />
        <Scripts />
      </body>
    </html>
  );
}

export default createServer(App);
