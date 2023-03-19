import Head from 'next/head';
import Nav from '../components/Nav';
import Caller from "../contract/callerContract.json";
import { useRef, useEffect } from 'react';
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";

export default function Ad() {
  const iframeRef = useRef(null);

  const CALLINGCONTRACT = '0xF550146991831Be20872fA4809b23dadCc371C43'
  let toggle = false;

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
      toggle = !toggle;
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


  useEffect(() => {
    if (toggle) {
      iframeRef.current.contentWindow.location.reload();
    }
  }, [toggle]);

  const { data: stopData, writeAsync: stopStream, isLoading: stopIsLoading, isSuccess: stopIsSuccess } = useContractWrite(stopConfig);

  const stopStreamFunction = async () => {
    try {
      let stopTxn = await stopStream?.();
      setLoading(true);
      await stopTxn.wait();
      setLoading(false);
      setNFTMinted(true);
      toggle = !toggle;
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
        <div className="flex">
        <button
          className="bg-black text-white border-white border rounded-full px-12 py-6 font-bold mb-5 mr-5 hover:bg-red-500 hover:scale-110 transition-all duration-300"
          onClick={callingStream}
        >
          Launch campaign
        </button>
      
        <button
          className="bg-black text-white border-white border rounded-full px-12 py-6 font-bold mb-5 hover:bg-red-500 hover:scale-110 transition-all duration-300"
          onClick={stopStreamFunction}
        >
          Stop stream
        </button>
      </div>
    
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
