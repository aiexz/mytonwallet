import type { ApiTonWalletVersion } from './api/chains/ton/types';
import type {
  ApiBaseCurrency,
  ApiLiquidStakingState,
  ApiNominatorsStakingState,
  ApiSwapAsset,
  ApiSwapDexLabel,
} from './api/types';
import type { LangItem, TokenPeriod } from './global/types';

export const APP_ENV = process.env.APP_ENV;

export const APP_NAME = process.env.APP_NAME || 'MyTonWallet';
export const APP_VERSION = process.env.APP_VERSION!;
export const APP_ENV_MARKER = APP_ENV === 'staging' ? 'Beta' : APP_ENV === 'development' ? 'Dev' : undefined;

export const DEBUG = APP_ENV !== 'production' && APP_ENV !== 'perf' && APP_ENV !== 'test';
export const DEBUG_MORE = false;
export const DEBUG_API = false;

export const IS_PRODUCTION = APP_ENV === 'production';
export const IS_TEST = APP_ENV === 'test';
export const IS_PERF = APP_ENV === 'perf';
export const IS_EXTENSION = process.env.IS_EXTENSION === '1';
export const IS_FIREFOX_EXTENSION = process.env.IS_FIREFOX_EXTENSION === '1';
export const IS_OPERA_EXTENSION = process.env.IS_OPERA_EXTENSION === '1';
export const IS_PACKAGED_ELECTRON = process.env.IS_PACKAGED_ELECTRON === '1';
export const IS_CAPACITOR = process.env.IS_CAPACITOR === '1';
export const IS_ANDROID_DIRECT = process.env.IS_ANDROID_DIRECT === '1';
export const IS_AIR_APP = process.env.IS_AIR_APP === '1';
export const IS_TELEGRAM_APP = process.env.IS_TELEGRAM_APP === '1';

export const ELECTRON_HOST_URL = 'https://dumb-host';
export const INACTIVE_MARKER = '[Inactive]';
export const PRODUCTION_URL = 'https://mytonwallet.app';
export const BETA_URL = 'https://beta.mytonwallet.app';
export const APP_INSTALL_URL = 'https://get.mytonwallet.io/';
export const APP_REPO_URL = 'https://github.com/mytonwalletorg/mytonwallet';
export const BASE_URL = process.env.BASE_URL;

export const BOT_USERNAME = process.env.BOT_USERNAME || 'MyTonWalletBot';

export const SWAP_FEE_ADDRESS = process.env.SWAP_FEE_ADDRESS || 'UQDUkQbpTVIgt7v66-JTFR-3-eXRFz_4V66F-Ufn6vOg0GOp';
export const DIESEL_ADDRESS = process.env.DIESEL_ADDRESS || 'UQC9lQOaEHC6YASiJJ2NrKEOlITMMQmc8j0_iZEHy-4sl3tG';

export const STRICTERDOM_ENABLED = DEBUG && !IS_PACKAGED_ELECTRON;

export const DEBUG_ALERT_MSG = 'Shoot!\nSomething went wrong, please see the error details in Dev Tools Console.';

export const PIN_LENGTH = 4;
export const NATIVE_BIOMETRICS_USERNAME = 'MyTonWallet';
export const NATIVE_BIOMETRICS_SERVER = 'https://mytonwallet.app';

export const MNEMONIC_COUNT = 24;
export const MNEMONIC_COUNTS = [12, 24];

export const PRIVATE_KEY_HEX_LENGTH = 64;
export const MNEMONIC_CHECK_COUNT = 3;

export const MOBILE_SCREEN_MAX_WIDTH = 700; // px

export const ANIMATION_END_DELAY = 50;

export const ANIMATED_STICKER_TINY_ICON_PX = 16;
export const ANIMATED_STICKER_ICON_PX = 30;
export const ANIMATED_STICKER_TINY_SIZE_PX = 70;
export const ANIMATED_STICKER_SMALL_SIZE_PX = 110;
export const ANIMATED_STICKER_MIDDLE_SIZE_PX = 120;
export const ANIMATED_STICKER_DEFAULT_PX = 150;
export const ANIMATED_STICKER_BIG_SIZE_PX = 156;
export const ANIMATED_STICKER_HUGE_SIZE_PX = 192;

