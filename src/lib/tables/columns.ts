// Workspace table columns: which show, how wide they are, which can be sorted, dropdown options.

import { CapitalizeFirstLetterOfEachWord } from '@/lib/format/text'



export const HeaderTitles = (companySettings: any, isFiltered: any) => {
  var headers = []

  if (companySettings) {
    if (companySettings.headers.length > 1) {
      for (let i = 0; i < companySettings.headers.length; i++) {
        const header = companySettings.headers[i]

        if (isFiltered) {
          if (!header.isHidden) {
            headers.push(header)
          }
        } else {
          const headerUID = header.uid
          if (headerUID !== '34057' && headerUID !== '10990' && headerUID !== '71130') {
            headers.push(header)
          }

          // headers.push(header)
        }
      }

      headers.sort(function(a, b) {
        return a.indexPosition - b.indexPosition;
      })
    } else {
      headers.push(companySettings.headers[0])
    }
  }

  return headers
}


export function NumberOfHiddenHeaders(companySettings: any) {
  var hiddenHeadersCount = 0

  if (companySettings) {
    const headers = HeaderTitles(companySettings, false)

    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]

      if (header.isHidden) {
        hiddenHeadersCount += 1
      }
    }
  }

  return hiddenHeadersCount
}


// Width of a column in the List tables (planner, employees, clients); px as a string, or a % for report columns.
export function ListColumnWidth(headerUID: any) {
  let width = '20%'

  switch (headerUID) {
    case '34057':
        width = '820'
        break;
    case '45566':
        width = '120'
        break;
    case '44853':
        width = '150'
        break;
    case '10990':
        width = '400'
        break;
    case '27966':
        width = '150'
        break;
    case '92085':
        width = '150'
        break;
    case '71130':
        width = '400'
        break;
    case '95242':
        width = '150'
        break;
    case '67300':
        width = '200'
        break;
    case '97264':
        width = '150'
        break;
    case '32168':
        width = '200'
        break;
    case '16538':
        width = '150'
        break;
    case '46783':
        width = '400'
        break;
    case '55410':
        width = '16%'
        // width = '300'
        break;
    case '61895':
        width = '10%'
        // width = '150'
        break;
    case '37498':
        width = '17%'
        // width = '300'
        break;
    case '70600':
        width = '10%'
        // width = '150'
        break;
    case '65474':
        width = '18%'
        // width = '170'
        break;
    case '14787':
        width = '17%'
        // width = '300'
        break;
    case '75606':
        width = '10%'
        // width = '10%'
        // width = '150'
        break;
    case '94583':
        width = '10%'
        // width = '316'
        break;
    default:
        width = '200'
        break;
}

  return width
}


export function IsLoadMoreAvailable(itemsLength: any) {
  const result = itemsLength === 0 ? false : Number.isInteger(itemsLength / 48)
  return result
}


export function GetDropDownOptions(name: any, options: any, currentFieldData: any, allDrivers: any) {
  let dropDownOptions = []

  if (name === '46783') {
    // employees

    allDrivers.sort(function(a: any, b: any) {
      var textA = a && a['fName'] ? a.fName.toUpperCase() : '';
      var textB = b && b['fName'] ? b.fName.toUpperCase() : '';
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });

    for (let i = 0; i < allDrivers.length; i++) {
      const driver = allDrivers[i]
      const dropDownOption = { value: driver.id, title: CapitalizeFirstLetterOfEachWord(driver.fName + ' ' + driver.lName) }
      dropDownOptions.push(dropDownOption)
    }
  } else {
    if (currentFieldData && currentFieldData['options']) {
      const dropDownOption = currentFieldData.options.dropDown
      dropDownOptions = dropDownOption
    } else {
      dropDownOptions = options.dropDown
    }
  }

  return dropDownOptions
}


// Phone and address columns can't be sorted. (The old switch used `case 'a' || 'b'`, which only
// matched the first uid, so only the employee phone column was actually excluded.)
const UNSORTABLE_COLUMNS = ['23800', '72260', '59737', '67300', '32168', '37498', '65474', '14787']

export function IsColumnSortable(headerUID: string) {
  return !UNSORTABLE_COLUMNS.includes(headerUID)
}
