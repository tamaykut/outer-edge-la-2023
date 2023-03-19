import Head from 'next/head';
import Nav from '../components/Nav';
import Caller from "../contract/callerContract.json";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";

export default function Ad() {

  const CALLINGCONTRACT = '0xF550146991831Be20872fA4809b23dadCc371C43'

  const callingContractConfig = {
    address: CALLINGCONTRACT,
    abi: Caller.abi,
  };

  //wagmi Calling Contract  //////////////////////////////////
  const { config: callingConfig, data: callData } = usePrepareContractWrite({
    ...callingContractConfig,
    functionName: "setTokenUri",
    args: ["https://wn2nlt2slbn27yjxuoxd23ufdep7qghrhjkp3o4ogm4y6altlhia.arweave.net/s3TVz1JYW6_hN6OuPW6FGR_4GPE6VP27jjM5jwFzWdA"],  // <<<<<<<<<<<<<<<< Hardcoded Advertisement URI
    overrides: {
      gasLimit: 1500000,
    },  
    onError(error) {
      console.log("Error", error);
    },
  });

  const {
    data: callingData,
    writeAsync: callingContract,
    isLoading: callingIsLoading,
    isSuccess: callingIsSuccess,
  } = useContractWrite(callingConfig);

  const callingStream = async () => {
    try {
      let callingTxn = await callingContract?.();
      setLoading(true);
      await callingTxn.wait();
      setLoading(false);
      setNFTMinted(true);
      
    } catch (error) {
      console.log(error);
    }
  };
  //////////////////////////////////////////////////////

  ///Stop Stream ///////////////////////////////////////
  const { config: stopConfig, data: stopStreamData } = usePrepareContractWrite({
    ...callingContractConfig,
    functionName: "stopStream",
    overrides: {
      gasLimit: 1500000,
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  const { data: stopData, writeAsync: stopStream, isLoading: stopIsLoading, isSuccess: stopIsSuccess } = useContractWrite(stopConfig);

  const stopStreamFunction = async () => {
    try {
      let stopTxn = await stopStream?.();
      setLoading(true);
      await stopTxn.wait();
      setLoading(false);
      setNFTMinted(true);
    } catch (error) {
      console.log(error);
    }
  };  
  //////////////////////////////////////////////////////

  return (
    <div className="bg-black h-screen w-full ">
      <Head>
        <title>Talking NFT</title>
        <meta name="description" content="Created at Outer Edge Hackerthon LA" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />
      <div className="flex flex-col items-center justify-center h-screen">
        <button
          className={`bg-donut hover:bg-yellow-600 rounded-full px-12 py-2 text-black font-bold mb-5`}
          onClick={callingStream}
        >
          Start advertising
        </button>
        <button
          className={`bg-donut hover:bg-yellow-600 rounded-full px-12 py-2 text-black font-bold`}
          onClick={stopStreamFunction}
        >
          Stop stream
        </button>
        <iframe
          src="https://console.superfluid.finance/mumbai/accounts/0xf550146991831be20872fa4809b23dadcc371c43?tab=streams"
          width="100%"
          height="600px"
          frameBorder="0"
          className="m-5"
        ></iframe>
      </div>
      
    </div>
  );
}