export const DEFAULT_LANDSCAPE_ACTION_TAB_ID = 0;
export const TRANSACTION_ADDRESS_SHIFT = 4;

export const WHOLE_PART_DELIMITER = ' '; // https://www.compart.com/en/unicode/U+202F

export const DEFAULT_SLIPPAGE_VALUE = 5;

export const GLOBAL_STATE_CACHE_DISABLED = false;
export const GLOBAL_STATE_CACHE_KEY = 'mytonwallet-global-state';

export const ANIMATION_LEVEL_MIN = 0;
export const ANIMATION_LEVEL_MED = 1;
export const ANIMATION_LEVEL_MAX = 2;
export const ANIMATION_LEVEL_DEFAULT = ANIMATION_LEVEL_MAX;
export const THEME_DEFAULT = 'system';

export const MAIN_ACCOUNT_ID = '0-ton-mainnet';

export const TONCENTER_MAINNET_URL = process.env.TONCENTER_MAINNET_URL || 'https://toncenter.mytonwallet.org';
export const TONCENTER_MAINNET_KEY = process.env.TONCENTER_MAINNET_KEY;
export const ELECTRON_TONCENTER_MAINNET_KEY = process.env.ELECTRON_TONCENTER_MAINNET_KEY;
export const TONAPIIO_MAINNET_URL = process.env.TONAPIIO_MAINNET_URL || 'https://tonapiio.mytonwallet.org';

export const TONCENTER_TESTNET_URL = process.env.TONCENTER_TESTNET_URL || 'https://toncenter-testnet.mytonwallet.org';
export const TONCENTER_TESTNET_KEY = process.env.TONCENTER_TESTNET_KEY;
export const ELECTRON_TONCENTER_TESTNET_KEY = process.env.ELECTRON_TONCENTER_TESTNET_KEY;
export const TONAPIIO_TESTNET_URL = process.env.TONAPIIO_TESTNET_URL || 'https://tonapiio-testnet.mytonwallet.org';

export const BRILLIANT_API_BASE_URL = process.env.BRILLIANT_API_BASE_URL || 'https://api.mytonwallet.org';

export const TRON_MAINNET_API_URL = process.env.TRON_MAINNET_API_URL || 'https://tronapi.mytonwallet.org';
export const TRON_TESTNET_API_URL = process.env.TRON_TESTNET_API_URL || 'https://api.shasta.trongrid.io';

export const FRACTION_DIGITS = 9;
export const SHORT_FRACTION_DIGITS = 2;

export const MAX_PUSH_NOTIFICATIONS_ACCOUNT_COUNT = 3;

export const SUPPORT_USERNAME = 'mysupport';
export const MTW_TIPS_CHANNEL_NAME = { en: 'MyTonWalletTips', ru: 'MyTonWalletTipsRu' };
export const MTW_CARDS_BASE_URL = 'https://static.mytonwallet.org/cards/';
export const MYTONWALLET_PROMO_URL = 'https://mytonwallet.io/';
export const TELEGRAM_WEB_URL = 'https://web.telegram.org/a/';
export const NFT_MARKETPLACE_URL = 'https://getgems.io/';
export const NFT_MARKETPLACE_TITLE = 'GetGems';
export const GETGEMS_BASE_MAINNET_URL = 'https://getgems.io/';
export const GETGEMS_BASE_TESTNET_URL = 'https://testnet.getgems.io/';
export const HELPCENTER_URL = { en: 'https://help.mytonwallet.io/', ru: 'https://help.mytonwallet.io/ru' };
export const EMPTY_HASH_VALUE = 'NOHASH';

export const CHANGELLY_SUPPORT_EMAIL = 'support@changelly.com';
export const CHANGELLY_LIVE_CHAT_URL = 'https://changelly.com/';
export const CHANGELLY_SECURITY_EMAIL = 'security@changelly.com';
export const CHANGELLY_TERMS_OF_USE = 'https://changelly.com/terms-of-use';
export const CHANGELLY_PRIVACY_POLICY = 'https://changelly.com/privacy-policy';
export const CHANGELLY_AML_KYC = 'https://changelly.com/aml-kyc';
export const CHANGELLY_WAITING_DEADLINE = 3 * 60 * 60 * 1000; // 3 hour

