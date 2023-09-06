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
| 2023-05-26 | 一昨日です |  |
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
  const scheduler = SpreadsheetScheduler.createSpreadsheetScheduler()
  const [from, to] = scheduler.lastWeek()

  scheduler.executeWhenMet({
    range: SpreadsheetApp.getActiveSpreadsheet().getRange('Sheet1!A1:B'),
    skipCol: 2,
    selector: (date) => date >= from && date < to,
    executor: tooooLate,
    batch: true
  })
}

function tooooLate (values, dateCol, skipCol) {
  const scheduler = SpreadsheetScheduler.createSpreadsheetScheduler()
  console.log(values.map((row) => {
    return [
      row[dateCol].toLocaleDateString('ja-JP'),
      ...scheduler.restOfRow(row, dateCol, skipCol)
    ].join('\t')
  }).join('\n'))
}
```

#### Result

It's Sunday or later.

```
2023/5/26	一昨日です
```

If there are still rows in Spreadsheet containing dates that correspond to `lastWeek()`, they will be output.

If `skipCol` is specified and this column contains some data, it acts as a completion flag, so in the result above, the "yesterday" row is not output.

### 3. create Trigger for repetitive execution

 * 3-1. Switch tab to [ Triggers ] on left side
 * 3-2. Add Trigger from right bottom button

## Features

 * read Spreadsheet Range, and pick schedules with selector function ( default, it detects the very day )
 * invoke action with executor function
 * skip mark column available ( ex, 「完了」 or "Done" )
 * switch batch mode is true ( executor receive whole range values ) or not ( executor receive row array )

## Options

SpreadsheetScheduler.executeWhenMet() function accept these options.

<dl>
<dt><strong>range</strong> : Range ( required )</dt>
<dd>Google Spreadsheet Range Object. read values </dd>
<dt><strong>executor</strong> : Function ( optional / dumpRow() or dumpRange() )</dt>
<dd></dd>
<dt><strong>selector</strong> : Funtion ( optional / isAppointedDay() )</dt>
<dd></dd>
<dt><strong>dateCol</strong> : Integer ( optional / default 0 )</dt>
<dd></dd>
<dt><strong>skipCol</strong> : Integer ( optional / default `undefined` )</dt>
<dd></dd>
<dt><strong>batch</strong> : Boolean ( optional / default `false` )</dt>
<dd></dd>

### Selector Function

The Selector Function has one argument.

 * date

and should return Boolean. ( used with Array.prototype.filter() )

You can write any function about date determination.

```javascript
  scheduler.executeWhenMet({
    range: SpreadsheetApp.getActiveSpreadsheet().getRange('Sheet1!A1:B'),
    selector: (date) => date >= from && date < to,
    ..
  })
```

### Executor Function

The Executor Function has two modes.

1. row mode ( default )

receives the following arguments

 * row ( Array )
 * dateCol
 * skipCol

The built-in dumpRow() function is the dead simple example.

2. batch mode ( when `batch` options is true )

receives the following arguments

 * values ( Array of Array )
 * dateCol
 * skipCol

The built-in dumpRange() function is the dead simple example, too.
