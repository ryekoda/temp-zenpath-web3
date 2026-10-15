// Click handling for List's fallback rows (ListItem), used when a page doesn't pass its own rows.

export function ItemPressed(name, index, sectionIndex, popperTrigger, allPopperTriggers, selectedData, setSelectedData, rawSelectedData, isToolTipOpen, setIsToolTipOpen, querySelectorUID, selectedHeader, setSelectedItem, isDismissed, OpenModal, setIsShowingModel, setModalType, setSelectedEmployeeInfo, setRefreshUID, setCurrentTooltip) {
  let trigger = null

  if (querySelectorUID) {
    trigger = allPopperTriggers.current[index].current[sectionIndex].querySelector("." + querySelectorUID)
  } else {
    trigger = allPopperTriggers.current[index].current[sectionIndex]
  }

  popperTrigger.current = trigger

  if (selectedHeader === 'linkAccount') {
    setIsToolTipOpen(!isToolTipOpen)
    setSelectedData(selectedData)
  } else {
    if (selectedHeader.type === 'dropDown') {
      if (selectedHeader.uid === '71130' || selectedHeader.uid === '95242' || selectedHeader.uid === '46783' || selectedHeader.uid === '38543') {
        OpenModal(rawSelectedData, setIsShowingModel, setModalType, setSelectedEmployeeInfo, setRefreshUID, setIsToolTipOpen)
      } else {
        setIsToolTipOpen(!isToolTipOpen)
        setSelectedData(selectedData)
      }
    } else {
      // Open edit modal
      OpenModal(rawSelectedData, setIsShowingModel, setModalType, setSelectedEmployeeInfo, setRefreshUID, setIsToolTipOpen)
    }
  }

  setCurrentTooltip('list')
  setSelectedItem({ header: selectedHeader, data: selectedData })
}


// Placeholder kept for List's fallback rows; the popover it opened was removed.
export function openPopover(ref, type, selectedData) {}