export const PROXY_HOSTS = process.env.PROXY_HOSTS;

export const TINY_TRANSFER_MAX_COST = 0.01;

export const IMAGE_CACHE_NAME = 'mtw-image';
export const LANG_CACHE_NAME = 'mtw-lang-175';

export const LANG_LIST: LangItem[] = [{
  langCode: 'en',
  name: 'English',
  nativeName: 'English',
  rtl: false,
}, {
  langCode: 'es',
  name: 'Spanish',
  nativeName: 'Español',
  rtl: false,
}, {
  langCode: 'ru',
  name: 'Russian',
  nativeName: 'Русский',
  rtl: false,
}, {
  langCode: 'zh-Hans',
  name: 'Chinese (Simplified)',
  nativeName: '简体',
  rtl: false,
}, {
  langCode: 'zh-Hant',
  name: 'Chinese (Traditional)',
  nativeName: '繁體',
  rtl: false,
}, {
  langCode: 'tr',
  name: 'Turkish',
  nativeName: 'Türkçe',
  rtl: false,
}, {
  langCode: 'de',
  name: 'German',
  nativeName: 'Deutsch',
  rtl: false,
}, {
  langCode: 'th',
  name: 'Thai',
  nativeName: 'ไทย',
  rtl: false,
}, {
  langCode: 'uk',
  name: 'Ukrainian',
  nativeName: 'Українська',
  rtl: false,
}, {
  langCode: 'pl',
  name: 'Polish',
  nativeName: 'Polski',
  rtl: false,
}];

export const STAKING_CYCLE_DURATION_MS = 131_072_000; // 36.4 hours
export const VALIDATION_PERIOD_MS = 65_536_000; // 18.2 h.
export const ONE_TON = 1_000_000_000n;
export const DEFAULT_FEE = 15_000_000n; // 0.015 TON

export const STAKING_POOLS = process.env.STAKING_POOLS ? process.env.STAKING_POOLS.split(' ') : [];
export const LIQUID_POOL = process.env.LIQUID_POOL || 'EQD2_4d91M4TVbEBVyBF8J1UwpMJc361LKVCz6bBlffMW05o';
export const LIQUID_JETTON = process.env.LIQUID_JETTON || 'EQCqC6EhRJ_tpWngKxL6dV0k6DSnRUrs9GSVkLbfdCqsj6TE';
export const STAKING_MIN_AMOUNT = ONE_TON;
export const NOMINATORS_STAKING_MIN_AMOUNT = 10_000n * ONE_TON;
export const MIN_ACTIVE_STAKING_REWARDS = 100_000_000n; // 0.1 MY

export const TONCONNECT_PROTOCOL_VERSION = 2;
export const TONCONNECT_WALLET_JSBRIDGE_KEY = 'mytonwallet';

export const NFT_FRAGMENT_COLLECTIONS = new Set([
  '0:0e41dc1dc3c9067ed24248580e12b3359818d83dee0304fabcf80845eafafdb2', // Anonymous Telegram Numbers
  '0:80d78a35f955a14b679faa887ff4cd5bfc0f43b4a4eea2a7e6927f3701b273c2', // Telegram Usernames
]);
export const NFT_FRAGMENT_GIFT_IMAGE_URL_PREFIX = 'https://nft.fragment.com/gift/';
export const NFT_FRAGMENT_GIFT_IMAGE_TO_URL_REGEX = /^https?:\/\/nft\.(fragment\.com\/gift\/[\w-]+-\d+)\.\w+$/i;

export const MTW_CARDS_COLLECTION = 'EQCQE2L9hfwx1V8sgmF9keraHx1rNK9VmgR1ctVvINBGykyM';
export const TON_DNS_COLLECTION = 'EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz';

