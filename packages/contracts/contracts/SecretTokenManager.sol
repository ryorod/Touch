// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SecretTokenManager {
    mapping(bytes32 => address) public tokenOwners;

    function registerToken(bytes32 doubleHash) public {
        require(tokenOwners[doubleHash] == address(0), "Token already registered");
        tokenOwners[doubleHash] = msg.sender;
    }

    function verifyToken(bytes32 tokenHash) public view returns (address) {
        bytes32 calculatedDoubleHash = keccak256(abi.encodePacked(tokenHash));
        return tokenOwners[calculatedDoubleHash];
    }

    function invalidateToken(bytes32 doubleHash) public {
        require(tokenOwners[doubleHash] == msg.sender, "Not the owner");
        tokenOwners[doubleHash] = address(0);
    }
}
