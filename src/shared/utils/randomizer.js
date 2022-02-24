import { ExchangeType, InstrumentTypes } from '~/shared/constants/exchanges'
import { v4 as uuidv4 } from 'uuid'

export const numberRandomizer = () => {
  return Math.floor(Math.random() * 100)
}

export const decimalRandomizer = () => {
  const precision = 100 // 2 decimals
  return (
    Math.floor(
      Math.random() * (100 * precision - 1 * precision) + 1 * precision
    ) /
    (1 * precision)
  )
}

export const booleanRandomizer = () => {
  // 40% probability of true
  return Math.random() > 0.6
}

export const exchangeRandomizer = () => {
  const exchanges = [ExchangeType.BINANCE, ExchangeType.FTX]
  return exchanges[Math.floor(Math.random() * exchanges.length)]
}

export const instrumentRandomizer = exchange => {
  const instruments = InstrumentTypes[exchange]
  return instruments[Math.floor(Math.random() * instruments.length)]
}

export const generateNewTrading = (count = 5) => {
  const data = []
  for (let i = 0; i < count; i++) {
    const exchange = exchangeRandomizer()
    data.push({
      id: uuidv4(),
      execute: '',
      exchange,
      instrument: instrumentRandomizer(exchange),
      quantity: numberRandomizer(),
      bid: decimalRandomizer(),
      ask: decimalRandomizer()
    })
  }
  return data
}
