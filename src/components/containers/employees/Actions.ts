import { v1 } from "uuid";
import { SaveEmployee, UpdateEmployee, DeleteEmployee } from '@/helpers/database/Employees';
import { Analytics_Fir } from '@/hooks/Analytics';
import { SubscriptionStatus, toDate } from '@/lib/GlobalFunctions';
import { GenerateFormData } from "@/lib/Utils";



export function FormData(name: any, data: any, companySettings: any) {
  var info = {
    employee: [
      { title: 'first name', name: 'fName', type: 'text', value: data ? data['fName'] : '', frameType: 'text', isRequired: true }, 
      { title: 'last name', name: 'lName', type: 'text', value: data ? data['lName'] : '', frameType: 'text', isRequired: true }
    ]
  }
  
  if (companySettings) {
    for (let i = 0; i < companySettings.headers.length; i++) {
      const header = companySettings.headers[i]
      
      if (header.title.toLowerCase() !== 'name') {
        var value2 = data ? data[header.uid] : ''
    
        if (name === 'edit') {
          if (!value2) {
            if (i === 1) {
              value2 = data.position
            } else if (i === 2) {
              value2 = data.phone
            } else if (i === 3) {
              value2 = data.dateHired ? new Date(data.dateHired) : ''
            }
          } else {
            if (header.type === 'date') {
              // console.log('ASDF::: ', data[header.uid]);
              
              // const utc = new Date(data[header.uid]);
              // const local = UTCTimeToLocalTime(utc)
              // value2 = local
              value2 = new Date(data[header.uid])
            }
          }
        }
    
        var item = { title: header.title, name: header.uid, type: header.type, value: value2, options: header.options, frameType: header.type, isRequired: false }

        if (name === 'create' && (header.uid === '71130' || header.uid === '16538')) {
          item['isRequired'] = true
        }

        if (item.name !== '38543') {
          info.employee.push(item)
        }
      }
    }

    const comments: any = { title: 'comments', name: 'comments', type: 'longText', value: data ? data.comments : '', frameType: 'longText', required: false }
    info.employee.push(comments)
    const id = { title: '', name: 'uid', type: '', value: data ? data.id : '', frameType: '', isRequired: false }
    info.employee.push(id)
  }

  return info
}


// MARK: -- Save
export function Save(fields: any[], boardUID: string, handleModalClose: any, setIsSubmitButtonDisabled: any, dbURL: string) {
  const employeeUIDIndex = fields.findIndex(((obj: any) => obj.name == 'uid'));
  const itemUID = fields[employeeUIDIndex].value
  fields.splice(employeeUIDIndex, 1);

  let data: any = GenerateFormData(fields)
  saveEmployee(itemUID, data, boardUID, handleModalClose, setIsSubmitButtonDisabled, dbURL)
}

async function saveEmployee(itemUID: string, item: any, boardUID: string, handleModalClose: any, setIsSubmitButtonDisabled: any, dbURL: string) {
  setIsSubmitButtonDisabled(true)

  if (itemUID) {
    await UpdateEmployee(itemUID, dbURL, null, null, item)
  } else {
    await SaveEmployee(item, boardUID, dbURL)
    // Analytics_Fir().create_employee()
  }

  setIsSubmitButtonDisabled(false)
  handleModalClose(true)
}


// MARK: -- Delete
export function Delete(itemUID: string, handleModalClose: any, dbURL: string) {
  deleteEmployee(itemUID, handleModalClose, dbURL)
  handleModalClose(true)
}

async function deleteEmployee(itemUID: string, handleModalClose: any, dbURL: string) {
  await DeleteEmployee(itemUID, dbURL)
}
























export function Reload(setRefreshUID: any) {
     const uid = v1()
     setRefreshUID(uid)
}


export function LoadMoreItems(items: any, setLastDoc: any) {
    setLastDoc(items[items.length - 1].lastDoc)
}


export function PageHeaderOptionPressed(name: any, companySettings: any, header: any, setModalType: any, setIsShowingModel: any, setRefreshUID: any) {
  if (name === 'inviteMembers') {
    setModalType('invite_Member')
    setIsShowingModel(true)
  } else if (name === 'feedback') {
    setModalType('feedback')
    setIsShowingModel(true)
  } else {
    if (companySettings) {
      const headerUID = header.uid
      const headerTitle = header.title
      const headerIsHidden = header.isHidden

      // UpdateTableHeader(headerUID, headerTitle, headerIsHidden, companySettings, function() {
      //   Reload(setRefreshUID)
      // })
    }
  }
}


