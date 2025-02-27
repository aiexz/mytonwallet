import type { TeactNode } from '../../lib/teact/teact';
import React, {
  memo, useEffect, useMemo, useState,
} from '../../lib/teact/teact';
import { getActions, withGlobal } from '../../global';

import type { ApiBaseCurrency, ApiStakingState } from '../../api/types';
import type {
  GlobalState, HardwareConnectState, Theme, UserToken,
} from '../../global/types';
import { StakingState } from '../../global/types';

import {
  ANIMATED_STICKER_TINY_ICON_PX,
  IS_CAPACITOR,
  STAKING_CYCLE_DURATION_MS,
  TONCOIN,
} from '../../config';
import { Big } from '../../lib/big.js';
import {
  selectAccountStakingState,
  selectCurrentAccountTokens,
  selectIsMultichainAccount,
} from '../../global/selectors';
import { getDoesUsePinPad } from '../../util/biometrics';
import buildClassName from '../../util/buildClassName';
import { formatRelativeHumanDateTime } from '../../util/dateFormat';
import { fromDecimal, toBig, toDecimal } from '../../util/decimals';
import { getTonStakingFees } from '../../util/fee/getTonOperationFees';
import {
  formatCurrency,
  formatCurrencySimple,
  getShortCurrencySymbol,
} from '../../util/formatNumber';
import resolveSlideTransitionName from '../../util/resolveSlideTransitionName';
import { getIsMobileTelegramApp } from '../../util/windowEnvironment';
import { ANIMATED_STICKERS_PATHS } from '../ui/helpers/animatedAssets';
import { ASSET_LOGO_PATHS } from '../ui/helpers/assetLogos';

import useAppTheme from '../../hooks/useAppTheme';
import useCurrentOrPrev from '../../hooks/useCurrentOrPrev';
import useForceUpdate from '../../hooks/useForceUpdate';
import useInterval from '../../hooks/useInterval';
import useLang from '../../hooks/useLang';
import useLastCallback from '../../hooks/useLastCallback';
import useModalTransitionKeys from '../../hooks/useModalTransitionKeys';
import useShowTransition from '../../hooks/useShowTransition';
import useSyncEffect from '../../hooks/useSyncEffect';

import TransactionBanner from '../common/TransactionBanner';
import TransferResult from '../common/TransferResult';
import LedgerConfirmOperation from '../ledger/LedgerConfirmOperation';
import LedgerConnect from '../ledger/LedgerConnect';
import AnimatedIconWithPreview from '../ui/AnimatedIconWithPreview';
import Button from '../ui/Button';
import Fee from '../ui/Fee';
import Modal from '../ui/Modal';
import ModalHeader from '../ui/ModalHeader';
import PasswordForm from '../ui/PasswordForm';
import RichNumberInput from '../ui/RichNumberInput';
import Transition from '../ui/Transition';

import modalStyles from '../ui/Modal.module.scss';
import styles from './Staking.module.scss';

type StateProps = GlobalState['currentStaking'] & {
  tokens?: UserToken[];
  stakingInfo: GlobalState['stakingInfo'];
  baseCurrency?: ApiBaseCurrency;
  isNominators?: boolean;
  hardwareState?: HardwareConnectState;
  isLedgerConnected?: boolean;
  isTonAppConnected?: boolean;
  theme: Theme;
  isMultichainAccount: boolean;
  stakingState?: ApiStakingState;
};

const IS_OPEN_STATES = new Set([
  StakingState.UnstakeInitial,
  StakingState.UnstakePassword,
  StakingState.UnstakeConnectHardware,
  StakingState.UnstakeConfirmHardware,
  StakingState.UnstakeComplete,
]);

const FULL_SIZE_NBS_STATES = new Set([
  StakingState.UnstakePassword,
  StakingState.UnstakeConnectHardware,
  StakingState.UnstakeConfirmHardware,
]);

const UPDATE_UNSTAKE_DATE_INTERVAL_MS = 30000; // 30 sec

