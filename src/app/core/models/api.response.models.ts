export interface Ticker {
  active: boolean;
  cik: string;
  composite_figi: string;
  currency_name: string;
  last_updated_utc: string;
  locale: string;
  market: string;
  name: string;
  primary_exchange: string;
  share_class_figi: string;
  ticker: string;
  type: string;
}

export interface AggsResult {
  c: number;
  h: number;
  l: number;
  n: number;
  o: number;
  t: number;
  v: number;
  vw: number;
}

export interface TickerDetail {
  request_id: string;
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange: string;
  type: string;
  active: boolean;
  currency_name: string;
  cik: string;
  composite_figi: string;
  share_class_figi: string;
  market_cap: number;
  phone_number: string;
  address: {
    address1: string;
    city: string;
    state: string;
    postal_code: string;
  };
  description: string;
  sic_code: string;
  sic_description: string;
  ticker_root: string;
  homepage_url: string;
  total_employees: number;
  list_date: string;
  branding: {
    logo_url: string;
    icon_url: string;
  };
  share_class_shares_outstanding: number;
  weighted_shares_outstanding: number;
  round_lot: number;
  status: string;
}

export interface TradeSocket {
  ev: string; // Example: "T"
  sym: string; // Example: "MSFT"
  x: number; // Example: 4
  i: string; // Example: "12345"
  z: number; // Example: 3
  p: number; // Example: 114.125
  s: number; // Example: 100
  c: number[]; // Example: [0, 12]
  t: number; // Example: 1536036818784
  q: number; // Example: 3681328
}

export interface TickerSnapshot {
  market_status?: string;
  name?: string;
  ticker: string;
  type: string;
  session?: {
      change: number;
      change_percent: number;
      early_trading_change: number;
      early_trading_change_percent: number;
      close: number;
      high: number;
      low: number;
      open: number;
      volume: number;
      previous_close: number;
      price?: number; // Optional, only present in certain items
  };
  last_quote?: {
      last_updated: number;
      timeframe: string;
      ask: number;
      ask_size: number;
      ask_exchange: number;
      bid: number;
      bid_size: number;
      bid_exchange: number;
      midpoint?: number; // Optional, only present in certain items
  };
  last_trade?: {
      last_updated: number;
      timeframe: string;
      id?: string; // Optional, only present in certain items
      price: number;
      size: number;
      exchange: number;
      conditions?: number[];
      sip_timestamp?: number; // Optional, only present in certain items
  };
  break_even_price?: number;
  details?: {
      contract_type: string;
      exercise_style: string;
      expiration_date: string;
      shares_per_contract: number;
      strike_price: number;
  };
  greeks?: {
      delta: number;
      gamma: number;
      theta: number;
      vega: number;
  };
  implied_volatility?: number;
  open_interest?: number;
  underlying_asset?: {
      change_to_break_even: number;
      last_updated: number;
      price: number;
      ticker: string;
      timeframe: string;
  };
  error?: string;
  message?: string;
}

export interface StockQuote {
  ev: string;
  sym: string;
  bx: number;
  bp: number;
  bs: number;
  ax: number;
  ap: number;
  as: number;
  c: number;
  i: number[];
  t: number;
  q: number;
  z: number;
}

export interface NewsItem {
  id: string;
  publisher: {
    name: string;
    homepage_url: string;
    logo_url: string;
    favicon_url: string;
  };
  title: string;
  author: string;
  published_utc: string;
  article_url: string;
  tickers: string[];
  amp_url: string;
  image_url: string;
  description: string;
  keywords?: string[]; // Optional property
}

export interface ApiResponse<T> {
  count: number;
  next_url: string;
  request_id: string;
  results: T[];
  status: string;
}

export interface ApiResponseObject<T> {
  count: number;
  next_url: string;
  request_id: string;
  results: T;
  ticker: T;
  status: string;
}

export interface TradingSchedule {
  date: string; // Date in YYYY-MM-DD format
  exchange: string; // Exchange name (e.g., "NYSE" or "NASDAQ")
  name: string; // Name of the holiday or event
  status: "closed" | "early-close"; // Trading status (either closed or early-close)
  open?: string; // Optional: Opening time for early-close
  close?: string; // Optional: Closing time for early-close
}

export interface MarketData {
  afterHours: boolean;
  currencies: {
    crypto: string;
    fx: string;
  };
  earlyHours: boolean;
  exchanges: {
    nasdaq: string;
    nyse: string;
    otc: string;
  };
  indicesGroups: {
    s_and_p: string;
    societe_generale: string;
    msci: string;
    ftse_russell: string;
    mstar: string;
    mstarc: string;
    cccy: string;
    nasdaq: string;
    dow_jones: string;
  };
  market: string;
  serverTime: string;
}
