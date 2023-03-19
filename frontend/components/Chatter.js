import dynamic from "next/dynamic";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
//import heroImage from "../images/pandar.png";
import heroImage from "../images/lp.jpg";
import React, { useState } from "react";


const Chatter = () => {
  const [userInput, setUserInput] = useState('');
  const onUserChangedText = (event) => {
    // console.log(event.target.value);
    setUserInput(event.target.value);
  };

  const [apiOutput, setApiOutput] = useState('test')
  const [isGenerating, setIsGenerating] = useState(false)

  const getFeedback = async () => {
    console.log("user input is " + userInput)

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userInput: userInput
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch API');
    }
    
    const { output } = await response.json();
    console.log(output);
    setApiOutput(output.text);
    // setApiOutput(finalChoice.text);
    setIsGenerating(false);
  }

  return (
    <div className="bg-black h-screen w-full flex flex-col space-y-5 items-center justify-center">
      <h1 className="text-5xl md:text-7xl font-bold pt-10 text-white mb-5">
        Let's go! Ask me anything!
      </h1>  
      <div>
        <Image src={heroImage} alt="heroBanner" width={400} />
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col max-w-xs items-center justify-center text-center md:items-start">
          <div className="flex justify-center w-full">
            <textarea
              className="prompt-box"
              placeholder="Ask your question here"
              value={userInput}
              onChange={onUserChangedText}
              />;
          </div>
          <div className="flex pt-3 mx-auto justify-center">
          <button
            className="bg-donut hover:bg-yellow-600 rounded-full px-12 py-2 text-black font-bold md:mb-0 min-w-1/4 max-w-full"
            onClick={getFeedback}
            >
            Chat
          </button>
        </div>
        
        {/* New code I added here */}
        {apiOutput && (
          <div className="output">
            <div className="output-header-container">
              <div className="output-header pt-5">
                <h2 className="text-xl md:text-4xl font-bold text-white mb-5">
                  Output
                </h2>  
              </div>
            </div>
            <div className="output-content text-l md:text-xl font-bold text-white mb-5 overflow-auto max-h-80">
              <p>{apiOutput}</p>
            </div>
          </div>
        )}        
        </div>
      </div>
    </div>
  );
};

// export default ChatMain;
export default dynamic(() => Promise.resolve(Chatter), { ssr: false });
