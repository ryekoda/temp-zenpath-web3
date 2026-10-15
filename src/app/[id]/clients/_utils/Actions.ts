import { v1 } from "uuid";
import { Analytics_Fir } from '@/hooks/Analytics';
import { SaveClient, UpdateClient, DeleteClient } from '@/helpers/database/Clients';
import { GenerateFormData } from '@/lib/forms';
import { ParseDate } from '@/lib/format/dates';
// import { SubscriptionStatus } from '@/lib/billing/plans';
import { toDate } from '@/lib/format/dates';



export function FormData(name: any, data: any, companySettings: any) {
  var info = {
    client: [
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
              value2 = ParseDate(data.dateHired) ?? ''
            }
          } else {
            if (header.type === 'date') {
              value2 = ParseDate(data[header.uid]) ?? ''
            }
          }
        }
    

        var item = { title: header.title, name: header.uid, type: header.type, value: value2, options: header.options, frameType: header.type, isRequired: false }

        if (name === 'create' && (header.uid === '71130' || header.uid === '16538')) {
          item['isRequired'] = true
        }

        if (item.name !== '38543') {
          info.client.push(item)
        }
      }
    }

    const comments: any = { title: 'comments', name: 'comments', type: 'longText', value: data ? data.comments : '', frameType: 'longText', required: false }
    info.client.push(comments)
    const id = { title: '', name: 'uid', type: '', value: data ? data.id : '', frameType: '', isRequired: false }
    info.client.push(id)
  }

  return info
}


// MARK: -- Save
export async function Save(fields: any[], boardUID: string, handleModalClose: any, setIsSubmitButtonDisabled: any, dbURL: string) {
  const employeeUIDIndex = fields.findIndex(((obj: any) => obj.name == 'uid'));
  const itemUID = fields[employeeUIDIndex].value
  fields.splice(employeeUIDIndex, 1);

  let data: any = GenerateFormData(fields)
  setIsSubmitButtonDisabled(true)
    
  if (itemUID) {
    await UpdateClient(itemUID, data, dbURL)
  } else {
    await SaveClient(data, boardUID, dbURL)
    // Analytics_Fir().create_employee()
  }

  setIsSubmitButtonDisabled(false)
  handleModalClose(true)
}


// MARK: -- Delete
export function Delete(itemUID: string, companyUID: string, handleModalClose: any, dbURL: string) {
  deleteClient(itemUID, companyUID, dbURL)
  handleModalClose(true)
}

async function deleteClient(itemUID: string, companyUID: string, dbURL: string) {
  await DeleteClient(itemUID, companyUID, dbURL)
}


export function Reload(setRefreshUID: any) {
     const uid = v1()
     setRefreshUID(uid)
}


// export function LoadMoreItems(items: any, setLastDoc: any, setRefreshUID: any) {
//   setLastDoc(items[items.length - 1].lastDoc)
//   Reload(setRefreshUID)
// }

export async function InputChanged(target: any, fields: any, setFields: any, setAutoCompleteData: any, company: any, setTimer: any, timer: any, isToolTipOpen: any, setIsToolTipOpen: any, isTapEvent: any) {
  const targetName = target.name
  var value = target.value

  setFields(fields.map((field: any) => {
      if (field.name !== targetName) return field
      return {...field, value: value ? value : ''}
  }))
}

export function ErrorMessage(errorCode: number) {
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