export function ListColumnTapped(name: any, type: any, data: any, companySettings: any, setIsToolTipOpen: any, reload: any) {
  if (name === 'headerOptions') {
    if (type === 'delete') {
      let headers = companySettings.headers
      let newIndex = 0
      for (let i = 0; i < headers.length; i++) {
        const header = headers[i]

        if (header.uid === data) {
          headers.splice(i, 1)
        }
      }

      for (let i = 0; i < headers.length; i++) {
        const header = headers[i]
        header.indexPosition = header.indexPosition === i ? header.indexPosition : header.indexPosition === i - 1 ? i - 1 : i
      }
      
      // UpdateTableHeaderOptions(headers, companySettings, function() {
      //   setIsToolTipOpen(false)
      //   reload()
      // })
    }
  } else if (name === 'addColumn') {
    if (type === 'text') {
      let headers = companySettings.headers
      var rand = Math.floor(10000 + Math.random() * 90000);
      let newHeader = { title: type, isHidden: false, uid: rand, type: type, indexPosition:  headers.length }
    
    
      headers.push(newHeader)
      // UpdateTableHeaderOptions(headers, companySettings, function() {
      //   setIsToolTipOpen(false)
      //   reload()
      // })
    }
  }
}


export function GetOnlineStatus(userUID: any, callback: any) {
  let isOnline = false

  // GetUserDocInfo(userUID, function(userInfo) {
  //   // const userData = userInfo

  //   if (userInfo) {
  //     let lastActiveAt = userInfo['lastActiveAt']
  //     const userUID = userInfo.id

  //     var today = new Date();

  //     if (lastActiveAt) {
  //       var diffMs = (today - lastActiveAt.toDate());
  //       var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

  //       if (diffMins < 3) {
  //         isOnline = true
  //       }
  //     }
  //   }

  //   callback(isOnline)
  // })

  callback(isOnline)
}


export function ErrorMessage(errorCode: any) {
  var info = { message: '' }

  switch(errorCode) {
    case 1:
      info['message'] = 'Please enter a valid email address'
      break;
    case 3:
      info['message'] = 'Password is incorrect. Please enter correct password'
      break;
    case 4:
      info['message'] = 'Password is incorrect. Please try again'
      break;
    case 5:
      info['message'] = 'No user found with this email in our database'
      break;
    default:
      info['message'] = ''
      break;
  }

  return info
}


export async function InputChanged(target: any, fields: any, setFields: any, setAutoCompleteData: any, company: any, setTimer: any, timer: any, isToolTipOpen: any, setIsToolTipOpen: any, isTapEvent: any) {
  const targetName = target.name
  var value = target.value

  setFields(fields.map((field: any) => {
      if (field.name !== targetName) return field
      return {...field, value: value ? value : ''}
  }))

  // autocomplete
  if (targetName === '71130') {
    if (isTapEvent) {
      setIsToolTipOpen(false)
    } else {
      OpenAutocompleteDropDown(targetName, value, setAutoCompleteData, company, setTimer, timer, isToolTipOpen, setIsToolTipOpen)
    }
  }
}


function OpenAutocompleteDropDown(name: any, value: any, setAutoCompleteData: any, company: any, setTimer: any, timer: any, isToolTipOpen: any, setIsToolTipOpen: any) {
  clearTimeout(timer)

  const newTimer = setTimeout(() => {

    if (name === '71130') {
      setAutoCompleteData([])

      searchItems(company.id, 'clients', value, function(items: any) {
  
        if (!value) {
          setIsToolTipOpen(false)
        } else {
   
          if (!isToolTipOpen) {
            if (items && items.length > 0) {

              setIsToolTipOpen(true)
              // setCurrentTooltip('modal_AutocompleteInput')
            }
          } 
        }

        setAutoCompleteData(items)
      })
    }
  }, 300)

  setTimer(newTimer)
}


export function searchItems(boardUID: any, category: any, value: any, callback: any) {
  if (value) {

    // SearchItems(boardUID, category, value, function(items, error) {
    //   callback(items)
    // })
  } else {
    callback([])
  }
}


export function ItemPressed2(name: any, data: any, setModalName: any, setIsShowingModal: any, setSelectedEmployeeInfo: any, setRefreshUID: any, setIsToolTipOpen: any) {
  setSelectedEmployeeInfo(null)
  setModalName(name)
  setIsShowingModal(true)
  setIsToolTipOpen(false)

  if (name === 'create') {
    
  } else if (name === 'edit') {
    const { info, selectedHeader, item } = data
    setSelectedEmployeeInfo(item)
    // const { data, index, sectionIndex, item, querySelectorUID, selectedHeader } = data

    if (selectedHeader === 'linkAccount') {
      // setSelectedData(selectedData)
    } else {
      if (selectedHeader.type === 'dropDown') {
        if (selectedHeader.uid === '71130' || selectedHeader.uid === '95242' || selectedHeader.uid === '46783' || selectedHeader.uid === '38543') {

          // setSelectedTripInfo(item)
          // OpenModal(rawSelectedData, setIsShowingModel, setModalType, setSelectedEmployeeInfo, setRefreshUID, setIsToolTipOpen)
        } else {
          // setSelectedData(selectedData)
        }
      } else {
        // Open edit modal
        // OpenModal(rawSelectedData, setIsShowingModel, setModalType, setSelectedEmployeeInfo, setRefreshUID, setIsToolTipOpen)
      }
    }
  } else {
    // setModalName('create')
  }
}
