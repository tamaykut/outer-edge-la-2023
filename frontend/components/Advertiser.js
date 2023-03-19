import dynamic from "next/dynamic";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import heroImage from "../images/lp.jpg";
import React, { useState, useEffect } from "react";

const Advertiser = () => {
  const [isToggled, setIsToggled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const [ethCounter, setEthCounter] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let ethInterval, timeInterval;
    if (isRunning) {
      ethInterval = setInterval(() => {
        setEthCounter((prevCounter) =>
          (Number(prevCounter) + 0.00001).toFixed(5)
        );
      }, 250);

      timeInterval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      clearInterval(ethInterval);
      clearInterval(timeInterval);
    };
  }, [isRunning]);

  const toggle = () => {
    setIsToggled((prev) => !prev);
  };

  const startCountdown = () => {
    setTimeLeft(60);
    setEthCounter(0);
    setIsRunning(true);
  
    setTimeout(() => {
      setIsRunning(false);
    }, 60000);
  };

  const disableButton = isRunning ? "opacity-50 cursor-not-allowed" : "";

  return (
    <div className="bg-black h-screen w-full flex flex-col items-center justify-center">
      <h1 className="text-5xl md:text-7xl font-bold pt-10 text-white mb-5">
        NFT #xyz
      </h1>
      
      <div className="h-full flex flex-col items-center justify-center">
        <div className="flex pt-3 mx-auto items-center">
          <p className="text-2xl text-white mr-2">Advertising</p>
          <div>
            <button className="bg-donut hover:bg-yellow-600 rounded-full px-6 py-2 text-black font-bold md:mb-0 min-w-1/4 max-w-full" onClick={toggle}>
              {isToggled ? 'On' : 'Off'}
            </button>
          </div>
        </div>
        <Image src={heroImage} alt="heroBanner" className="h-auto w-600" />
        { isToggled && <div className="mt-5 flex items-center justify-center space-x-8">
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
            className={`bg-donut hover:bg-yellow-600 rounded-full px-12 py-2 text-black font-bold md:mb-0 min-w-1/4 max-w-full ${disableButton}`}
            onClick={startCountdown}
            disabled={isRunning}
          >
            {isRunning ? "Campaign Running" : "Start Campaign"}
          </button>
        </div> }
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Advertiser), { ssr: false });
