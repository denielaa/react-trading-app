export const ExchangeType = {
  BINANCE: 'BINANCE',
  FTX: 'FTX'
}

export const InstrumentTypes = {
  [ExchangeType.BINANCE]: ['BTC-USD', 'ETH-USDT'],
  [ExchangeType.FTX]: ['BTC-USDT', 'ADA-USD']
}
