import type { ApiNetwork } from '../types';

import { parseAccountId } from '../../util/account';
import blockchains from '../blockchains';

export function importToken(accountId: string, address: string) {
  const { network, blockchain: blockchainKey } = parseAccountId(accountId);

  const blockchain = blockchains[blockchainKey];

  return blockchain.importToken(network, address);
}

export function resolveTokenBySlug(slug: string) {
  const blockchain = blockchains.ton;

  return blockchain.resolveTokenBySlug(slug);
}

export function resolveTokenWalletAddress(network: ApiNetwork, address: string, minterAddress: string) {
  const blockchain = blockchains.ton;

  return blockchain.resolveTokenWalletAddress(network, address, minterAddress);
}

export function resolveTokenMinterAddress(network: ApiNetwork, tokenWalletAddress: string) {
  const blockchain = blockchains.ton;

  return blockchain.resolveTokenMinterAddress(network, tokenWalletAddress);
}
