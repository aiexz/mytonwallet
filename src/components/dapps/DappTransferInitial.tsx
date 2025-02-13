import React, {
  memo,
  useMemo,
} from '../../lib/teact/teact';
import { getActions, withGlobal } from '../../global';

import type { ApiBaseCurrency, ApiDapp, ApiToken } from '../../api/types';
import type { Account, ExtendedDappTransfer } from '../../global/types';
import type { Big } from '../../lib/big.js';

import { TONCOIN } from '../../config';
import {
  selectCurrentDappTransferExtendedTransactions,
  selectCurrentDappTransferTotalAmounts,
  selectCurrentToncoinBalance,
  selectNetworkAccounts,
} from '../../global/selectors';
import buildClassName from '../../util/buildClassName';
import { toDecimal } from '../../util/decimals';
import { formatCurrency, getShortCurrencySymbol } from '../../util/formatNumber';
import { shortenAddress } from '../../util/shortenAddress';
import { getDappTransferActualToAddress, isNftTransferPayload, isTokenTransferPayload } from '../../util/ton/transfer';

import useCurrentOrPrev from '../../hooks/useCurrentOrPrev';
import useLang from '../../hooks/useLang';

import Button from '../ui/Button';
import DappInfo from './DappInfo';
import DappTransfer from './DappTransfer';

import modalStyles from '../ui/Modal.module.scss';
import styles from './Dapp.module.scss';

import scamImg from '../../assets/scam.svg';

interface OwnProps {
  onClose?: NoneToVoidFunction;
}

interface StateProps {
  currentAccount?: Account;
  toncoinBalance: bigint;
  transactions?: ExtendedDappTransfer[];
  totalAmountsBySlug: Record<string, Big>;
  totalCost: number;
  dapp?: ApiDapp;
  isLoading?: boolean;
  tokensBySlug: Record<string, ApiToken>;
  baseCurrency?: ApiBaseCurrency;
}

function DappTransferInitial({
  currentAccount,
  toncoinBalance,
  transactions,
  totalAmountsBySlug,
  totalCost,
  dapp,
  isLoading,
  tokensBySlug,
  onClose,
  baseCurrency,
}: OwnProps & StateProps) {
  const { showDappTransfer, submitDappTransferConfirm } = getActions();

  const lang = useLang();
  const isSingleTransaction = transactions?.length === 1;
  const renderingTransactions = useCurrentOrPrev(transactions, true);
  const hasScamAddresses = useMemo(() => {
    return renderingTransactions?.some(({ isScam }) => isScam);
  }, [renderingTransactions]);

  function renderDapp() {
    return (
      <div className={styles.transactionDirection}>
        <div className={styles.transactionAccount}>
          <div className={styles.accountTitle}>{currentAccount?.title}</div>
          <div className={styles.accountBalance}>{formatCurrency(toDecimal(toncoinBalance), TONCOIN.symbol)}</div>
        </div>

        <DappInfo
          iconUrl={dapp?.iconUrl}
          name={dapp?.name}
          url={dapp?.url}
          className={styles.transactionDapp}
        />
      </div>
    );
  }

  function renderTransaction() {
    return (
      <DappTransfer
        transaction={renderingTransactions![0]}
        tokensBySlug={tokensBySlug}
      />
    );
  }

  function renderTransactionRow(transaction: ExtendedDappTransfer, i: number) {
    const { payload } = transaction;
    const tonAmount = transaction.amount + (transaction.fee ?? 0n);

    let extraText: string = '';
    if (isNftTransferPayload(payload)) {
      extraText = '1 NFT + ';
    } else if (isTokenTransferPayload(payload)) {
      const { slug: tokenSlug, amount } = payload;
      const token = tokensBySlug[tokenSlug];
      if (token) {
        const { decimals, symbol } = token;
        extraText = `${formatCurrency(toDecimal(amount, decimals), symbol)} + `;
      }
    }

    return (
      <div
        key={`${transaction.toAddress}_${transaction.amount}_${i}`}
        className={styles.transactionRow}
        onClick={() => { showDappTransfer({ transactionIdx: i }); }}
      >
        {transaction.isScam && <img src={scamImg} alt={lang('Scam')} className={styles.scamImage} />}
        <span className={buildClassName(styles.transactionRowAmount, transaction.isScam && styles.scam)}>
          {extraText}
          {formatCurrency(toDecimal(tonAmount), TONCOIN.symbol)}
        </span>
        {' '}
        <span className={buildClassName(styles.transactionRowAddress, transaction.isScam && styles.scam)}>
          {lang('$transaction_to', {
            address: shortenAddress(getDappTransferActualToAddress(transaction)),
          })}
        </span>
        <i className={buildClassName(styles.transactionRowChevron, 'icon-chevron-right')} aria-hidden />
      </div>
    );
  }

  function renderTransactions() {
    const hasDangerous = (renderingTransactions ?? []).some(({ isDangerous }) => isDangerous);

    const totalAmountsText = Object.entries(totalAmountsBySlug)
      .map(([tokenSlug, amount]) => formatCurrency(amount, tokensBySlug[tokenSlug]?.symbol ?? ''))
      .join(' + ');

    return (
      <>
        <p className={styles.label}>{lang('$many_transactions', renderingTransactions?.length, 'i')}</p>
        <div className={styles.transactionList}>
          {renderingTransactions?.map(renderTransactionRow)}
        </div>
        <span className={styles.label}>
          {lang('Total Amount')}
        </span>
        <div className={styles.payloadField}>
          {totalAmountsText} ({formatCurrency(totalCost, getShortCurrencySymbol(baseCurrency))})
        </div>
        {hasDangerous && (
          <div className={styles.warningForPayload}>{lang('$hardware_payload_warning')}</div>
        )}
      </>
    );
  }

  if (!renderingTransactions) {
    return undefined;
  }

  return (
    <div className={modalStyles.transitionContent}>
      {renderDapp()}

      <div className={styles.contentWithBackground}>
        {isSingleTransaction ? renderTransaction() : renderTransactions()}
      </div>

      <div className={modalStyles.buttons}>
        <Button className={modalStyles.button} onClick={onClose}>{lang('Cancel')}</Button>
        <Button
          isPrimary
          isSubmit
          isLoading={isLoading}
          isDisabled={hasScamAddresses}
          className={modalStyles.button}
          onClick={!hasScamAddresses ? submitDappTransferConfirm : undefined}
        >
          {lang('Send')}
        </Button>
      </div>
    </div>
  );
}

export default memo(withGlobal<OwnProps>((global): StateProps => {
  const { isLoading, dapp } = global.currentDappTransfer;

  const { baseCurrency } = global.settings;
  const accounts = selectNetworkAccounts(global);
  const { bySlug: totalAmountsBySlug, cost: totalCost } = selectCurrentDappTransferTotalAmounts(global);

  return {
    currentAccount: accounts?.[global.currentAccountId!],
    toncoinBalance: selectCurrentToncoinBalance(global),
    transactions: selectCurrentDappTransferExtendedTransactions(global),
    totalAmountsBySlug,
    totalCost,
    dapp,
    isLoading,
    tokensBySlug: global.tokenInfo.bySlug,
    baseCurrency,
  };
})(DappTransferInitial));
