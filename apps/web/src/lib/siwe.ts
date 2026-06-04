export interface SiweMessageFields {
  domain: string;
  address: string;
  statement: string;
  uri: string;
  version: string;
  chainId: number;
  nonce: string;
}

/** Builds an EIP-4361 SIWE message string (compatible with the `siwe` npm package). */
export function buildSiweMessage(fields: SiweMessageFields): string {
  const issuedAt = new Date().toISOString();
  return `${fields.domain} wants you to sign in with your Ethereum account:
${fields.address}

${fields.statement}

URI: ${fields.uri}
Version: ${fields.version}
Chain ID: ${fields.chainId}
Nonce: ${fields.nonce}
Issued At: ${issuedAt}`;
}
