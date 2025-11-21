export function createPolicyVC(policyId, insurer, beneficiary, coverageAmount, issuerDid) {
  const now = new Date().toISOString();
  return {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://www.w3.org/2018/credentials/examples/v1',
    ],
    id: `urn:uuid:${Date.now()}-${policyId}`,
    type: ['VerifiableCredential', 'MedicalPolicyCredential'],
    issuer: {
      id: issuerDid,
    },
    issuanceDate: now,
    credentialSubject: {
      id: `did:example:${beneficiary}`,
      policyId: policyId.toString(),
      insurer: insurer,
      beneficiary: beneficiary,
      coverageAmount: coverageAmount.toString(),
      type: 'MedicalPolicy',
    },
  };
}

export function createClaimVC(claimId, policyId, provider, beneficiary, amount, issuerDid) {
  const now = new Date().toISOString();
  return {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://www.w3.org/2018/credentials/examples/v1',
    ],
    id: `urn:uuid:${Date.now()}-${claimId}`,
    type: ['VerifiableCredential', 'MedicalClaimCredential'],
    issuer: {
      id: issuerDid,
    },
    issuanceDate: now,
    credentialSubject: {
      id: `did:example:${provider}`,
      claimId: claimId.toString(),
      policyId: policyId.toString(),
      provider: provider,
      beneficiary: beneficiary,
      amount: amount.toString(),
      type: 'MedicalClaim',
    },
  };
}

