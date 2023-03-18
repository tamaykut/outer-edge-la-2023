//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; 
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

error MaxSupplyExceeded();
error ContractPaused();
error NotContractCaller();

contract NFTContract is ERC721, Ownable, ERC721Burnable, ERC2981 {
    using Strings for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    uint256 public constant MAX_SUPPLY = 250;
   // uint256 public tokenPrice = 100 ether; 
    uint256 public totalSupply;

    string private baseTokenUri;
    address public contractCaller = address(0);

    bool public pause;

    mapping(address => uint256) public totalMints;

    
    constructor(uint96 _royaltyFeesInBips, string memory _URI, address _royalty) ERC721("Chat NFT", "INFT") {
        setRoyaltyInfo(_royalty, _royaltyFeesInBips);
        baseTokenUri = _URI;
        _tokenIdCounter.increment();
    }

    function mint() external {
        if (pause == true) revert ContractPaused();
        if (totalSupply >= MAX_SUPPLY) revert MaxSupplyExceeded();
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        totalSupply++;
    }

    function adminMint(address to) external onlyOwner {
        if (pause == true) revert ContractPaused();
        if (totalSupply >= MAX_SUPPLY) revert MaxSupplyExceeded();
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
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


