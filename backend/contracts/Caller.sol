//Caller
//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import {ISuperfluid, ISuperToken, ISuperApp} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
//import { ISuperToken } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperToken.sol";
//import { SuperTokenV1Library } from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface INFTContract {
    function setTokenUri(string memory _baseTokenUri) external;

    function returnTheBaseURI() external view returns (string memory);
}

error Streaming();
error NotStreaming();

contract Caller is Ownable {
    //using SuperTokenV1Library for ISuperToken;
    ISuperfluid private _host; // host
    IConstantFlowAgreementV1 private _cfa; // the stored constant flow agreement class address
    ISuperToken public _acceptedToken;

    INFTContract OGNFTContract;

    address public theNFTContractAddress;
    string public oldURI;
    bool streaming;

    constructor(
        address _NFTContractAddress,
        ISuperfluid host,
        IConstantFlowAgreementV1 cfa,
        ISuperToken acceptedToken
    ) {
        OGNFTContract = INFTContract(_NFTContractAddress);
        _host = host;
        _cfa = cfa;
        _acceptedToken = acceptedToken;
        theNFTContractAddress = _NFTContractAddress;

        assert(address(_host) != address(0));
        assert(address(_cfa) != address(0));
        assert(address(_acceptedToken) != address(0));
    }

    //charge to run this
    function setTokenUri(string memory _baseTokenUri) external {
        if (streaming == true) revert Streaming();
        oldURI = OGNFTContract.returnTheBaseURI();
        OGNFTContract.setTokenUri(_baseTokenUri);
        streaming = true;
        //create the flowrate
        //transfer tokens to the other contract
        _createFlow(theNFTContractAddress, 1000000000000000);  //OG 1000000000000000000
       
    }

    function stopStream() external {
        //modify it where only the streamer can close it
        if (streaming == false) revert NotStreaming();
        OGNFTContract.setTokenUri(oldURI);
        streaming = false;

        //deleteFlow - fix
        _deleteFlow(address(this), theNFTContractAddress);
    }

    function _createFlow(address to, int96 flowRate) internal {
        if (to == address(this) || to == address(0)) return;
        _host.callAgreement(
            _cfa,
            abi.encodeWithSelector(
                _cfa.createFlow.selector,
                _acceptedToken,
                to,
                flowRate,
                new bytes(0) // placeholder
            ),
            "0x"
        );
    }

    function _deleteFlow(address from, address to) internal {
        _host.callAgreement(
            _cfa,
            abi.encodeWithSelector(
                _cfa.deleteFlow.selector,
                _acceptedToken,
                from,
                to,
                new bytes(0) // placeholder
            ),
            "0x"
        );
    }

    function changeSuperToken(address acceptedToken) public onlyOwner() {
    	_acceptedToken = ISuperToken(acceptedToken);
  	}
    //function to pull out token
    function withdrawToken(IERC20 token) public onlyOwner {
        require(token.transfer(msg.sender, token.balanceOf(address(this))), "Unable to transfer");
    }
}


