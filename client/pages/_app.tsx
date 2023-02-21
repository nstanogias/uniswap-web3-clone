import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import { ApiProvider } from '../context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider activeChain={ChainId.Goerli}>
      <ApiProvider>
        <Component {...pageProps} />
       </ApiProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
