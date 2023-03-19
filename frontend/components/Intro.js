import dynamic from "next/dynamic";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import heroImage from "../images/NFT1.png";

import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";
import React, { useState, useEffect } from "react";
import Contract from "../contract/contract.json";
import Caller from "../contract/callerContract.json";
import { useRouter } from 'next/router';


const Intro = () => {
  const COUNTDOWN_TIME = 10; // Define the countdown time in seconds
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [nftMinted, setNFTMinted] = useState(false);
  const [isToggled, setIsToggled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10);
  const [ethCounter, setEthCounter] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const router = useRouter();

  useEffect(() => {
    let ethInterval;
    if (isRunning) {
      ethInterval = setInterval(() => {
        setEthCounter((prevCounter) =>
          (Number(prevCounter) + 0.00001).toFixed(5)
        );
      }, 250);
    }
  
    return () => {
      clearInterval(ethInterval);
    };
  }, [isRunning]);
  
  const startCountdown = () => {
    setTimeLeft(COUNTDOWN_TIME);
    setEthCounter(0);
    setIsRunning(true);
  
    const countdownInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          clearInterval(countdownInterval);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const toggle = () => {
    setIsToggled((prev) => !prev);
  };

  const NFTCONTRACT = '0xbCe18071E78B0bCE00db6A243a9585Ae5e3A7D05'
  const CALLINGCONTRACT = '0xF550146991831Be20872fA4809b23dadCc371C43'

  const contractConfig = {
    address: NFTCONTRACT,
    abi: Contract.abi,
  };

  const callingContractConfig = {
    address: CALLINGCONTRACT,
    abi: Caller.abi,
  };

  const resetMinter = async () => {
    setNFTMinted(false);
  };

  //wagmi Mint  //////////////////////////////////
  const { config: approveConfig, data } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "mint",
   // args: [THEFTCONTRACT, true],
    overrides: {
      gasLimit: 1500000,
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  //writeAsync - instead of WRiTE
  const {
    data: approveData,
    writeAsync: tokenClaim,
    isLoading,
    isSuccess,
  } = useContractWrite(approveConfig);

  const approveFunction = async () => {
    try {
      let nftTxn = await tokenClaim?.();
      setLoading(true);
      await nftTxn.wait();
      setLoading(false);
      setNFTMinted(true);
    } catch (error) {
      console.log(error);
    }
  };
  //////////////////////////////////////////////////////
  
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


  

  const disableButton = isRunning ? "opacity-50 cursor-not-allowed" : "";

  return (
    <div className="bg-black h-screen w-full ">
      <div className="flex flex-col md:flex-row px-5 justify-center lg:mr-16 h-screen w-full">
        <div className="m-auto  pt-14 md:pt-0 ml-auto mr-auto md:ml-24 md:mr-10">
          <div>
          
            <Image src={heroImage} alt="heroBanner" width ={400} height={400}/> 
            { isToggled && isConnected && <div className="mt-5 flex items-center justify-center space-x-8">
            <div className="text-center">
              <p className="text-2xl md:text-4xl font-bold text-white">
                {timeLeft}
              </p>
              <p className="text-white">Seconds Left</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-4xl font-bold text-white">{ethCounter}</p>
              <p className="text-white">ETH</p>
            </div>
            <button
              className="bg-black text-white border-white border rounded-full px-12 py-6 font-bold mb-5 mr-5 hover:bg-red-500 hover:scale-110 transition-all duration-300"
              onClick={startCountdown}
              disabled={isRunning}
            >
              {isRunning ? "Campaign Running" : "Start Campaign"}
            </button>

            
          </div> }  
          </div>
        </div>

        <div className="flex flex-col  items-center justify-center -mt-6 md:mt-0 sm:-ml-0 md:-ml-12">
          <div className="text-center md:text-left md:ml-16 space-x-2 space-y-5">
            <h1 className="text-xl md:text-3xl font-bold text-white ">
              Claim your NFT and earn money
            </h1>
            <h1 className="text-md md:text-xl text-white">
              Connect Your Wallet and Claim
            </h1>

            {/* {!nftMinted && (
              <p className="text-white text-sm md:text-base">
                Register your wallet by signing <br />
                This will put you on the VIP list
              </p>
            )} */}

            <div className="flex flex-col max-w-xs items-center text-center md:items-start ">
              {!isLoading && !loading && !nftMinted && isConnected && (
                <div className="flex flex-col space-y-4">
                  <button
                  className="bg-black text-white border-white border rounded-full px-12 py-6 font-bold mb-5 mr-5 hover:bg-red-500 hover:scale-110 transition-all duration-300"
                  onClick={approveFunction}
                  >
                    Mint
                  </button>
                  <h1 className="text-md md:text-xl text-white">
                    Earn money via advertising
                  </h1>
                  <button 
                    className="bg-black text-white border-white border rounded-full px-12 py-6 font-bold mb-5 mr-5 hover:bg-red-500 hover:scale-110 transition-all duration-300"
                    onClick={toggle}>
                    {isToggled ? 'On' : 'Off'}
                  </button>
                </div>
              )}

              {!isConnected && (
                <>
                  <ConnectButton/>
                </>
              )}

              {isLoading && !loading && !nftMinted && isConnected && (
                <button 
                className="bg-black text-white border-white border rounded-full px-12 py-6 font-bold mb-5 mr-5 hover:bg-red-500 hover:scale-110 transition-all duration-300"
                >
                  Loading
                </button>
              )}

              {loading && !nftMinted && isConnected && (
                <h2 className="w-1/2 text-white font-3xl font-bold animate-pulse mb-10 md:mb-0">
                  Verifying...
                </h2>
              )}

              {nftMinted && !loading && (
                <div className="space-y-2 mb-10">
                  <h3 className="text-lg font-semibold text-white ">
                    You have now claimed your NFT!
                  </h3>

                  <br></br>
                  <button
                    className="bg-black text-white border-white border rounded-full px-12 py-6 font-bold mb-5 mr-5 hover:bg-red-500 hover:scale-110 transition-all duration-300"
                    onClick={() => resetMinter()}
                  >
                    Go Back
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// export default Intro;
export default dynamic(() => Promise.resolve(Intro), { ssr: false });