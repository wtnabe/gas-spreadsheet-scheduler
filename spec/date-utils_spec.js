/* global describe, it, beforeEach, afterEach */

import assert from 'power-assert'
import sinon from 'sinon'
import gas from 'gas-local'

import { parseDateWithLocalTZ as date } from './support/utils.js'

const app = gas.require('src', {
  console
})

describe('DateUtils', () => {
  let dateUtils

  function today () {
    return date('2023-05-27')
  }

  afterEach(() => {
    sinon.restore()
  })

  describe('week', () => {
    beforeEach(() => {
      dateUtils = app.createDateUtils()
      sinon.stub(dateUtils, 'today').returns(today())
    })

    describe('#thatWeek', () => {
      it('2023-05-05 is the week of 2023-04-30 to 2023-05-06', () => {
        assert.deepEqual(
          dateUtils.thatWeek(date('2023-05-05')),
          [ date('2023-04-30'), date('2023-05-07') ]
        )
      })
    })

    describe('#lastWeek', () => {
      it('return last of last Sunday and last Sunday', () => {
        assert.deepEqual(
          dateUtils.lastWeek(),
          [ date('2023-05-14'), date('2023-05-21') ]
        )
      })
    })

    describe('#thisWeek', () => {
      it('return sunday ( getDay() is 0 ) and next sunday', () => {
        assert.deepEqual(
          dateUtils.thisWeek(),
          [date('2023-05-21'), date('2023-05-28')]
        )
      })
    })

    describe('#nextWeek', () => {
      it('return next sunday and next of next sunday ( even across months )', () => {
        assert.deepEqual(
          dateUtils.nextWeek(),
          [ date('2023-05-28'), date('2023-06-04') ]
        )
      })
    })
  })

  describe('month', () => {
    describe('#thatMonth', () => {
      it('', () => {
        assert.deepEqual(
          dateUtils.thatMonth(date('2023-06-11')),
          [ date('2023-06-01'), date('2023-07-01') ]
        )
      })
    })

    describe('#lastMonth', () => {
      beforeEach(() => {
        sinon.stub(dateUtils, 'today').returns(date('2023-01-15'))
      })
      it('return from 1st day of last month ( even across years )', () => {
        assert.deepEqual(
          dateUtils.lastMonth(),
          [ date('2022-12-01'), date('2023-01-01') ]
        )
      })
    })

    describe('#thisMonth', () => {
      beforeEach(() => {
        sinon.stub(dateUtils, 'today').returns(date('2023-05-27'))
      })
      it('return from 1st day to next 1st day', () => {
        assert.deepEqual(
          dateUtils.thisMonth(),
          [date('2023-05-01'), date('2023-06-01')]
        )
      })
    })

    describe('#nextMonth', () => {
      beforeEach(() => {
        sinon.stub(dateUtils, 'today').returns(date('2023-12-11'))
      })
      it('from next 1st day to next after next 1st day ( even across years )', () => {
        assert.deepEqual(
          dateUtils.nextMonth(),
          [ date('2024-01-01'), date('2024-02-01') ]
        )
      })
    })
  })

  describe('#inDuration', () => {
    describe('#inThisWeek', () => {
      it('2023-05-27 is in this week', () => {
        assert(dateUtils.inThisWeek(dateUtils.today()))
      })
      it('2023-05-28 is not this week', () => {
        assert(dateUtils.inThisWeek(date('2023-05-28')) === false)
      })
    })

    describe('#inThisMonth', () => {
      it('2023-05-27 is in this month', () => {
        assert(dateUtils.inThisMonth(dateUtils.today()))
      })
      it('2023-06-03 is not this month', () => {
        assert(dateUtils.inThisMonth(date('2023-06-03')) === false)
      })
    })
  })
})
