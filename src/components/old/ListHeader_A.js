// import { UpdateTableHeader } from '../../hooks/Firebase';



// export function inputChanged(e, setValue, headerUID, index, companySettings, timer, setTimer) {
export function inputChanged(e, setValue, headerUID, headerIsHidden, companySettings, timer, setTimer) {
  e.stopPropagation();

  const target = e.target
  const headerTitle = target.value
  clearTimeout(timer)

  if (headerUID === '23800') {
    let isnum = /^\d+$/.test(target.value);
    if (isnum || target.value === "") { setValue(target.value) }
  } else {
    setValue(target.value)
  }

  const newTimer = setTimeout(() => {
    // updateTableHeader(target.value, index, settingsUID)

    if (companySettings) {
      // UpdateTableHeader(headerUID, headerTitle, headerIsHidden, companySettings, function(){})
    }
  }, 1000)

  setTimer(newTimer)
}

export function sortChanged(headerUID, setSortSectionUID, sortDirection, setSortDirection, isDisabled) {
  if (!isDisabled) {
    let newSortDirection;

    if (sortDirection === 'down') {
      newSortDirection = 'up'
    } else if (sortDirection === 'up') {
      newSortDirection = 'default'
    } else if (sortDirection === 'default') {
      newSortDirection = 'down';
    }

    setSortDirection(newSortDirection)
    setSortSectionUID(headerUID)
  }
}

export function CalculateSectionWidth(headerUID) {
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

export function IsSectionSortable(headerUID) {
  let sortable = false
  
  switch (headerUID) {
    case '23800' || '72260' || '59737' || '67300' || '32168' || '37498' || '65474' || '14787':
        sortable = false
        break;
    default:
       sortable = true
        break;
  }

  return sortable
}




// export function sortChanged(uid, headerUID, setSortDirection, setSortSelectedTitle, isDisabled, sortDirection) {
//   if (!isDisabled) {
//     let newSortDirection;
//
//     if (sortDirection === 'down') {
//       newSortDirection = 'up'
//     } else if (sortDirection === 'up') {
//       newSortDirection = 'default'
//     } else if (sortDirection === 'default') {
//       newSortDirection = 'down';
//     }
//
//     setSortDirection(newSortDirection)
//     setSortSelectedTitle(headerUID)
//   }
// }