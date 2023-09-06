/**
 * @param {array} columns
 * @param {array} values
 * @return {object}
 */
export class FakeRange {
  constructor (a1Notation, values) {
    this.a1Notation = a1Notation
    this.values = values
  }

  getA1Notation () {
    return this.a1Notation
  }

  getNumColumns () {
    return this.values[0].length
  }

  getValues () {
    return this.values
  }
}
