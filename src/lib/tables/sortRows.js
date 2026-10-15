export default function SortListData(data, sortColumnUID, sortDirection) {
    const theSortColumnUID = sortColumnUID.toLowerCase().replace(/\s/g, '')
    var code = ''
  
    if (theSortColumnUID === '34057' || theSortColumnUID === '10990' || theSortColumnUID === '71130') {
      code = 'lName'
    } else {
      code = theSortColumnUID
    }
  
    const sortedData = theSortColumnUID ? [...data].sort(newDataSetNew(code, sortDirection)) : data
    return sortedData
  }
  
  function CheckColumnUID(item, sortColumnUID) {
    if (item[sortColumnUID]) {
      return sortColumnUID
    } else {
      // old data
      var newSortUID = ''
  
      if (sortColumnUID === '45566') {
        newSortUID = 'position'
      } else if (sortColumnUID === '44853') {
        newSortUID = 'dateHired'
      } else if (sortColumnUID === '27966') {
        newSortUID = 'dob'
      } else if (sortColumnUID === '92085') {
        newSortUID = 'disability'
      } else if (sortColumnUID === '95242' || sortColumnUID === '70600') {
        // Trip Type
        if (sortColumnUID === '70600') {
          // ref
          newSortUID = '95242'
        } else {
          newSortUID = 'type'
        }
      } else if (sortColumnUID === '97264') {
        // Trip Pickup Time
  
        if (item[sortColumnUID]) {
          newSortUID = sortColumnUID
        } else {
          return 'pickupTime'
        }
  
  
        // if (sortColumnUID === '61895') {
        //   // ref
        //   if (!item[sortColumnUID]) {
        //     newSortUID = 'pickupTime'
        //   } else {
        //     newSortUID = '97264'
        //   }
        //
        //   // newSortUID = '97264'
        // } else {
        //   newSortUID = 'pickupTime'
        // }
      } else if (sortColumnUID === '61895') {
        // reports trip time
        if (item['97264']) {
          newSortUID = '97264'
        } else {
          return 'pickupTime'
        }
      } else if (sortColumnUID === '16538') {
        newSortUID = 'pickupDate'
      } else {
        newSortUID = 'lName'
      }
  
      return newSortUID
    }
  }
  
  function newDataSetNew(sortColumnUID, sortDirection) {
    const sortTypesNew = {
      up: {
        class: 'sort-up',
        title: (a, b) => a[CheckColumnUID(a, sortColumnUID)] > b[CheckColumnUID(b, sortColumnUID)] ? 1 : -1
      },
      down: {
        class: 'sort-down',
        title: (a, b) => a[CheckColumnUID(a, sortColumnUID)] < b[CheckColumnUID(b, sortColumnUID)] ? 1 : -1
      },
      default: {
        class: 'sort',
        title: (a, b) => a[CheckColumnUID(a, sortColumnUID)] > b[CheckColumnUID(b, sortColumnUID)] ? 1 : -1
      }
    }
  
    return sortTypesNew[sortDirection].title
  }