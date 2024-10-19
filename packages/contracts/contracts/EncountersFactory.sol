// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./EncountersCollection.sol";
import "./MyToken.sol";

contract EncountersFactory {
    mapping(uint256 => address) public collections;
    address public tokenManagerAddress;
    MyToken public myTokenContract;

    constructor(address _tokenManagerAddress, address _myTokenAddress) {
        tokenManagerAddress = _tokenManagerAddress;
        myTokenContract = MyToken(_myTokenAddress);
    }

    modifier onlyMyTokenOwner(uint256 tokenId) {
        require(myTokenContract.ownerOf(tokenId) == msg.sender, "Not the owner of the MyToken");
        _;
    }

    function createCollection(
        uint256 myTokenId,
        string memory name,
        string memory symbol
    ) public onlyMyTokenOwner(myTokenId) {
        require(collections[myTokenId] == address(0), "Collection already exists");
        require(myTokenContract.ownerOf(myTokenId) == msg.sender, "Not the owner of MyToken");

        EncountersCollection collection = new EncountersCollection(
            name,
            symbol,
            msg.sender,
            tokenManagerAddress
        );
        collections[myTokenId] = address(collection);
    }

    function getCollection(uint256 myTokenId) public view returns (address) {
        return collections[myTokenId];
    }
}
