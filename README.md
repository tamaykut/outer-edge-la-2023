# outer-edge-la-2023
# INFLOW NFT

- [x] Concept & design
- [x] Build frontend
- [x] Build backend
- [x] Build smart contracts
- [x] Deploy smart contracts to Testnet
- [x] Test user flow and transactions in localhost
- [x] Deploy fully functional dApp via Netlify
- [x] Record demo video
- [x] Finalize deck
- [ ] Recover :)

## Details

Inflow NFT is an NFT asset that allows users to monetize the NFT ownership via ad views and a distributed advertising dollars model.

It is a suite of smart contracts that streams gas-efficient revenue from a campaign wallet to both the NFT creator and holder wallets. Funds are 
distributed per second due to the super tokens protocol ability. This mean that as a video ad runs, people can be paid for the number of seconds it is 
actually watched.  

Advertisers have the abillity to pay NFT holders to advert to them directly via their NFTs.
The advertiser will pay to stream money from the caller contract to the NFT collection contract using
SuperFluid's streaming money platform.  We chose streaming because we want the advertising to last as
long as the advertiser is willing to pay to keep the advert up (longer the advert the bigger the cost).
The NFT handles the distribution of the income earned through the revenue streaming.  Each NFT
accounts for 1 equal claim of the income recieved.  Handling thousands of wallets, leveraging SuperFluids
Instant Distribution System we can save a massive amount of gas and resources handling the dynamic distribution.  Considering much of the trading that happens with NFTs, the transfer of ownership is taken accounted for within the NFT releasing the rights to claim from the original owner to the new owner for future claims.

| [Watch Streams](https://console.superfluid.finance/mumbai/accounts/0xf550146991831be20872fa4809b23dadcc371c43?tab=streams) | See the money paid out in real time

 [Video Demo](https://www.loom.com/share/37c086bf144e479eb151043f8e11da45) | 
 [Live Site](https://64177103b99a7b000828ac4d--musical-pika-fed894.netlify.app/) | 

 | Mumbai | ------ Deployments ------ |
 | --------------------------------------------- | ------------------------------------------------------------------ |
 | [NFT Contract Address](https://mumbai.polygonscan.com/address/0xb5dB35352F20E35F2370f990d31c261CF2FA1C3a) | 0xbCe18071E78B0bCE00db6A243a9585Ae5e3A7D05 |
 | [Streaming Contract ](https://mumbai.polygonscan.com/address/0x58ed25d94F562565A89Cd425A84D069813Bf934e) | 0xF550146991831Be20872fA4809b23dadCc371C43 |


## Technologies

This project is built with the following open source libraries, frameworks and languages. User choice of framework used, available in plain js or typescript.
| Tech | Description |
| --------------------------------------------- | ------------------------------------------------------------------ |
| ------ | ------ React Frontend Environment ------ |
| [Next JS](https://nextjs.org/) | React Framework |
| ------ | ------ CSS Framework ------ |
| [Tailwind](https://tailwindcss.com/) | A utility-first CSS framework |
| ------ | ------ Ethereum Development Environment ------ |
| [Hardhat](https://hardhat.org/) | Ethereum development environment for professionals |
| ------ | ------ Included Libraries ------ |
| [WAGMI](https://wagmi.sh/) | A set of React Hooks for Web3 |
| [RainbowKit](https://www.rainbowkit.com/docs/introduction) | RainbowKit is a React library that makes it easy to add wallet connection to your dapp. |
| [SuperFluid](https://www.superfluid.finance/) | Money Streaming and distribution platform






## To Work on

- The ability to wrap the native token seemlessly to the wrapped streaming token asset
- The ability for users to "OPT IN"
- Instant payment rewarded for every second of ad content watched, instead of ongoing money stream

