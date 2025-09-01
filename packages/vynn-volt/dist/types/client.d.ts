import { JSX } from 'vynn';
import { AppProps } from './index.js';
import 'vinxi';
import 'vite';

declare const hydrateClient: (App: (props: AppProps) => JSX.Element) => Promise<void>;

export { hydrateClient };
