// SPDX-License-Identifier: MIT
pragma  solidity ^0.8.7;


import "@openzeppelin/contracts@4.7.0/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@4.7.0/utils/Counters.sol";


contract TurkishCat is ERC721, ERC721URIStorage{

    using Counters for Counters.Counter; 
    Counters.Counter private _tokenIdCounter; 

uint selector = 0;
    uint interval; 
    uint lastTimeStamp;
    string[] IpfsUri = ["https://emerald-frantic-cobra-462.mypinata.cloud/ipfs/QmbcWn2X6WxMLHidfVypUkWJX5nfxWjHiXhGCWShYo91Fa/Cat1.json","https://emerald-frantic-cobra-462.mypinata.cloud/ipfs/QmbcWn2X6WxMLHidfVypUkWJX5nfxWjHiXhGCWShYo91Fa/Cat2.json"];


    constructor( ) ERC721("TurkishCat", "tCat"){

    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function safeMint(address to) public {
        uint256 tokenId = _tokenIdCounter.current(); 
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, IpfsUri[0]);
    }

    function updateBg(uint256 _tokenId) public{
        if(selector == 0)
        {
            _setTokenURI(_tokenId, IpfsUri[1]);
            }
       else{
            _setTokenURI(_tokenId, IpfsUri[0]);

       }
    }

    /// @dev this method is called by the Automation Nodes to check if `performUpkeep` should be performed
    function checkUpkeep(bytes calldata) external view returns (bool upkeepNeeded, bytes memory){
      upkeepNeeded = (block.timestamp - lastTimeStamp) > interval; 
    }

    /// @dev this method is called by the Automation Nodes. it increases all elements which balances are lower than the LIMIT
    function performUpkeep(bytes calldata /* performData */) external  {
        if ((block.timestamp - lastTimeStamp) > interval ){
            lastTimeStamp = block.timestamp; 
           
            updateBg(0);
        }
    }
        function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

}