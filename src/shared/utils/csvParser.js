import Papa from 'papaparse'

export const CsvParser = file => {
  return new Promise(resolve => {
    Papa.parse(file, {
      header: true,
      escapeChar: '"',
      skipEmptyLines: true,
      complete: result => {
        resolve(result.data)
      }
    })
  })
}
