// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IdentityRegistry {
    enum Role { None, Patient, Provider, Insurer }

    struct Identity {
        address account;
        string did;
        Role role;
    }

    mapping(address => Identity) public identities;
    mapping(address => bool) public registered;

    event Registered(address indexed account, string did, Role role);

    function register(address _account, string memory _did, Role _role) public {
        require(!registered[_account], "Address already registered");
        require(_role != Role.None, "Invalid role");
        
        identities[_account] = Identity({
            account: _account,
            did: _did,
            role: _role
        });
        
        registered[_account] = true;
        
        emit Registered(_account, _did, _role);
    }

    function getRole(address _account) public view returns (Role) {
        require(registered[_account], "Address not registered");
        return identities[_account].role;
    }

    function getDID(address _account) public view returns (string memory) {
        require(registered[_account], "Address not registered");
        return identities[_account].did;
    }

    function isRegistered(address _account) public view returns (bool) {
        return registered[_account];
    }
}