export const TONCOIN = {
  name: 'Toncoin',
  symbol: 'TON',
  slug: 'toncoin',
  decimals: 9,
  chain: 'ton',
  cmcSlug: 'toncoin',
} as const;

export const TRX = {
  name: 'TRON',
  symbol: 'TRX',
  slug: 'trx',
  decimals: 6,
  chain: 'tron',
  cmcSlug: 'tron',
} as const;

export const MYCOIN = {
  name: 'MyTonWallet Coin',
  symbol: 'MY',
  slug: 'ton-eqcfvnlrbn',
  decimals: 9,
  chain: 'ton',
  minterAddress: 'EQCFVNlRb-NHHDQfv3Q9xvDXBLJlay855_xREsq5ZDX6KN-w',
} as const;

export const MYCOIN_TESTNET = {
  ...MYCOIN,
  slug: 'ton-kqawlxpebw',
  minterAddress: 'kQAWlxpEbwhCDFX9gp824ee2xVBhAh5VRSGWfbNFDddAbQoQ',
} as const;

export const CHAIN_CONFIG = {
  ton: {
    isMemoSupported: true,
    isDnsSupported: true,
    addressRegex: /^([-\w_]{48}|0:[\da-h]{64})$/i,
    addressPrefixRegex: /^([-\w_]{1,48}|0:[\da-h]{0,64})$/i,
    nativeToken: TONCOIN,
  },
  tron: {
    isMemoSupported: false,
    isDnsSupported: false,
    addressRegex: /^T[1-9A-HJ-NP-Za-km-z]{33}$/,
    addressPrefixRegex: /^T[1-9A-HJ-NP-Za-km-z]{0,33}$/,
    nativeToken: TRX,
    mainnet: {
      apiUrl: TRON_MAINNET_API_URL,
      usdtAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    },
    testnet: {
      apiUrl: TRON_TESTNET_API_URL,
      usdtAddress: 'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs',
    },
  },
} as const;

export const TRC20_USDT_MAINNET_SLUG = 'tron-tr7nhqjekq';
export const TRC20_USDT_TESTNET_SLUG = 'tron-tg3xxyexbk';
export const TON_USDT_SLUG = 'ton-eqcxe6mutq';
export const STAKED_TON_SLUG = 'ton-eqcqc6ehrj';
export const STAKED_MYCOIN_SLUG = 'ton-eqcbzvsfwq';
export const TRX_SWAP_COUNT_FEE_ADDRESS = 'TW2LXSebZ7Br1zHaiA2W1zRojDkDwjGmpw';

const TRC20_USDT = {
  name: 'Tether USD',
  symbol: 'USDT',
  decimals: 6,
  chain: 'tron',
} as const;

const TON_USDT = {
  name: 'Tether USD',
  symbol: 'USD₮',
  chain: 'ton',
  slug: TON_USDT_SLUG,
  decimals: 6,
  tokenAddress: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs',
} as const;

export const DEFAULT_ENABLED_TOKEN_SLUGS = [
  TONCOIN.slug, TON_USDT_SLUG, TRX.slug, TRC20_USDT_TESTNET_SLUG, TRC20_USDT_MAINNET_SLUG,
] as string[];

// Toncoin, USDT TON, TRX, USDT TRC20
export const DEFAULT_ENABLED_TOKEN_COUNT = 4;

export const PRIORITY_TOKEN_SLUGS = [
  TONCOIN.slug, TON_USDT_SLUG, TRX.slug,
] as string[];

