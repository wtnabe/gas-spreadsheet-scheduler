/**
 * Date of (Spreadsheet + GAS) is interpreted with local time
 *
 * @param {string} dateString YYYY-MM-DD
 * @returns {Date}
 */
export function parseDateWithLocalTZ (dateString) {
  const d = new Date(dateString)

  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/**
 * see https://zenn.dev/lollipop_onl/articles/eoz-judge-js-invalid-date
 *
 * SpreadsheetはセルごとにDateかStringかなど判定した結果の値を返すので
 * 雑に getValues() すると Date か Date 以外かはお任せで処理してくれる
 *
 * GAS 環境でなく手元でデータを準備する場合、new Date('あああ') として
 * もそれは Invalid Date な Date であって、これはエラーも起きないし、
 * そのままでは判別できないので、このようなfunctionが必要
 *
 * @param {Date} date
 * @returns {boolean}
 */
export function isInvalidDate (date) {
  return Number.isNaN(date.getTime())
}

/**
 * @param {object} data
 * @returns {object}
 */
export function loadValues (data) {
  return data.map((row) => {
    const d = parseDateWithLocalTZ(Date.parse(row[0]))

    if (!isInvalidDate(d)) { row[0] = d }

    return row
  })
}
