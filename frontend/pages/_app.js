import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider, lightTheme, darkTheme } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  polygonMumbai,
  goerli
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const { chains, provider } = configureChains(
  [polygonMumbai],
  [
    //alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), 
    //jsonRpcProvider({ url: "https://rpc.ankr.com/polygon_mumbai" }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: "inflowNFT",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme({
      accentColor: '#323232',  
      accentColorForeground: 'white',
      borderRadius: 'large',
      borderColor: 'white',
    })} >
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
