import type { URLOpenListenerEvent } from '@capacitor/app';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { BiometryType, NativeBiometric } from '@capgo/capacitor-native-biometric';
import { SplashScreen } from '@sina_kh/mtw-capacitor-splash-screen';
import type { SafeAreaInsets } from 'capacitor-plugin-safe-area';
import { SafeArea } from 'capacitor-plugin-safe-area';
import { getGlobal } from '../../global';

import type { AuthConfig } from '../authApi/types';
import type { CapacitorPlatform } from './platform';

import { GLOBAL_STATE_CACHE_KEY } from '../../config';
import * as storageMethods from '../capacitorStorageProxy/methods';
import { processDeeplink } from '../deeplink';
import { IS_DELEGATED_BOTTOM_SHEET, IS_IOS } from '../windowEnvironment';
import { initNotificationsWithGlobal } from './notifications';
import { getCapacitorPlatform, setCapacitorPlatform } from './platform';

// Full list of options can be found at https://github.com/apache/cordova-plugin-inappbrowser#cordovainappbrowseropen
export const INAPP_BROWSER_OPTIONS = [
  `location=${IS_IOS ? 'no' : 'yes'}`,
  `lefttoright=${IS_IOS ? 'no' : 'yes'}`,
  'usewkwebview=yes',
  'clearcache=no',
  'clearsessioncache=no',
  'hidden=yes',
  'toolbarposition=top',
  'hidenavigationbuttons=yes',
  'hideurlbar=no',
  'backbuttoncaption=Back',
  'allowInlineMediaPlayback=yes',
].join(',');
const IOS_SPLASH_SCREEN_HIDE_DELAY = 500;
const IOS_SPLASH_SCREEN_HIDE_DURATION = 600;
export const VIBRATE_SUCCESS_END_PAUSE_MS = 1300;

let launchUrl: string | undefined;
let isNativeBiometricAuthSupported = false;
let isFaceIdAvailable = false;
let isTouchIdAvailable = false;
let statusBarHeight = 0;

function updateSafeAreaValues(safeAreaInsets: SafeAreaInsets) {
  for (const [key, value] of Object.entries(safeAreaInsets.insets)) {
    document.documentElement.style.setProperty(
      `--safe-area-${key}`,
      `${getCapacitorPlatform() === 'android' && key === 'top' ? value + 8 : value}px`,
    );
  }
}

export async function initCapacitor() {
  setCapacitorPlatform(Capacitor.getPlatform() as CapacitorPlatform);

  void SafeArea.getStatusBarHeight().then(({ statusBarHeight: height }) => {
    statusBarHeight = height;
    document.documentElement.style.setProperty('--status-bar-height', `${height}px`);
  });

  void SafeArea.getSafeAreaInsets().then(({ insets: { bottom } }) => {
    document.documentElement.style.setProperty('--safe-area-bottom', `${bottom}px`);
  });

  if (IS_DELEGATED_BOTTOM_SHEET) {
    void SplashScreen.hide({ fadeOutDuration: 0 });
    return;
  }

  if (getCapacitorPlatform() === 'ios') {
    setTimeout(() => {
      void SplashScreen.hide({ fadeOutDuration: IOS_SPLASH_SCREEN_HIDE_DURATION });
    }, IOS_SPLASH_SCREEN_HIDE_DELAY);
  }

  void App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
    void processDeeplink(event.url);
  });

  void App.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back();
    } else {
      void App.exitApp();
    }
  });

  updateSafeAreaValues(await SafeArea.getSafeAreaInsets());

  await SafeArea.addListener('safeAreaChanged', (data) => {
    updateSafeAreaValues(data);
  });

  launchUrl = (await App.getLaunchUrl())?.url;

  if (launchUrl) {
    void processDeeplink(launchUrl);
  }
}

export async function initCapacitorWithGlobal(authConfig?: AuthConfig) {
  const isNativeBiometricAuthEnabled = !!authConfig && authConfig.kind === 'native-biometrics';

  const biometricsAvailableResult = await NativeBiometric.isAvailable({
    isWeakAuthenticatorAllowed: isNativeBiometricAuthEnabled,
    useFallback: false,
  });

  isNativeBiometricAuthSupported = biometricsAvailableResult.isAvailable;
  isFaceIdAvailable = biometricsAvailableResult.biometryType === BiometryType.FACE_ID;
  isTouchIdAvailable = biometricsAvailableResult.biometryType === BiometryType.TOUCH_ID;

  void initNotificationsWithGlobal(getGlobal());
}

export function getLaunchUrl() {
  return launchUrl;
}

export function clearLaunchUrl() {
  launchUrl = undefined;
}

export function getStatusBarHeight() {
  return statusBarHeight;
}

export function getIsCapacitorBiometricAuthSupported() {
  return isNativeBiometricAuthSupported;
}

export function getIsCapacitorFaceIdAvailable() {
  return isFaceIdAvailable;
}

export function getIsCapacitorTouchIdAvailable() {
  return isTouchIdAvailable;
}

export async function fixIosAppStorage() {
  await storageMethods.init();

  const isLocalStorageDataExists = Boolean(window.localStorage.getItem(GLOBAL_STATE_CACHE_KEY));
  const isApiStorageDataExists = Boolean(await storageMethods.getItem('accounts'));

  if (isLocalStorageDataExists && !isApiStorageDataExists) {
    window.localStorage.clear();
  }

  if (!isLocalStorageDataExists && isApiStorageDataExists) {
    await storageMethods.clear();
  }
}
