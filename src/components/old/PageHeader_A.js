import { HeaderTitles } from '@/lib/GlobalFunctions';
import { Analytics_Fir } from '@/hooks/Analytics'



export function SearchButtonPressed(e, setCurrentActiveControlItem) {
  setCurrentActiveControlItem('search')
}

export function InviteMembersButtonPressed(e, headerOptionPressed, setIsToolTipOpen) {
  headerOptionPressed('inviteMembers', null)
  setIsToolTipOpen(false)
}

export function FeedbackButtonPressed(e, headerOptionPressed, setIsToolTipOpen) {
  headerOptionPressed('feedback', null)
  setIsToolTipOpen(false)
}

export function NumberOfHiddenHeaders(companySettings) {
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

export function PrintButtonPressed() {
  // Analytics_Fir().print_schedule()
  window.print()
}

export function HandleCheckboxChange(event, value, checkboxes, setCheckboxes, filterPressed) {
  const target = event.target
  var allItems = []

  checkboxes.map(function (checkbox) {
    const headerUID = checkbox.uid
    const headerTitle = checkbox.title
    const headerIsHidden = checkbox.isHidden
    var newBox = null

    // if (headerTitle === target.name) {
    if (headerUID === value) {
      newBox = { uid: headerUID, title: headerTitle, isHidden: !headerIsHidden }
      filterPressed('columnVisibility', newBox)
    } else {
      newBox = { uid: headerUID, title: headerTitle, isHidden: headerIsHidden }
    }

    allItems.push(newBox)
  });

  setCheckboxes(allItems)
};

export function GetSortedDrivers(drivers) {
  drivers.sort(function(a, b) {
      var textA = a && a['fName'] ? a.fName.toUpperCase() : '';
      var textB = b && b['fName'] ? b.fName.toUpperCase() : '';
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });

  return drivers
}
