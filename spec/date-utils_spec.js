/* global describe, it, before */

import assert from 'power-assert'
import sinon from 'sinon'
import gas from 'gas-local'
import { addDays } from 'date-fns'

import { parseDateWithLocalTZ } from './support/utils.js'

const app = gas.require('src', {
  console
})

describe('DateUtils', () => {
  let dateUtils

  function today () {
    return parseDateWithLocalTZ('2023-05-27')
  }

  before(() => {
    dateUtils = app.createDateUtils()
    sinon.stub(dateUtils, 'today').returns(today())
  })

  describe('#thisWeek', () => {
    it('return sunday ( getDay() is 0 ) and next sunday', () => {
      assert.deepEqual(
        dateUtils.thisWeek(),
        [parseDateWithLocalTZ('2023-05-21'), parseDateWithLocalTZ('2023-05-28')]
      )
    })
  })
})
