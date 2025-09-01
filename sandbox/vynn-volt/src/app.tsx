import "./main.css";

import { AppProps } from "@vynn/volt";

export default function App({ assets, scripts, children: Children }: AppProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vynn App</title>
        {assets}
      </head>
      <body>
        <Children />
        {scripts}
      </body>
    </html>
  );
}
