// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PolicyContract {
    struct Policy {
        uint256 policyId;
        address insurer;
        address beneficiary;
        uint256 coverageAmount;
        uint256 issueDate;
        bool active;
    }

    mapping(uint256 => Policy) public policies;
    mapping(address => uint256[]) public beneficiaryPolicies;
    mapping(address => uint256[]) public insurerPolicies;
    
    uint256 private nextPolicyId = 1;

    event PolicyIssued(
        uint256 indexed policyId,
        address indexed insurer,
        address indexed beneficiary,
        uint256 coverageAmount
    );

    function issuePolicy(
        address _beneficiary,
        uint256 _coverageAmount
    ) public returns (uint256) {
        require(_beneficiary != address(0), "Invalid beneficiary address");
        require(_coverageAmount > 0, "Coverage amount must be greater than 0");

        uint256 policyId = nextPolicyId++;
        
        policies[policyId] = Policy({
            policyId: policyId,
            insurer: msg.sender,
            beneficiary: _beneficiary,
            coverageAmount: _coverageAmount,
            issueDate: block.timestamp,
            active: true
        });

        beneficiaryPolicies[_beneficiary].push(policyId);
        insurerPolicies[msg.sender].push(policyId);

        emit PolicyIssued(policyId, msg.sender, _beneficiary, _coverageAmount);

        return policyId;
    }

    function getPolicy(uint256 _policyId) public view returns (
        uint256 policyId,
        address insurer,
        address beneficiary,
        uint256 coverageAmount,
        uint256 issueDate,
        bool active
    ) {
        Policy memory policy = policies[_policyId];
        require(policy.policyId != 0, "Policy does not exist");
        return (
            policy.policyId,
            policy.insurer,
            policy.beneficiary,
            policy.coverageAmount,
            policy.issueDate,
            policy.active
        );
    }

    function getBeneficiaryPolicies(address _beneficiary) public view returns (uint256[] memory) {
        return beneficiaryPolicies[_beneficiary];
    }

    function getInsurerPolicies(address _insurer) public view returns (uint256[] memory) {
        return insurerPolicies[_insurer];
    }

    function deactivatePolicy(uint256 _policyId) public {
        Policy storage policy = policies[_policyId];
        require(policy.insurer == msg.sender, "Only insurer can deactivate");
        require(policy.active, "Policy already inactive");
        policy.active = false;
    }
}

