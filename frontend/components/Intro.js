import dynamic from "next/dynamic";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
//import heroImage from "../images/pandar.png";
import heroImage from "../images/lp.jpg";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";
import React, { useState } from "react";
import Contract from "../contract/contract.json";
import { useRouter } from 'next/router';


const Intro = () => {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [nftMinted, setNFTMinted] = useState(false);
  const router = useRouter();


  const NFTCONTRACT = '0x038190293f20c15B22174c064e95B9Aeab7d83C8'

  const contractConfig = {
    address: NFTCONTRACT, //process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: Contract.abi,
  };

  const resetMinter = async () => {
    setNFTMinted(false);
  };

  //wagmi Mint
  const { config: approveConfig, data } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "safeMint",
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

  const earnNft = async () => {
    router.push('/Earn');
  }

  return (
    <div className="bg-black h-screen w-full ">
      <div className="flex flex-col md:flex-row px-5 justify-center lg:mr-16 h-screen w-full">
        <div className="m-auto  pt-14 md:pt-0 ml-auto mr-auto md:ml-24 md:mr-10">
          <div>{<Image src={heroImage} alt="heroBanner" width={400} />}</div>
        </div>

        <div className="flex flex-col  items-center justify-center -mt-6 md:mt-0 sm:-ml-0 md:-ml-12">
          <div className="text-center md:text-left md:ml-16 space-x-2 space-y-5">
            <h1 className="text-5xl md:text-7xl font-bold text-white ">
              Claim Your NFT
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
                  className="bg-donut hover:bg-yellow-600 rounded-full px-12 py-2 text-black font-bold md:mb-0 min-w-1/4 max-w-full"
                  onClick={approveFunction}
                  >
                    Claim
                  </button>
                  <button
                  className="bg-donut mx-auto hover:bg-yellow-600 rounded-full px-12 py-2 text-black font-bold md:mb-0 min-w-1/4 max-w-full"
                  onClick={earnNft}
                  >
                    View NFT
                  </button>
                </div>
              )}

              {!isConnected && (
                <>
                  <ConnectButton />
                </>
              )}

              {isLoading && !loading && !nftMinted && isConnected && (
                <button className="w-1/2 bg-donut hover:bg-yellow-600 rounded-full px-12 py-2  text-black font-bold mb-10 md:mb-0">
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
                    className="bg-donut hover:bg-yellow-600 text-black font-bold rounded-full px-12 py-2 sm:w-auto mb-10 md:mb-0"
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
