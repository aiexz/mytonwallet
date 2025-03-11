import React, { memo } from '../../lib/teact/teact';
import { getActions, withGlobal } from '../../global';

import type { ApiNetwork } from '../../api/types';
import type { Account } from '../../global/types';

import { APP_ENV, APP_VERSION, IS_EXTENSION } from '../../config';
import buildClassName from '../../util/buildClassName';
import { copyTextToClipboard } from '../../util/clipboard';
import { getBuildPlatform, getFlagsValue } from '../../util/getBuildPlatform';
import { getPlatform } from '../../util/getPlatform';
import { getLogs } from '../../util/logs';
import { shareFile } from '../../util/share';
import { callApi } from '../../api';

import useLang from '../../hooks/useLang';
import useLastCallback from '../../hooks/useLastCallback';

import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import Modal from '../ui/Modal';

import styles from './Settings.module.scss';

interface OwnProps {
  isOpen: boolean;
  onClose: () => void;
  isTestnet?: boolean;
  isCopyStorageEnabled?: boolean;
}

interface StateProps {
  currentAccountId?: string;
  accountsById?: Record<string, Account>;
}

const NETWORK_OPTIONS = [{
  value: 'mainnet',
  name: 'Mainnet',
}, {
  value: 'testnet',
  name: 'Testnet',
}];

function SettingsDeveloperOptions({
  isOpen,
  onClose,
  isTestnet,
  isCopyStorageEnabled,
  currentAccountId,
  accountsById,
}: OwnProps & StateProps) {
  const {
    startChangingNetwork,
    copyStorageData,
    showNotification,
  } = getActions();
  const lang = useLang();
  const currentNetwork = NETWORK_OPTIONS[isTestnet ? 1 : 0].value;

  const handleNetworkChange = useLastCallback((newNetwork: string) => {
    startChangingNetwork({ network: newNetwork as ApiNetwork });
    onClose();
  });

  const handleDownloadLogs = useLastCallback(async () => {
    const logsString = await getLogsString({ currentAccountId, accountsById });

    if (IS_EXTENSION) {
      await copyTextToClipboard(logsString);
      showNotification({ message: lang('Logs were copied!') as string, icon: 'icon-copy' });
      onClose();
    } else {
      await shareFile(`mytonwallet_logs_${new Date().toISOString()}.json`, logsString, 'application/json');
    }
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      noBackdropClose
      isCompact
    >
      <div className={styles.developerTitle}>
        {lang('Developer Options')}
      </div>

      <div className={styles.settingsBlock}>
        <Dropdown
          label={lang('Network')}
          items={NETWORK_OPTIONS}
          selectedValue={currentNetwork}
          theme="light"
          arrow="chevron"
          className={buildClassName(styles.item, styles.item_small)}
          onChange={handleNetworkChange}
        />
      </div>

      {isCopyStorageEnabled && (
        <>
          <p className={styles.blockTitle}>{lang('Dangerous')}</p>
          <div className={styles.settingsBlock}>
            <div className={buildClassName(styles.item, styles.item_small)} onClick={() => copyStorageData()}>
              {lang('Copy Storage Data')}

              <i className={buildClassName(styles.iconChevronRight, 'icon-copy')} aria-hidden />
            </div>
          </div>
        </>
      )}

      <div
        className={buildClassName(styles.settingsBlock, styles.logBlock)}
        onClick={handleDownloadLogs}
      >
        <div className={buildClassName(styles.item, styles.item_small)}>
          {
            IS_EXTENSION
              ? (
                <>
                  {lang('Copy Logs')}

                  <i className={buildClassName(styles.iconChevronRight, 'icon-copy')} aria-hidden />
                </>
              ) : lang('Download Logs')
          }
        </div>
      </div>

      <Button
        className={styles.developerCloseButton}
        onClick={onClose}
      >
        {lang('Close')}
      </Button>
    </Modal>
  );
}

export default memo(withGlobal<OwnProps>((global): StateProps => {
  const currentAccountId = global.currentAccountId;

  const accountsById = global.accounts?.byId;

  return {
    currentAccountId,
    accountsById,
  };
})(SettingsDeveloperOptions));

async function getLogsString(
  {
    currentAccountId,
    accountsById,
  }: StateProps,
) {
  const accountsInfo = accountsById && Object.keys(accountsById).reduce((acc, accountId) => {
    const { addressByChain, isHardware } = accountsById[accountId];
    acc[accountId] = {
      addressByChain,
      isHardware,
    };
    return acc;
  }, {} as any);

  const workerLogs = await callApi('getLogs') || [];
  const uiLogs = getLogs();
  return JSON.stringify(
    [...workerLogs, ...uiLogs].sort((a, b) => a.time.getTime() - b.time.getTime()).concat({
      time: new Date(),
      environment: APP_ENV,
      version: APP_VERSION,
      platform: getPlatform(),
      navigatorPlatform: navigator.platform,
      userAgent: navigator.userAgent,
      build: getBuildPlatform(),
      flags: getFlagsValue(),
      currentAccountId,
      accountsInfo,
    } as any),
    undefined,
    2,
  );
}
