// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./SecretTokenManager.sol";

contract EncountersCollection is ERC721URIStorage, ERC721Enumerable {
    uint256 public tokenCounter;
    address public owner;
    SecretTokenManager public tokenManager;

    constructor(
        string memory name,
        string memory symbol,
        address ownerAddress,
        address tokenManagerAddress
    ) ERC721(name, symbol) {
        tokenCounter = 0;
        owner = ownerAddress;
        tokenManager = SecretTokenManager(tokenManagerAddress);
    }

    function mintEncounter(
        address recipient,
        string memory tokenURI_,
        bytes32 tokenHash
    ) public returns (uint256) {
        address tokenOwner = tokenManager.verifyToken(tokenHash);
        require(tokenOwner == owner, "Invalid token or owner");

        uint256 newItemId = tokenCounter;
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI_);
        tokenCounter += 1;
        return newItemId;
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        address from = _ownerOf(tokenId);
        require(from == address(0), "Encounters are non-transferable");
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function _increaseBalance(address account, uint128 amount) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, amount);
    }
}