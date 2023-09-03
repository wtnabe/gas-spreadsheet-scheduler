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
    const day = this.today()
    const dow = day.getDay()

    const from = new Date(day.getTime())
    from.setDate(day.getDate() - dow)
    const to = new Date(day.getTime())
    to.setDate(day.getDate() + (7 - dow))

    return [from, to]
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
}

/**
 * @returns {DateUtils}
 */
function createDateUtils () { // eslint-disable-line no-unused-vars
  return new DateUtils()
}
