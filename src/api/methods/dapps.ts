import type {
  ApiDapp, ApiDappsState, ApiNetwork, OnApiUpdate,
} from '../types';

import { buildAccountId, parseAccountId } from '../../util/account';
import { getAccountValue, removeAccountValue, setAccountValue } from '../common/accounts';
import { isUpdaterAlive, toInternalAccountId } from '../common/helpers';
import { updateDapps } from '../dappMethods';
import { storage } from '../storages';

type OnDappDisconnected = (accountId: string, origin: string) => Promise<void> | void;

const activeDappByAccountId: Record<string, string> = {};

let onUpdate: OnApiUpdate;
let onDappsChanged: AnyToVoidFunction = () => {};
let onDappDisconnected: OnDappDisconnected = () => {};

export function initDapps(
  _onUpdate: OnApiUpdate,
  _onDappsChanged?: AnyToVoidFunction,
  _onDappDisconnected?: OnDappDisconnected,
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onUpdate = _onUpdate;
  if (_onDappsChanged && _onDappDisconnected) {
    onDappsChanged = _onDappsChanged;
    onDappDisconnected = _onDappDisconnected;
  }
}

export function onActiveDappAccountUpdated(accountId: string) {
  const activeDappOrigin = getActiveDapp(accountId);

  onUpdate({
    type: 'updateActiveDapp',
    accountId,
    origin: activeDappOrigin,
  });
}

export function activateDapp(accountId: string, origin: string) {
  const oldAccountId = findActiveDappAccount(origin);
  activeDappByAccountId[accountId] = origin;

  // The method can be called in headless mode (tonConnect:reconnect)
  if (!onUpdate || !isUpdaterAlive(onUpdate)) {
    return;
  }

  if (oldAccountId) {
    onUpdate({
      type: 'updateActiveDapp',
      accountId: oldAccountId,
    });
  }

  onUpdate({
    type: 'updateActiveDapp',
    accountId,
    origin,
  });
}

export function getActiveDapp(accountId: string) {
  return activeDappByAccountId[accountId];
}

export function deactivateDapp(origin: string) {
  const accountId = findActiveDappAccount(origin);
  if (!accountId) {
    return false;
  }

  deactivateAccountDapp(accountId);

  return true;
}

export function findActiveDappAccount(origin: string) {
  return Object.keys(activeDappByAccountId).find((acc) => origin === activeDappByAccountId[acc]);
}

export function deactivateAccountDapp(accountId: string) {
  const activeOrigin = activeDappByAccountId[accountId];
  if (!activeOrigin) {
    return false;
  }

  delete activeDappByAccountId[accountId];

  onUpdate({
    type: 'updateActiveDapp',
    accountId,
  });

  return true;
}

export function deactivateAllDapps() {
  for (const [accountId, value] of Object.entries(activeDappByAccountId)) {
    if (!value) {
      continue;
    }

    delete activeDappByAccountId[accountId];

    onUpdate({
      type: 'updateActiveDapp',
      accountId,
    });
  }
}

export function isDappActive(accountId: string, origin: string) {
  return activeDappByAccountId[accountId] === origin;
}

export async function updateDapp(accountId: string, origin: string, updater: (dapp: ApiDapp) => ApiDapp) {
  const dapp = await getDapp(accountId, origin);
  await addDapp(accountId, updater(dapp!));
}

export async function getDapp(accountId: string, origin: string): Promise<ApiDapp | undefined> {
  return (await getAccountValue(accountId, 'dapps'))[origin];
}

export async function addDapp(accountId: string, dapp: ApiDapp) {
  const dapps = await getDappsByOrigin(accountId);
  dapps[dapp.origin] = dapp;
  await setAccountValue(accountId, 'dapps', dapps);
}

export async function addDappToAccounts(dapp: ApiDapp, accountIds: string[]) {
  const dappsByAccount = await storage.getItem('dapps') || {};

  accountIds.forEach((accountId) => {
    const internalId = toInternalAccountId(accountId);
    const dapps = dappsByAccount[internalId] || {};
    dapps[dapp.origin] = dapp;

    dappsByAccount[internalId] = dapps;
  });
  await storage.setItem('dapps', dappsByAccount);
}

export async function deleteDapp(accountId: string, origin: string, dontNotifyDapp?: boolean) {
  const dapps = await getDappsByOrigin(accountId);
  if (!(origin in dapps)) {
    return false;
  }

  if (isDappActive(accountId, origin)) {
    deactivateAccountDapp(accountId);
  }

  delete dapps[origin];
  await setAccountValue(accountId, 'dapps', dapps);

  onUpdate({
    type: 'dappDisconnect',
    accountId,
    origin,
  });

  if (!dontNotifyDapp) {
    updateDapps({
      type: 'disconnectDapp',
      origin,
    });
    await onDappDisconnected(accountId, origin);
  }

  onDappsChanged();

  return true;
}

export async function deleteAllDapps(accountId: string) {
  deactivateAccountDapp(accountId);

  const origins = Object.keys(await getDappsByOrigin(accountId));
  await setAccountValue(accountId, 'dapps', {});

  await Promise.all(origins.map(async (origin) => {
    onUpdate({
      type: 'dappDisconnect',
      accountId,
      origin,
    });
    await onDappDisconnected(accountId, origin);
  }));

  onDappsChanged();
}

export async function getDapps(accountId: string): Promise<ApiDapp[]> {
  return Object.values(await getDappsByOrigin(accountId));
}

export async function getDappsByOrigin(accountId: string): Promise<Record<string, ApiDapp>> {
  return await getAccountValue(accountId, 'dapps') || {};
}

export async function isDappConnected(accountId: string, origin: string) {
  const dapps = await getDappsByOrigin(accountId);

  return Object.values(dapps).some((dapp) => dapp.origin === origin);
}

export async function findLastConnectedAccount(network: ApiNetwork, origin: string) {
  const dapps = await getDappsState() || {};

  let connectedAt = 0;
  let lastConnectedAccountId: string | undefined;

  Object.entries(dapps).forEach(([accountId, byOrigin]) => {
    if (!(origin in byOrigin)) return;

    if ((byOrigin[origin].connectedAt) > connectedAt) {
      connectedAt = byOrigin[origin].connectedAt;
      lastConnectedAccountId = accountId;
    }
  });

  if (!lastConnectedAccountId) {
    return undefined;
  }

  return buildAccountId({ ...parseAccountId(lastConnectedAccountId), network });
}

export function getDappsState(): Promise<ApiDappsState | undefined> {
  return storage.getItem('dapps');
}

export async function removeAccountDapps(accountId: string) {
  await removeAccountValue(accountId, 'dapps');
  onDappsChanged();
}

export async function removeAllDapps() {
  await storage.removeItem('dapps');
  onDappsChanged();
}

export function getSseLastEventId(): Promise<string | undefined> {
  return storage.getItem('sseLastEventId');
}

export function setSseLastEventId(lastEventId: string) {
  return storage.setItem('sseLastEventId', lastEventId);
}
