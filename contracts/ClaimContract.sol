// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ClaimContract {
    enum ClaimState { Submitted, UnderReview, Approved, Rejected, Paid }

    struct Claim {
        uint256 claimId;
        uint256 policyId;
        address provider;
        address beneficiary;
        address insurer;
        string ipfsHash;
        string vcCid;
        uint256 amount;
        ClaimState state;
        uint256 submitDate;
        string rejectionReason;
    }

    mapping(uint256 => Claim) public claims;
    mapping(uint256 => uint256[]) public policyClaims;
    mapping(address => uint256[]) public providerClaims;
    
    uint256 private nextClaimId = 1;

    event ClaimSubmitted(
        uint256 indexed claimId,
        uint256 indexed policyId,
        address indexed provider,
        string ipfsHash,
        string vcCid
    );

    event ClaimStateChanged(
        uint256 indexed claimId,
        ClaimState newState,
        string reason
    );

    function submitClaim(
        uint256 _policyId,
        address _beneficiary,
        address _insurer,
        string memory _ipfsHash,
        string memory _vcCid,
        uint256 _amount
    ) public returns (uint256) {
        require(_beneficiary != address(0), "Invalid beneficiary");
        require(_insurer != address(0), "Invalid insurer");
        require(bytes(_ipfsHash).length > 0, "IPFS hash required");
        require(bytes(_vcCid).length > 0, "VC CID required");
        require(_amount > 0, "Amount must be greater than 0");

        uint256 claimId = nextClaimId++;
        
        claims[claimId] = Claim({
            claimId: claimId,
            policyId: _policyId,
            provider: msg.sender,
            beneficiary: _beneficiary,
            insurer: _insurer,
            ipfsHash: _ipfsHash,
            vcCid: _vcCid,
            amount: _amount,
            state: ClaimState.Submitted,
            submitDate: block.timestamp,
            rejectionReason: ""
        });

        policyClaims[_policyId].push(claimId);
        providerClaims[msg.sender].push(claimId);

        emit ClaimSubmitted(claimId, _policyId, msg.sender, _ipfsHash, _vcCid);

        return claimId;
    }

    function setUnderReview(uint256 _claimId) public {
        Claim storage claim = claims[_claimId];
        require(claim.insurer == msg.sender, "Only insurer can review");
        require(claim.state == ClaimState.Submitted, "Invalid state transition");
        
        claim.state = ClaimState.UnderReview;
        emit ClaimStateChanged(_claimId, ClaimState.UnderReview, "");
    }

    function approveClaim(uint256 _claimId) public {
        Claim storage claim = claims[_claimId];
        require(claim.insurer == msg.sender, "Only insurer can approve");
        require(
            claim.state == ClaimState.UnderReview || claim.state == ClaimState.Submitted,
            "Invalid state transition"
        );
        
        claim.state = ClaimState.Approved;
        emit ClaimStateChanged(_claimId, ClaimState.Approved, "");
    }

    function rejectClaim(uint256 _claimId, string memory _reason) public {
        Claim storage claim = claims[_claimId];
        require(claim.insurer == msg.sender, "Only insurer can reject");
        require(
            claim.state == ClaimState.UnderReview || claim.state == ClaimState.Submitted,
            "Invalid state transition"
        );
        
        claim.state = ClaimState.Rejected;
        claim.rejectionReason = _reason;
        emit ClaimStateChanged(_claimId, ClaimState.Rejected, _reason);
    }

    function markPaid(uint256 _claimId) public {
        Claim storage claim = claims[_claimId];
        require(claim.insurer == msg.sender, "Only insurer can mark paid");
        require(claim.state == ClaimState.Approved, "Claim must be approved first");
        
        claim.state = ClaimState.Paid;
        emit ClaimStateChanged(_claimId, ClaimState.Paid, "");
    }

    function getClaim(uint256 _claimId) public view returns (
        uint256 claimId,
        uint256 policyId,
        address provider,
        address beneficiary,
        address insurer,
        string memory ipfsHash,
        string memory vcCid,
        uint256 amount,
        ClaimState state,
        uint256 submitDate,
        string memory rejectionReason
    ) {
        Claim memory claim = claims[_claimId];
        require(claim.claimId != 0, "Claim does not exist");
        return (
            claim.claimId,
            claim.policyId,
            claim.provider,
            claim.beneficiary,
            claim.insurer,
            claim.ipfsHash,
            claim.vcCid,
            claim.amount,
            claim.state,
            claim.submitDate,
            claim.rejectionReason
        );
    }

    function getPolicyClaims(uint256 _policyId) public view returns (uint256[] memory) {
        return policyClaims[_policyId];
    }

    function getProviderClaims(address _provider) public view returns (uint256[] memory) {
        return providerClaims[_provider];
    }
}