function UnstakeModal({
  state,
  isLoading,
  error,
  tokens,
  stakingInfo,
  baseCurrency,
  isNominators,
  hardwareState,
  isLedgerConnected,
  isTonAppConnected,
  isMultichainAccount,
  theme,
  amount,
  stakingState,
}: StateProps) {
  const {
    setStakingScreen,
    cancelStaking,
    clearStakingError,
    submitStakingInitial,
    submitStakingPassword,
    submitStakingHardware,
    fetchStakingHistory,
  } = getActions();

  const {
    type: stakingType,
    tokenSlug,
    balance: stakingBalance,
  } = stakingState ?? {};

  const endOfStakingCycle = stakingState?.type === 'nominators'
    ? stakingState.end
    : stakingInfo?.round?.end;

  const lang = useLang();
  const isOpen = IS_OPEN_STATES.has(state);

  const { gas: networkFee, real: realFee } = getTonStakingFees(stakingState?.type).stake;

  const nativeToken = useMemo(() => tokens?.find(({ slug }) => slug === TONCOIN.slug), [tokens]);
  const isNativeEnough = nativeToken && nativeToken.amount >= networkFee;
  const instantAvailable = stakingType === 'liquid' ? stakingInfo?.liquid?.available ?? 0n : 0n;

  const token = useMemo(() => {
    return tokenSlug ? tokens?.find(({ slug }) => slug === tokenSlug) : undefined;
  }, [tokenSlug, tokens]);

  const logoPath = token
    && (ASSET_LOGO_PATHS[token.symbol.toLowerCase() as keyof typeof ASSET_LOGO_PATHS] || token.image);

  const [hasAmountError, setHasAmountError] = useState<boolean>(false);

  const [isLongUnstake, setIsLongUnstake] = useState(false);

  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);

  const [unstakeAmount, setUnstakeAmount] = useState(isNominators ? stakingBalance : undefined);
  const [successUnstakeAmount, setSuccessUnstakeAmount] = useState<bigint | undefined>(undefined);

  const shortBaseSymbol = getShortCurrencySymbol(baseCurrency);

  useEffect(() => {
    if (!stakingState) return;

    let isInstantUnstake = true;

    switch (stakingState.type) {
      case 'nominators': {
        isInstantUnstake = false;
        break;
      }
      case 'liquid': {
        isInstantUnstake = amount ? amount < instantAvailable : true;
        break;
      }
      case 'jetton': {
        isInstantUnstake = true;
        break;
      }
    }

    setIsLongUnstake(!isInstantUnstake);
  }, [instantAvailable, amount, stakingState]);

  const [unstakeDate, setUnstakeDate] = useState<number>(endOfStakingCycle ?? Date.now() + STAKING_CYCLE_DURATION_MS);
  const forceUpdate = useForceUpdate();
  const appTheme = useAppTheme(theme);

  const { renderingKey, nextKey, updateNextKey } = useModalTransitionKeys(state, isOpen);

  const amountInCurrency = token && token.price && unstakeAmount
    ? toBig(unstakeAmount, token.decimals)
      .mul(token.price)
      .round(token.decimals, Big.roundHalfUp)
      .toString()
    : undefined;
  const renderingAmountInCurrency = useCurrentOrPrev(amountInCurrency, true);
  const isUnstakeDisabled = !isNativeEnough || isInsufficientBalance || !unstakeAmount;

  const { shouldRender: shouldRenderCurrency, transitionClassNames: currencyClassNames } = useShowTransition(
    Boolean(amountInCurrency),
  );

  useEffect(() => {
    if (isOpen) {
      fetchStakingHistory();
      setUnstakeAmount(isNominators ? stakingBalance : undefined);
      setHasAmountError(false);
      setIsInsufficientBalance(false);
    }
  }, [isOpen, fetchStakingHistory, isNominators, stakingBalance]);

  useSyncEffect(() => {
    if (endOfStakingCycle) {
      setUnstakeDate(endOfStakingCycle);
    }
  }, [endOfStakingCycle]);

  const refreshUnstakeDate = useLastCallback(() => {
    if (unstakeDate < Date.now()) {
      fetchStakingHistory();
    }
    forceUpdate();
  });

  useInterval(refreshUnstakeDate, UPDATE_UNSTAKE_DATE_INTERVAL_MS);

  const handleBackClick = useLastCallback(() => {
    if (state === StakingState.UnstakePassword) {
      setStakingScreen({ state: StakingState.UnstakeInitial });
    }
  });

  const handleStartUnstakeClick = useLastCallback(() => {
    submitStakingInitial({ isUnstaking: true, amount: unstakeAmount });
  });

  const handleTransferSubmit = useLastCallback((password: string) => {
    setSuccessUnstakeAmount(amount);

    submitStakingPassword({ password, isUnstaking: true });
  });

  const handleLedgerConnect = useLastCallback(() => {
    setSuccessUnstakeAmount(amount);
    submitStakingHardware({ isUnstaking: true });
  });

  function renderTransactionBanner() {
    if (!token || !unstakeAmount) return undefined;

    return (
      <TransactionBanner
        tokenIn={token}
        withChainIcon={isMultichainAccount}
        color="green"
        text={formatCurrency(toDecimal(unstakeAmount, token.decimals), token.symbol)}
        className={!getDoesUsePinPad() ? styles.transactionBanner : undefined}
      />
    );
  }

  const validateAndSetAmount = useLastCallback(
    (newAmount: bigint | undefined, noReset = false) => {
      if (!noReset) {
        setHasAmountError(false);
        setIsInsufficientBalance(false);
      }

      if (newAmount === undefined) {
        setUnstakeAmount(undefined);
        return;
      }

      if (newAmount < 0) {
        setHasAmountError(true);
        return;
      }

      if (!stakingBalance || newAmount > stakingBalance) {
        setHasAmountError(true);
        setIsInsufficientBalance(true);
      }

      setUnstakeAmount(newAmount);
    },
  );

  const handleMaxAmountClick = useLastCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();

      if (!stakingBalance) {
        return;
      }

      validateAndSetAmount(stakingBalance);
    },
  );

  const handleAmountChange = useLastCallback((stringValue?: string) => {
    const value = stringValue ? fromDecimal(stringValue, token?.decimals) : undefined;
    validateAndSetAmount(value);
  });

  function renderBalance() {
    return (
      <div className={styles.balanceContainer}>
        <span className={styles.balance}>
          {lang('$all_balance', {
            balance: (
              <a href="#" onClick={handleMaxAmountClick} className={styles.balanceLink}>
                {
                  stakingBalance !== undefined
                    ? formatCurrencySimple(stakingBalance, token?.symbol!, token?.decimals!)
                    : lang('Loading...')
                }
              </a>
            ),
          })}
        </span>
      </div>
    );
  }

  function renderCurrencyValue() {
    return (
      <span className={buildClassName(styles.amountInCurrency, currencyClassNames)}>
        ≈&thinsp;{formatCurrency(renderingAmountInCurrency || '0', shortBaseSymbol)}
      </span>
    );
  }

  function renderBottomRight() {
    const activeKey = isInsufficientBalance ? 0
      : !isNativeEnough ? 1
        : instantAvailable ? 2
          : 3;

    let content: string | React.JSX.Element | TeactNode[] = token ? lang('$fee_value', {
      fee: <Fee terms={{ native: realFee }} precision="approximate" token={token} />,
    }) : '';

    if (token) {
      if (isInsufficientBalance) {
        content = <span className={styles.balanceError}>{lang('Insufficient balance')}</span>;
      } else if (!isNativeEnough) {
        content = (
          <span className={styles.balanceError}>
            {lang('$insufficient_fee', {
              fee: formatCurrency(toBig(networkFee), nativeToken?.symbol ?? ''),
            })}
          </span>
        );
      } else if (instantAvailable) {
        content = lang('$unstake_up_to_information', {
          value: formatCurrency(toDecimal(instantAvailable, token.decimals), token.symbol),
        });
      }
    }

    return (
      <Transition
        className={styles.amountBottomRight}
        slideClassName={styles.amountBottomRight_slide}
        name="fade"
        activeKey={activeKey}
      >
        {content}
      </Transition>
    );
  }

  function renderUnstakeTimer() {
    return (
      <div className={buildClassName(styles.unstakeTime)}>
        <AnimatedIconWithPreview
          play={isOpen}
          size={ANIMATED_STICKER_TINY_ICON_PX}
          className={styles.unstakeTimeIcon}
          nonInteractive
          noLoop={false}
          tgsUrl={ANIMATED_STICKERS_PATHS[appTheme].iconClockGrayWhite}
          previewUrl={ANIMATED_STICKERS_PATHS[appTheme].preview.iconClockGrayWhite}
        />
        <div>
          {lang('$unstaking_when_receive', {
            time: (
              <strong>
                {formatRelativeHumanDateTime(lang.code, unstakeDate)}
              </strong>
            ),
          })}
        </div>
      </div>
    );
  }

  function renderUnstakeInfo() {
    const shouldShowInfo = !isInsufficientBalance && unstakeAmount;

    return (
      <Transition name="fade" activeKey={!shouldShowInfo ? 0 : !isLongUnstake ? 1 : 2}>
        {!shouldShowInfo ? undefined
          : (
            !isLongUnstake
              ? (
                <div className={styles.unstakeInfo}>
                  {lang('$unstake_information_instantly')}
                </div>
              )
              : renderUnstakeTimer()
          )}
      </Transition>
    );
  }

  function renderInitial() {
    return (
      <>
        <ModalHeader title={lang('$unstake_asset', { symbol: token?.symbol })} onClose={cancelStaking} />
        <div className={modalStyles.transitionContent}>
          {!isNominators && renderBalance()}
          <RichNumberInput
            key="unstaking_amount"
            id="unstaking_amount"
            hasError={hasAmountError}
            value={unstakeAmount === undefined ? undefined : toDecimal(unstakeAmount, token?.decimals)}
            labelText={lang('Amount to unstake')}
            onChange={handleAmountChange}
            className={styles.amountInput}
            decimals={token?.decimals}
            disabled={isNominators}
          >
            <div className={styles.ton}>
              <img src={logoPath} alt="" className={styles.tonIcon} />
              <span className={styles.tonName}>{token?.symbol}</span>
            </div>
          </RichNumberInput>

          <div className={styles.amountBottomWrapper}>
            <div className={styles.amountBottom}>
              {shouldRenderCurrency && renderCurrencyValue()}
              {renderBottomRight()}
            </div>
          </div>

          {renderUnstakeInfo()}

          <div className={modalStyles.buttons}>
            <Button
              isPrimary
              isLoading={isLoading}
              isDisabled={isUnstakeDisabled}
              onClick={handleStartUnstakeClick}
            >
              {lang('Unstake')}
            </Button>
          </div>
        </div>
      </>
    );
  }

  function renderPassword(isActive: boolean) {
    return (
      <>
        {!getDoesUsePinPad() && (
          <ModalHeader title={lang('Confirm Unstaking')} onClose={cancelStaking} />
        )}
        <PasswordForm
          isActive={isActive}
          isLoading={isLoading}
          withCloseButton={IS_CAPACITOR}
          operationType="unstaking"
          error={error}
          placeholder="Confirm operation with your password"
          submitLabel={lang('Confirm')}
          cancelLabel={lang('Back')}
          onSubmit={handleTransferSubmit}
          onCancel={handleBackClick}
          onUpdate={clearStakingError}
        >
          {renderTransactionBanner()}
        </PasswordForm>
      </>
    );
  }

  function renderComplete(isActive: boolean) {
    return (
      <>
        <ModalHeader
          title={getIsMobileTelegramApp() ? lang('Request is sent!') : lang('Request for unstaking is sent!')}
          onClose={cancelStaking}
        />

        <div className={modalStyles.transitionContent}>
          <TransferResult
            color="green"
            playAnimation={isActive}
            amount={successUnstakeAmount}
            tokenSymbol={token?.symbol}
            noSign
          />

          {isLongUnstake && renderUnstakeTimer()}

          <div className={modalStyles.buttons}>
            <Button onClick={cancelStaking} isPrimary>{lang('Close')}</Button>
          </div>
        </div>
      </>
    );
  }

  // eslint-disable-next-line consistent-return
  function renderContent(isActive: boolean, isFrom: boolean, currentKey: number) {
    switch (currentKey) {
      case StakingState.UnstakeInitial:
        return renderInitial();

      case StakingState.UnstakePassword:
        return renderPassword(isActive);

      case StakingState.UnstakeConnectHardware:
        return (
          <LedgerConnect
            isActive={isActive}
            state={hardwareState}
            isLedgerConnected={isLedgerConnected}
            isTonAppConnected={isTonAppConnected}
            onConnected={handleLedgerConnect}
            onClose={cancelStaking}
          />
        );

      case StakingState.UnstakeConfirmHardware:
        return (
          <LedgerConfirmOperation
            text={lang('Please confirm operation on your Ledger')}
            error={error}
            onClose={cancelStaking}
            onTryAgain={handleLedgerConnect}
          />
        );

      case StakingState.UnstakeComplete:
        return renderComplete(isActive);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      hasCloseButton
      noBackdropClose
      dialogClassName={styles.modalDialog}
      nativeBottomSheetKey="unstake"
      forceFullNative={FULL_SIZE_NBS_STATES.has(renderingKey)}
      onClose={cancelStaking}
      onCloseAnimationEnd={updateNextKey}
    >
      <Transition
        name={resolveSlideTransitionName()}
        className={buildClassName(modalStyles.transition, 'custom-scroll')}
        slideClassName={modalStyles.transitionSlide}
        activeKey={renderingKey}
        nextKey={nextKey}
        onStop={updateNextKey}
      >
        {renderContent}
      </Transition>
    </Modal>
  );
}

export default memo(withGlobal((global): StateProps => {
  const accountId = global.currentAccountId!;
  const tokens = selectCurrentAccountTokens(global);
  const baseCurrency = global.settings.baseCurrency;
  const isMultichainAccount = selectIsMultichainAccount(global, accountId);
  const stakingState = selectAccountStakingState(global, accountId);
  const isNominators = stakingState?.type === 'nominators';

  const {
    hardwareState,
    isLedgerConnected,
    isTonAppConnected,
  } = global.hardware;

  return {
    ...global.currentStaking,
    tokens,
    stakingInfo: global.stakingInfo,
    baseCurrency,
    isNominators,
    hardwareState,
    isLedgerConnected,
    isTonAppConnected,
    theme: global.settings.theme,
    isMultichainAccount,
    stakingState,
  };
})(UnstakeModal));
