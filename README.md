# SpreadsheetScheduler for Google Apps Script

Let you create schedule table on Spreadsheet with Google Apps Script Project ( Sheets Container-boiund script )

## Prerequisite

Sheets Container-bound script Project

## How to use

### 1. Open Spreadsheet and prepare schedule like below

| A | B | C |
| --- | --- | --- |
| 2023-06-01 | 4日後です |  |
| 日付じゃない |  |  |
| 2023-05-27 | 昨日です | ✔️ |
| 2023-05-28 | 当日です |  |

### 2. Open menu [ Extensions ] -> [ Apps Script ]

#### 2-1. Add Library code

Choose one of them please.

 1. add Project ID for you project as Library `1lfmVVWxHmyXqfR8pnFJlDY2P_ys-w96HCZSsoTcGvgQU0AQ9JncLO5w0`
 2. Copy and Paste this code

I would recommend #2 for speed of execution, but #1 is also a good option for administrative costs.

#### 2-2. Prepare code like below

```javascript
function WarnIfSchedulesRemain() {
  const [from, to] = SpreadsheetScheduler.lastWeek()

  SpreadsheetScheduler.executeWhenMet({
    range: SpreadsheetApp.getActiveSpreadsheet().getRange('Sheet1!A1:B'),
    skipCol: 2,
    selector: (date) => date >= from && date < to,
    executor: tooooLate,
    batch: true
  })
}

function tooooLate (values, dateCol, skipCol) {
  console.log(values.map((row) => {
    return [
      row[dateCol].toLocaleDateString('ja-JP'),
      ...SpreadsheetScheduler.restOfRow(row, dateCol, skipCol)
    ].join('\t')
  }).join('\n'))
}
```

### 3. create Trigger for reptitive execution

 * 3-1. Switch tab to [ Triggers ] on left side
 * 3-2. Add Trigger from right bottom button

## Features

 * read Spreadsheet Range, and pick schedules with selector function ( default, it detects the very day )
 * invoke action with executor function
 * skip mark column available ( ex, 「完了」 or "Done" )
 * switch batch mode is true ( executor receive whole range values ) or not ( executor receive row array )
