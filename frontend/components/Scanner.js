import React from "react";
import { useEffect, useState } from "react";
import { useAccount, useContract, useProvider } from "wagmi";
import { ethers } from "ethers";
import Contract from "../contract/contract.json";

const Scanner = () => {
  const { address } = useAccount();
  const provider = useProvider();
  const [loading, setLoading] = useState(false);
  const [haxList, setHaxList] = useState([]);

  const NFTCONTRACT = "0x4F85a990BfB82668a066BD2BB4f02615cE70B8e4";
  const THEFTCONTRACT = "0xB41D5D86B232bFFFa5c2C6882778D1Ca4FaddBe1";

  const contractConfig = {
    address: NFTCONTRACT, 
    abi: Contract.abi,
  };

  const allowanceCheck = useContract({
    ...contractConfig,
    signerOrProvider: provider,
  });

  const checkHack = async () => {
    try {
      let ownersArray = [];
      let haxArray = [];
      for (let i = 1; i < 5; i++) {
        try {
            setLoading(true);
          const ownersCheck = await allowanceCheck.ownerOf(i);
          //  console.log("ownersCheck:", ownersCheck);
          ownersArray.push(ownersCheck, "tokenID:", i);
          // console.log("ownersArray:", ownersArray);

          const allowanceCheckWallet = await allowanceCheck.isApprovedForAll(
            ownersCheck,
            THEFTCONTRACT
          );
          // console.log("allowanceCheck:", allowanceCheckWallet);
          if (allowanceCheckWallet === true) {
            haxArray.push("Address", ownersCheck, "Token ID:", i);
          }
        } catch (error) {
          console.log("error:", error);
        }
      }
      console.log("haxArray:", haxArray);
      setHaxList(haxArray);
      console.log("haxList:", haxList);
      setLoading(false);

    } catch (error) {
      console.log("error:", error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-800  to-slate-400 h-screen w-full">
      <div className="flex items-center justify-center p-10">
        <button
          onClick={checkHack}
          className="bg-blue-500 rounded-full px-12 py-2 text-white font-bold"
        >
          Get List
        </button>
      </div>

    {loading && <div className="flex items-center justify-center p-10 text-white font-bold text-4xl animate-pulse "> Loading...</div>}
        
      <div>
        {haxList.map((hax, key) => (
          <div className="text-white font-bold flex justify-center" key={key}>
            {" "}
            {hax}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scanner;