export const TOKEN_INFO = {
  toncoin: {
    ...TONCOIN,
    quote: {
      slug: TONCOIN.slug,
      price: 1.95,
      priceUsd: 1.95,
      percentChange24h: 0,
    },
  },
  trx: {
    ...TRX,
    quote: {
      slug: TRX.slug,
      price: 0,
      priceUsd: 0,
      percentChange24h: 0,
    },
  },
  [TRC20_USDT_MAINNET_SLUG]: { // mainnet
    ...TRC20_USDT,
    slug: TRC20_USDT_MAINNET_SLUG,
    tokenAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    quote: {
      slug: TRC20_USDT_MAINNET_SLUG,
      price: 0,
      priceUsd: 0,
      percentChange24h: 0,
    },
  },
  [TRC20_USDT_TESTNET_SLUG]: { // testnet
    ...TRC20_USDT,
    slug: TRC20_USDT_TESTNET_SLUG,
    tokenAddress: 'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs',
    quote: {
      slug: TRC20_USDT_TESTNET_SLUG,
      price: 0,
      priceUsd: 0,
      percentChange24h: 0,
    },
  },
  [TON_USDT_SLUG]: {
    ...TON_USDT,
    // eslint-disable-next-line max-len
    image: 'https://cache.tonapi.io/imgproxy/T3PB4s7oprNVaJkwqbGg54nexKE0zzKhcrPv8jcWYzU/rs:fill:200:200:1/g:no/aHR0cHM6Ly90ZXRoZXIudG8vaW1hZ2VzL2xvZ29DaXJjbGUucG5n.webp',
    quote: {
      slug: TON_USDT_SLUG,
      price: 0,
      priceUsd: 0,
      percentChange24h: 0,
    },
  },
  [MYCOIN.slug]: {
    ...MYCOIN,
    // eslint-disable-next-line max-len
    image: 'https://cache.tonapi.io/imgproxy/Qy038wCBKISofJ0hYMlj6COWma330cx3Ju1ZSPM2LRU/rs:fill:200:200:1/g:no/aHR0cHM6Ly9teXRvbndhbGxldC5pby9sb2dvLTI1Ni1ibHVlLnBuZw.webp',
    quote: {
      slug: MYCOIN.slug,
      price: 0,
      priceUsd: 0,
      percentChange24h: 0,
    },
  },
};

export const TOKEN_WITH_LABEL: Record<string, string> = {
  [TRC20_USDT_MAINNET_SLUG]: 'TRC-20',
  [TRC20_USDT_TESTNET_SLUG]: 'TRC-20',
  [TON_USDT_SLUG]: 'TON',
};

export const INIT_SWAP_ASSETS: Record<string, ApiSwapAsset> = {
  toncoin: {
    name: 'Toncoin',
    symbol: TONCOIN.symbol,
    chain: TONCOIN.chain,
    slug: TONCOIN.slug,
    decimals: TONCOIN.decimals,
    price: 0,
    priceUsd: 0,
    isPopular: true,
  },
  [TON_USDT_SLUG]: {
    name: 'Tether USD',
    symbol: 'USD₮',
    chain: 'ton',
    slug: TON_USDT_SLUG,
    decimals: 9,
    // eslint-disable-next-line max-len
    image: 'https://cache.tonapi.io/imgproxy/T3PB4s7oprNVaJkwqbGg54nexKE0zzKhcrPv8jcWYzU/rs:fill:200:200:1/g:no/aHR0cHM6Ly90ZXRoZXIudG8vaW1hZ2VzL2xvZ29DaXJjbGUucG5n.webp',
    tokenAddress: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs',
    price: 0,
    priceUsd: 0,
    isPopular: true,
  },
};

export const DEFAULT_TRX_SWAP_FIRST_TOKEN_SLUG = TONCOIN.slug;
export const DEFAULT_SWAP_FISRT_TOKEN_SLUG = TONCOIN.slug;
export const DEFAULT_SWAP_SECOND_TOKEN_SLUG = TON_USDT_SLUG;
export const DEFAULT_TRANSFER_TOKEN_SLUG = TONCOIN.slug;
export const DEFAULT_CEX_SWAP_SECOND_TOKEN_SLUG = TRC20_USDT_MAINNET_SLUG;
export const SWAP_DEX_LABELS: Record<ApiSwapDexLabel, string> = {
  dedust: 'DeDust',
  ston: 'STON.fi',
};

export const MULTITAB_DATA_CHANNEL_NAME = 'mtw-multitab';
export const ACTIVE_TAB_STORAGE_KEY = 'mtw-active-tab';

export const INDEXED_DB_NAME = 'keyval-store';
export const INDEXED_DB_STORE_NAME = 'keyval';

