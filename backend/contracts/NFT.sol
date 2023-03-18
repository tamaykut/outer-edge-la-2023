//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; 
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {ISuperfluid, ISuperToken } from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";
import {IInstantDistributionAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IInstantDistributionAgreementV1.sol";
import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";


error MaxSupplyExceeded();
error ContractPaused();
error NotContractCaller();

contract NFTContract is ERC721, Ownable, ERC721Burnable, ERC2981 {
    using Strings for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    //SuperFluic Variables
    /// @notice Super token to be distributed.
    ISuperToken public spreaderToken;
    /// @notice SuperToken Library
    using SuperTokenV1Library for ISuperToken;
    /// @notice Index ID. Never changes.
    uint32 public constant INDEX_ID = 0;

    uint256 public constant MAX_SUPPLY = 250;
    uint256 public totalSupply;

    string private baseTokenUri;
    address public contractCaller = address(0);

    bool public pause;

    mapping(address => uint256) public totalMints;

    
    constructor(uint96 _royaltyFeesInBips, string memory _URI, address _royalty, ISuperToken _spreaderToken) ERC721("Chat NFT", "INFT") {
        setRoyaltyInfo(_royalty, _royaltyFeesInBips);
        baseTokenUri = _URI;
        _tokenIdCounter.increment();

        spreaderToken = _spreaderToken;
        // Creates the IDA Index through which tokens will be distributed
        _spreaderToken.createIndex(INDEX_ID);
    }

    function mint() external {
        if (pause == true) revert ContractPaused();
        if (totalSupply >= MAX_SUPPLY) revert MaxSupplyExceeded();
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        gainShare(msg.sender);
        totalSupply++;
    }

    function adminMint(address to) external onlyOwner {
        if (pause == true) revert ContractPaused();
        if (totalSupply >= MAX_SUPPLY) revert MaxSupplyExceeded();
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        gainShare(to);
        totalSupply++;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenUri;
    }

    function returnTheBaseURI () external view returns (string memory) {
        return baseTokenUri;
    }

    //return uri for certain token
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
  
        return baseTokenUri;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    //Distribution functions using IDA
    // ---------------------------------------------------------------------------------------------
    // IDA OPERATIONS

    /// @notice Takes the entire balance of the designated spreaderToken in the contract and distributes it out to unit holders w/ IDA
    function distribute() public {
        uint256 spreaderTokenBalance = spreaderToken.balanceOf(address(this));

        (uint256 actualDistributionAmount, ) = spreaderToken.calculateDistribution(
            address(this),
            INDEX_ID,
            spreaderTokenBalance
        );

        spreaderToken.distribute(INDEX_ID, actualDistributionAmount);
    }

    /// @notice lets an account gain a single distribution unit
    /// @param subscriber subscriber address whose units are to be incremented
    function gainShare(address subscriber) public {
        // Get current units subscriber holds
        (, , uint256 currentUnitsHeld, ) = spreaderToken.getSubscription(
            address(this),
            INDEX_ID,
            subscriber
        );

        // Update to current amount + 1
        spreaderToken.updateSubscriptionUnits(
            INDEX_ID,
            subscriber,
            uint128(currentUnitsHeld + 1)
        );
    }

    /// @notice lets an account lose a single distribution unit
    /// @param subscriber subscriber address whose units are to be decremented
    function loseShare(address subscriber) public {
        // Get current units subscriber holds
        (, , uint256 currentUnitsHeld, ) = spreaderToken.getSubscription(
            address(this),
            INDEX_ID,
            subscriber
        );

        // Update to current amount - 1 (reverts if currentUnitsHeld - 1 < 0, so basically if currentUnitsHeld = 0)
        spreaderToken.updateSubscriptionUnits(
            INDEX_ID,
            subscriber,
            uint128(currentUnitsHeld - 1)
        );
    }

    /// @notice allows an account to delete its entire subscription this contract
    /// @param subscriber subscriber address whose subscription is to be deleted
    function deleteShares(address subscriber) public {
        spreaderToken.deleteSubscription(address(this), INDEX_ID, subscriber);
    }

    //Transfer overrides to change shares
    function safeTransferFrom(address from, address to, uint256 tokenId) public override {
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: transfer caller is not owner nor approved");
        require(to != address(0), "ERC721: transfer to contract not allowed");
        _transfer(from, to, tokenId);
        loseShare(from);
        gainShare(to);
    }

    //Only Owner Functions
    function setRoyaltyInfo(address _receiver, uint96 _royaltyFeesInBips)
        public
        onlyOwner
    {
        _setDefaultRoyalty(_receiver, _royaltyFeesInBips);
    }

    function setTokenUri(string memory _baseTokenUri) external {
      //  if (msg.sender != contractCaller) revert NotContractCaller();
        baseTokenUri = _baseTokenUri;
    }

    function togglePause() external onlyOwner {
        pause= !pause;
    }

    function setAllowedCaller(address _contract) external {
        contractCaller = _contract;
    }

    function withdraw() external onlyOwner {
        (bool delivered, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(delivered);
    }
}


