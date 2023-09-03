/* global describe, it, before */

import assert from 'power-assert'
import sinon from 'sinon'
import gas from 'gas-local'
import { addDays } from 'date-fns'

import { FakeRange } from './support/fakeRange.js'
import { parseDateWithLocalTZ, loadValues } from './support/utils.js'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const app = gas.require('src', {
  console
})

const values = loadValues(require('./support/example-values.json'))

describe('SpreadsheetScheduler', () => {
  let range, scheduler

  function today () {
    return parseDateWithLocalTZ('2023-05-27')
  }

  function thruRow (row, dateCol, skipCol) {
    return row
  }

  function execWithThruRowExector (selector = undefined) {
    return scheduler.executeWhenMet({
      range,
      selector,
      executor: thruRow
    })
  }

  before(() => {
    range = new FakeRange('A1:C', values)
    scheduler = app.createSpreadsheetScheduler()
    sinon.stub(scheduler, 'today').returns(today())
  })

  describe('#executeWhenMet', () => {
    describe('default selector', () => {
      it('the day', () => {
        assert.deepEqual(
          execWithThruRowExector(),
          [ [today(), '当日です', ''] ]
        )
      })
    })
    describe('custom selector', () => {
      it('only future', () => {
        assert.deepEqual(
          execWithThruRowExector((date) => date > today()),
          [ [ parseDateWithLocalTZ('2023-06-01'), '4日後です', '' ] ]
        )
      })
      it('yesterday and today only', () => {
        assert.deepEqual(
          execWithThruRowExector((date) => {
            return addDays(today(), -1) <= date && date < addDays(today(), 1)
          }),
          [
            [parseDateWithLocalTZ('2023-05-26'), '昨日です', ''],
            [parseDateWithLocalTZ('2023-05-27'), '当日です', '']
          ]
        )
      })
    })
  })
})