export const WINDOW_PROVIDER_CHANNEL = 'windowProvider';

export const PORTRAIT_MIN_ASSETS_TAB_VIEW = 4;
export const LANDSCAPE_MIN_ASSETS_TAB_VIEW = 6;

export const DEFAULT_PRICE_CURRENCY = 'USD';
export const SHORT_CURRENCY_SYMBOL_MAP = {
  USD: '$',
  EUR: '€',
  RUB: '₽',
  CNY: '¥',
};
export const CURRENCY_LIST: { value: ApiBaseCurrency; name: string }[] = [
  {
    value: 'USD',
    name: 'US Dollar',
  }, {
    value: 'EUR',
    name: 'Euro',
  }, {
    value: 'RUB',
    name: 'Ruble',
  }, {
    value: 'CNY',
    name: 'Yuan',
  }, {
    value: 'BTC',
    name: 'Bitcoin',
  }, {
    value: TONCOIN.symbol,
    name: 'Toncoin',
  },
];

export const BURN_ADDRESS = 'UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ';

export const DEFAULT_WALLET_VERSION: ApiTonWalletVersion = 'W5';
export const POPULAR_WALLET_VERSIONS: ApiTonWalletVersion[] = ['v3R1', 'v3R2', 'v4R2', 'W5'];
export const LEDGER_WALLET_VERSIONS: ApiTonWalletVersion[] = ['v3R2', 'v4R2'];

export const DEFAULT_TIMEOUT = 10000;
export const DEFAULT_RETRIES = 3;
export const DEFAULT_ERROR_PAUSE = 500;

export const HISTORY_PERIODS: TokenPeriod[] = ['1D', '7D', '1M', '3M', '1Y', 'ALL'];

export const BROWSER_HISTORY_LIMIT = 10;

export const NFT_BATCH_SIZE = 4;
export const NOTCOIN_VOUCHERS_ADDRESS = 'EQDmkj65Ab_m0aZaW8IpKw4kYqIgITw_HRstYEkVQ6NIYCyW';
export const BURN_CHUNK_DURATION_APPROX_SEC = 30;
export const NOTCOIN_FORWARD_TON_AMOUNT = 30000000n; // 0.03 TON
export const NOTCOIN_EXCHANGERS = [
  'EQAPZauWVPUcm2hUJT9n36pxznEhl46rEn1bzBXN0RY_yiy2',
  'EQASgm0Qv3h2H2mF0W06ikPqYq2ctT3dyXMJH_svbEKKB3iZ',
  'EQArlmP-RhVIG2yAFGZyPZfM3m0YccxmpvoRi6sgRzWnAA0s',
  'EQA6pL-spYqZp1Ck6o3rpY45Cl-bvLMW_j3qdVejOkUWpLnm',
  'EQBJ_ehYjumQKbXfWUue1KHKXdTm1GuYJB0Fj2ST_DwORvpd',
  'EQBRmYSjxh9xlZpUqEmGjF5UjukI9v_Cm2kCTu4CoBn3XkOD',
  'EQBkiqncd7AFT5_23H-RoA2Vynk-Nzq_dLoeMVRthAU9RF0p',
  'EQB_OzTHXbztABe0QHgr4PtAV8T64LR6aDunXgaAoihOdxwO',
  'EQCL-x5kLg6tKVNGryItTuj6tG3FH5mhUEu0xRqQc-kbEmbe',
  'EQCZh2yJ46RaQH3AYmjEA8SMMXi77Oein4-3lvqkHseIAhD-',
  'EQChKo5IK3iNqUHUGDB9gtzjCjMTPtmsFqekuCA2MdreVEyu',
  'EQC6DNCBv076TIliRMfOt20RpbS7rNKDfSky3WrFEapFt8AH',
  'EQDE_XFZOYae_rl3ZMsgBCtRSmYhl8B4y2BZEP7oiGBDhlgy',
  'EQDddqpGA2ePXQF47A2DSL3GF6ZzIVmimfM2d16cdymy2noT',
  'EQDv0hNNAamhYltCh3pTJrq3oRB9RW2ZhEYkTP6fhj5BtZNu',
  'EQD2mP7zgO7-imUJhqYry3i07aJ_SR53DaokMupfAAobt0Xw',
] as const;

