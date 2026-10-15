import { AssignActiveMember, UnAssignActiveMember, UpdateEmployee, UpdateClient, UpdateTableHeaderOptions } from '../../hooks/Firebase';



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

export function HeaderItemPressed(name, i, data, popperTrigger, popperHeaderTriggers, isToolTipOpen, setIsToolTipOpen, setCurrentTooltip, setSelectedItem) {
  popperTrigger.current = popperHeaderTriggers.current[i]

  setIsToolTipOpen(!isToolTipOpen)
  setCurrentTooltip('list')
  setSelectedItem({ header: name, data: data })
}

export function ActiveMembers(members, allEmployees, selectedData) {
    let unusedMembers = []
    let usedMember = null
   
    for (let i = 0; i < members.length; i++) {
      const member = members[i]
      const memberUID = member.userUID

      if (allEmployees.filter(function(e) { return e['userUID'] === memberUID; }).length > 0) {

        if (selectedData && selectedData['userUID'] === memberUID) {
          usedMember = member
        }
      } else {
        // check if already saved
  
        if (unusedMembers.filter(function(e) { return e['userUID'] === memberUID; }).length > 0) {
   
        } else {
          if (member['userUID']) {
            unusedMembers.push(member)
          }
        }
      }
    }

    return { used: usedMember, unUsed: unusedMembers }
  }

  export function AccountTapped(item, selectedData, reloadData, setCurrentActiveControlItem) {
    const employeeUID = selectedData.id
    const assignedUserUID = item['userUID']
  
    AssignActiveMember(employeeUID, assignedUserUID, function() {
      reloadData()
      setCurrentActiveControlItem(null)
    })
  }
  
  export function UnassignAccount(selectedData, reloadData, setCurrentActiveControlItem) {
    const employeeUID = selectedData.id
  
    UnAssignActiveMember(employeeUID, function() {
      reloadData()
      setCurrentActiveControlItem(null)
    })
  }

    export function openPopover(ref, type, selectedData) {
//     //   // setSelectedData(selectedData)
//     //   // setReferenceElement(ref.current)
//     //   setCurrentActiveControlItem(currentActiveControlItem === type ? null : type)
    }
  
//     function closePopover() { setCurrentActiveControlItem(null) }


export function UpdateBoardItem(item, boardUID, selectedHeader, setIsToolTipOpen, reloadData) {
  let data = selectedHeader.data
  data[selectedHeader.header.uid] = item

  if (data.id) {
    const docUID = data.id
    const headerUID = selectedHeader.header.uid

    if (data['34057']) {
      // employees
      UpdateEmployee(docUID, headerUID, item, function(error) {
        if (error === null) {
          setIsToolTipOpen(false)
          reloadData()
        } else {
          console.log("error: ", error.message);
        }
      })
    } else if (data['10990']) {
      // clients
      UpdateClient(docUID, headerUID, item, function(error) {
        if (error === null) {
          setIsToolTipOpen(false)
          reloadData()
        } else {
          console.log("error: ", error.message);
        }
      })
    } else if (data['71130']) {
      // reports: fix
      setIsToolTipOpen(false)
      reloadData()
    } else {
      setIsToolTipOpen(false)
      reloadData()
    }
 
  } else {
    setIsToolTipOpen(false)
    reloadData()
  }
}

export function UpdateHeaderItem(value, selectedItem, companySettings, reload) {
  const allHeaders = companySettings.headers
  const selectedHeader = selectedItem.header
  const selectedHeaderUID = selectedHeader.uid

  for (let i = 0; i < allHeaders.length; i++) {
    const header = allHeaders[i]

    if (header.uid === selectedHeaderUID) {
      if (header.type === 'dropDown') {
        const options = header.options
        var randomValue = Math.floor(1000 + Math.random() * 9000);
        options.dropDown.push({ title: value.toLowerCase(), value: value.toLowerCase() + randomValue }) 
      }
    }
  }

  UpdateTableHeaderOptions(allHeaders, companySettings, function() {
    reload()
  })
}

export function RemoveHeaderItem(value, selectedItem, companySettings, reload) {
  const allHeaders = companySettings.headers
  const selectedHeader = selectedItem.header
  const selectedHeaderUID = selectedHeader.uid

  for (let i = 0; i < allHeaders.length; i++) {
    const header = allHeaders[i]

    if (header.uid === selectedHeaderUID) {
      if (header.type === 'dropDown') {
        const options = header.options

        for (let i = 0; i < options.dropDown.length; i++) {
          let option = options.dropDown[i]

          if (option.value === value) {
            options.dropDown.splice(i, 1)
          }
        }
      }
    }
  }

  UpdateTableHeaderOptions(allHeaders, companySettings, function() {
    reload()
  })
}

export function IsHeaderItemUsed(value, listData, selectedItem) {
  const items = listData
  const headerUID = selectedItem.header.uid

  for (let i = 0; i < items.length; i++) {
    const item = items[i][headerUID]

    if (item === value) {
      return true
    }

    if (i === (items.length - 1)) {
      return false
    }
  }
}

export function InputChanged(e, setValue, oldItemValue, selectedItem, companySettings, timer, setTimer) {
  e.stopPropagation();

  const target = e.target
  const newValue = target.value
  const headerUID = selectedItem.header.uid
  const allHeaders = companySettings.headers
  clearTimeout(timer)

  setValue(newValue)

  const newTimer = setTimeout(() => {
  
    for (let i = 0; i < allHeaders.length; i++) {
      const header = allHeaders[i]

      if (header.uid === headerUID) {
        if (header.type === 'dropDown') {
          const options = header.options

          for (let i = 0; i < options.dropDown.length; i++) {
            let option = options.dropDown[i]
  
            if (option.value === oldItemValue) {
              // option.value = newValue
              option.title = newValue
            }
          }
        }
      }
    }

      UpdateTableHeaderOptions(allHeaders, companySettings, function() {
        // console.log('updated...');
        // Change all cells with old value :: Set cell with ID
      })
  }, 1000)

  setTimer(newTimer)
}

// export function TooltipOptions() {
//   let options = { name: '', position: '' }

//   setCurrentTooltip('list')
//   setSelectedItem({ header: 'dropDown', data: null })
//   return options
// }
