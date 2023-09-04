/**
 * namespace for date manipulation
 */
class DateUtils {
  /**
   * return Date with localtime zone without time ( 00:00:00 )
   *
   * @returns {Date}
   */
  today () {
    const d = new Date()
    const today = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0)

    return today
  }

  /**
   * @param {Date} date
   * @returns {Array<Date>}
   */
  thatWeek (date) {
    const dow = date.getDay()

    const from = new Date(date.getTime())
    from.setDate(date.getDate() - dow)
    const to = new Date(date.getTime())
    to.setDate(date.getDate() + (7 - dow))

    return [from, to]
  }

  /**
   * @returns {Array<Date>}
   */
  lastWeek () { // eslint-disable-line no-unused-vars
    const [from, to] = this.thisWeek()

    from.setDate(from.getDate() - 7)
    to.setDate(to.getDate() - 7)

    return [from, to]
  }

  /**
   * from Sunday to Saturday ( next Sunday 00:00:00 )
   *
   * @returns {Array<Date>}
   */
  thisWeek () {
    return this.thatWeek(this.today())
  }

  /**
   * @returns {Array<Date>}
   */
  nextWeek () { // eslint-disable-line no-unused-vars
    const [from, to] = this.thisWeek()

    from.setDate(from.getDate() + 7)
    to.setDate(to.getDate() + 7)

    return [from, to]
  }

  /**
   * from 1st day of month to next 1st day of month includes date
   *
   * @param {Date} date
   * @returns {Array<Date>}
   */
  thatMonth (date) {
    const from = new Date(date.getTime())
    from.setDate(1)
    const to = new Date(date.getTime())
    to.setMonth(to.getMonth() + 1)
    to.setDate(1)

    return [from, to]
  }

  /**
   * @returns {Array<Date>}
   */
  lastMonth () {
    const [from, to] = this.thisMonth()

    from.setMonth(from.getMonth() - 1)
    to.setMonth(to.getMonth() - 1)

    return [from, to]
  }

  /**
   * from 1st day of month to next 1st day of month
   *
   * @returns {Array<Date>}
   */
  thisMonth () {
    const [from, to] = this.thatMonth(this.today())

    return [from, to]
  }

  /**
   * @returns {Array<Date>}
   */
  nextMonth () {
    const [from, to] = this.thisMonth()

    from.setMonth(from.getMonth() + 1)
    to.setMonth(to.getMonth() + 1)

    return [from, to]
  }

  /**
   * from 1st day of month to next 1st day of month
   *
   * @returns {Array<Date>}
   */
  /**
   * @param {Date} date
   * @param {Date} from
   * @param {Date} to
   * @returns {boolean}
   */
  inDuration (date, from, to) {
    return from <= date && date < to
  }

  /**
   * @param {Date} date
   * @returns {boolean}
   */
  inLastWeek (date) {
    const [from, to] = this.lastWeek()

    return this.inDuration(date, from, to)
  }

  /**
   * @param {Date} date
   * @returns {boolean}
   */
  inThisWeek (date) {
    const [from, to] = this.thisWeek()

    return this.inDuration(date, from, to)
  }

  /**
   * @param {Date} date
   * @returns {boolean}
   */
  inNextWeek (date) {
    const [from, to] = this.nextWeek()

    return this.inDuration(date, from, to)
  }

  /**
   * @param {Date} date
   * @returns {boolean}
   */
  inLastMonth (date) {
    const [from, to] = this.lastMonth()

    return this.inDuration(date, from, to)
  }

  /**
   * @param {Date} date
   * @returns {boolean}
   */
  inThisMonth (date) {
    const [from, to] = this.thisMonth()

    return this.inDuration(date, from, to)
  }

  /**
   * @param {Date} date
   * @returns {boolean}
   */
  inNextMonth (date) {
    const [from, to] = this.nextMonth()

    return this.inDuration(date, from, to)
  }
}

/**
 * @returns {DateUtils}
 */
function createDateUtils () { // eslint-disable-line no-unused-vars
  return new DateUtils()
}