export const CLAIM_ADDRESS = 'EQB3zOTvPi1PmwdcTpqSfFKZnhi1GNKEVJM-LdoAirdLtash';
export const CLAIM_AMOUNT = 30000000n; // 0.03 TON
export const CLAIM_COMMENT = 'claim';

// eslint-disable-next-line max-len
export const RE_LINK_TEMPLATE = /((ftp|https?):\/\/)?(?<host>(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z][-a-zA-Z0-9]{1,62})\b([-a-zA-Z0-9()@:%_+.,~#?&/=]*)/g;
// eslint-disable-next-line max-len
export const RE_TG_BOT_MENTION = /telegram[:\s-]*((@[a-z0-9_]+)|(https:\/\/)?(t\.me|telegram\.me|telegram\.dog)\/[a-z0-9_]+)/mig;

export const STARS_SYMBOL = '⭐️';

export const GIVEAWAY_CHECKIN_URL = process.env.GIVEAWAY_CHECKIN_URL || 'https://giveaway.mytonwallet.io';

export const AUTOLOCK_OPTIONS_LIST = [
  {
    value: 'never',
    name: 'Disabled',
    selectedName: 'Disabled',
    period: 0,
  },
  {
    value: '1',
    name: '30 seconds',
    selectedName: 'If away for 30 sec',
    period: 30_000,
  },
  {
    value: '2',
    name: '3 minutes',
    selectedName: 'If away for 3 min',
    period: 60_000 * 3,
  },
  {
    value: '3',
    name: '10 minutes',
    selectedName: 'If away for 10 min',
    period: 60_000 * 10,
  },
] as const;

export const PRICELESS_TOKEN_HASHES = new Set([
  '82566ad72b6568fe7276437d3b0c911aab65ed701c13601941b2917305e81c11', // Stonfi V1
  'ec614ea4aaea3f7768606f1c1632b3374d3de096a1e7c4ba43c8009c487fee9d', // Stonfi V2
  'c0f9d14fbc8e14f0d72cba2214165eee35836ab174130912baf9dbfa43ead562', // Dedust (for example, EQBkh7Mc411WTYF0o085MtwJpYpvGhZOMBphhIFzEpzlVODp)
  '1275095b6da3911292406f4f4386f9e780099b854c6dee9ee2895ddce70927c1', // Dedust (for example, EQCm92zFBkLe_qcFDp7WBvI6JFSDsm4WbDPvZ7xNd7nPL_6M)
  '5d01684bdf1d5c9be2682c4e36074202432628bd3477d77518d66b0976b78cca', // USDT Storm LP (for example, EQAzm06UMMsnFQrNKEubV1myIR-mm2ZOCnoic36frCgD8MLR)
]);

export const STAKED_TOKEN_SLUGS = new Set([
  STAKED_TON_SLUG,
  STAKED_MYCOIN_SLUG,
]);

export const DEFAULT_OUR_SWAP_FEE = 0.875;

export const DEFAULT_STAKING_STATE: ApiLiquidStakingState = {
  type: 'liquid',
  id: 'liquid',
  tokenSlug: TONCOIN.slug,
  annualYield: 3.9,
  yieldType: 'APY',
  balance: 0n,
  pool: LIQUID_POOL,
  tokenBalance: 0n,
  unstakeRequestAmount: 0n,
  instantAvailable: 0n,
};

export const DEFAULT_NOMINATORS_STAKING_STATE: ApiNominatorsStakingState = {
  type: 'nominators',
  id: 'nominators',
  tokenSlug: TONCOIN.slug,
  annualYield: 3.9,
  yieldType: 'APY',
  balance: 0n,
  pool: 'Ef8dgIOIRyCLU0NEvF8TD6Me3wrbrkS1z3Gpjk3ppd8m8-s_',
  start: 0,
  end: 0,
  pendingDepositAmount: 0n,
};

export const SWAP_API_VERSION = 2;

export const JVAULT_URL = 'https://jvault.xyz';
