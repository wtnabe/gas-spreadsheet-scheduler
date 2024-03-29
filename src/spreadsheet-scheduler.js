/* global createDateUtils */

/**
 * @typedef SpreadsheetRange
 * @type {object}
 * @property {Function} getA1Notation
 * @property {Function} getNumColumns
 * @property {Function} getValues
 */
class SpreadsheetScheduler {
  /** @var {const} */
  get DEFAULT_DATE_COL () {
    return 0
  }

  /**
   * @param {DateUtils} dateutils
   */
  constructor (dateUtils = createDateUtils()) {
    this.dateUtils = dateUtils
  }

  /**
   * range内の日付データが所定の日付になっていたら所定の関数を呼ぶ
   *
   * @param {object} params
   * @param {SpreadsheetRange} params.range
   * @param {Function} [params.executor]
   * @param {Function} [params.selector]
   * @param {number} [params.dateCol]
   * @param {number} [params.skipCol]
   * @param {boolean} [params.batch=false]
   */
  executeWhenMet ({ // eslint-disable-line no-unused-vars
    range,
    executor,
    selector = this.isAppointedDay(),
    dateCol = this.DEFAULT_DATE_COL,
    skipCol = undefined,
    batch = false
  }) {
    if (typeof executor === 'undefined') executor = batch ? this.dumpRange : this.dumpRow
    const selected = this.selectRange({ range, selector, dateCol, skipCol })

    if (batch) {
      return executor.call(this, selected, dateCol, skipCol)
    } else {
      return selected.map(
        /** @param {Array} row */
        (row) => {
          return executor.call(this, row, dateCol, skipCol)
        }
      )
    }
  }

  /**
   * 与えられた range の中から該当する日付の行だけ抽出する
   *
   * 該当するかどうかは selector が判定する
   *
   * @param {object} params
   * @param {SpreadsheetRange} params.range
   * @param {number} [params.dateCol]
   * @param {Function} [params.selector]
   * @param {number} [params.skipCol]
   * @returns {Array<Array>}
   */
  selectRange ({
    range,
    selector = this.isAppointedDay(),
    dateCol = this.DEFAULT_DATE_COL,
    skipCol
  }) {
    if (typeof skipCol !== 'undefined' && skipCol >= range.getNumColumns()) {
      console.warn(`skipCol is ${skipCol}, but over range ${range.getA1Notation()}`)
      skipCol = undefined
    }

    return range.getValues().filter(
      /** @param {Array} row */
      (row) => !this.shouldBeSkipped(row, dateCol, skipCol)
    ).filter(
      /** @param {Array} row */
      (row) => selector(row[dateCol])
    )
  }

  /**
   * Array でできている「行」を skip すべきかどうか
   *
   * 以下は skip される
   * 1. 空行
   * 2. dateCol が Date ではない
   * 3. skipCol が存在しており、中身が空でない
   *
   * @param {Array} row
   * @param {number} dateCol
   * @param {number} skipCol
   * @returns {boolean}
   */
  shouldBeSkipped (row, dateCol, skipCol) {
    const isEmpty = this.emptyRow(row)

    if (isEmpty) return true
    if (!this.isDate(row[dateCol])) return true

    return (typeof skipCol === 'undefined')
      ? false
      : this.skipChecked(row[skipCol])
  }

  /**
   * 与えられた Array が空行かどうか
   *
   * @param {Array} row
   * @returns {boolean}
   */
  emptyRow (row) {
    return row.join('').length === 0
  }

  /**
   * skip 対象かどうかを判定する
   *
   * 1. 中身が空の場合は skip 対象ではない
   * 2. 中身が数値の場合は skip 対象ではない
   * 3. 長さ 0 の文字列の場合は skip 対象ではない
   * 4. その他何か入っていた場合は skip 対象
   *
   * @param {any} col
   * @returns {boolean}
   */
  skipChecked (col) {
    if (typeof col === 'undefined') {
      return false
    } else {
      return typeof col === 'number'
        ? true
        : (typeof col === 'string' && col.length === 0) ? false : true
    }
  }

  /**
   * 与えられたデータが日付かどうか
   *
   * @param {any} col
   * @returns {boolean}
   */
  isDate (col) {
    return col.constructor.name === 'Date'
  }

  /**
   * row のうち dateCol でも skipCol でもないものを返す
   *
   * @param {Array} row
   * @param {number} [dateCol=DEFAULT_DATE_COL]
   * @param {number} [skipCol]
   * @returns {Array}
   */
  restOfRow (row, dateCol = this.DEFAULT_DATE_COL, skipCol) {
    return Array.from(row.keys()).map(
      /**
       * dateCol と skipCol を undefined に変換、それ以外を素通しする
       * @param {number} i
       * @returns {any|undefined}
       */
      (i) => {
        return i === dateCol || i === skipCol
          ? undefined
          : row[i]
      }).filter(
        /**
         * undefined以外を通す
         * @param {any} e
         * @returns {boolean}
         */
        (e) => typeof e !== 'undefined'
      )
  }

  /**
   * 与えられた日付が「本日」と一致するかどうか
   *
   * new Date() の負荷を下げるために「本日」をメモ化しているが、このモジュールの外から与える場合はそこで固定すればメモ化は不要
   *
   * @returns {Function}
   */
  isAppointedDay () {
    const today = this.dateUtils.today()
    /**
     * @param {Date} date
     * @returns {boolean}
     */
    return (date) => {
      return (() => {
        if (date > today) return false
        else if (date < today) return false
        else return true
      })()
    }
  }

  /**
   * row を dateCol とそれ以外（skipCol があればそれも除く）に分けて出力する
   *
   * batch じゃない executor の例
   *
   * @param {Array} row
   * @param {number} dateCol
   * @param {number} skipCol
   * @returns {void}
   */
  dumpRow (row, dateCol, skipCol) {
    const date = row[dateCol]
    const rest = this.restOfRow(row, dateCol, skipCol)

    console.log([date, rest])
  }

  /**
   * 与えられた range の values をそのまま出力する
   *
   * batch executor の例
   *
   * @param {Array} values
   * @param {number} dateCol
   * @param {number} skipCol
   * @returns {void}
   */
  dumpRange (values, dateCol, skipCol) {
    console.log(values)
  }
}

/**
 * @param {DateUtils} dateutils
 * @returns {SpreadsheetScheduler}
 */
function createSpreadsheetScheduler (dateUtils = createDateUtils()) { // eslint-disable-line no-unused-vars
  return new SpreadsheetScheduler(dateUtils)
}

/**
 * range内の日付データが所定の日付になっていたら所定の関数を呼ぶ
 *
 * @param {Object} params
 * @param {SpreadsheetRange} params.range
 * @param {Function} [params.executor]
 * @param {Function} [params.selector]
 * @param {number} [params.dateCol]
 * @param {number} [params.skipCol]
 * @param {boolean} [params.batch=false]
 */
function executeWhenMet (params) { // eslint-disable-line no-unused-vars
  const scheduler = new SpreadsheetScheduler()

  return scheduler.executeWhenMet(params)
}
