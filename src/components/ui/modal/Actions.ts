import { v1 } from "uuid";
import { UpdateCompany, GetCompany } from '@/helpers/database/Companies';
import { GetUser } from '@/helpers/database/UserProfiles';
import { SaveNotification, UpdateNotification, GetNotifications } from '@/helpers/database/Notifications';
import { GetEmployees, UpdateEmployee } from '@/helpers/database/Employees';
import { SendInviteEmail } from '@/helpers/sendInBlue/SendInBlue';
// import { InviteMember, RemoveMemberInvite, UpdateBoardSubscriptionInfo, SaveImportedTrips, DeleteBoard } from '@/hooks/Firebase';
// import { Analytics_Fir } from '../../hooks/Analytics.js';
import { GetSubscriptionPlanInfo, ConvertTime12to24, GetMonths } from '@/lib/GlobalFunctions';



export function GetTitles(name: string) {
    const titles: any = {
      create_Company: { title: 'create board' },
      create_Employee: { title: 'create employee' },
      edit_Employee: { title: 'employee' },
      create_Client: { title: 'create client' },
      edit_Client: { title: 'client' },
      create_Trip: { title: 'create trip' },
      edit_Trip: { title: 'trip' },
      invite: { title: 'Board Members' },
      feedback: { title: 'Give Feedback' },
      select_Position: { title: 'select position' },
      change_driver: { title: 'select trip' },
      cancelTrip: { title: 'cancel trip' },
      pricing: { title: 'pricing' },
      billing: { title: 'billing and teams' },
      deleteBoard: { title: 'delete board' },
      manageSeats: { title: 'Change number of seats' },
      cancelSubscription: { title: 'cancel subscription' },
      importData: { title: 'import data' },
      firstTripScheduledTaskAward: { title: 'Task Complete' },
      others: { title: '' }
    }
  
    return titles[name] ? titles[name] : titles.others
}


export function HandleEmailInviteChange(e: any, setValue: any, setErrorMessage: any) {
  const target = e.target
  setValue(target.value);
  setErrorMessage('')
};


export function ChangeInviteType(e: any, setInviteType: any) {
  const target = e.target
  setInviteType(target.value)
}


export async function Invite(email: string, type: string, company: any, currentUser: any, setErrorMessage: any, dbURL: string, setValue: any, setRefreshUID: any) {
  const { id, admins, members, drivers, pendingInvites } = company
  const subscriptionPlan = GetSubscriptionPlanInfo(company)
  const availableSeats = subscriptionPlan ? subscriptionPlan.seats : 2

  if (members.length >= availableSeats) {
    setErrorMessage('You have reached the limit of 2 members...Please upgrade membership to add more team members')
  } else { 
    const isAdmin = admins.some((element: any) => {
      if (element === currentUser.id) {
        return true;
      }
  
      return false;
    });

    if (type === 'admin') {
      if (isAdmin) {
        await StartInvite() // success
      } else {
        setErrorMessage('Oops...Only an admin can invite another admin')
      }
    } else {
      await StartInvite()
    }
  }


  async function StartInvite() {        
    if (pendingInvites && pendingInvites.find((o: any) => o.email === email)) {
      console.log('already invited...resend invite: ', email);
    } else {      
      const userInfo = await GetUser(dbURL, null, null, email, null).catch((err) => console.log('user error: ', err));
  
      if (userInfo) {
        const userUID = userInfo.id
        const allRoles = {
          admins: admins ? admins : [],
          members: members ? members : [],
          drivers: drivers ? drivers : []
        }
        if (!allRoles.admins.includes(userUID) && !allRoles.members.includes(userUID) && (!allRoles.drivers.includes(userUID))) {
          SavePendingInvition()
        }
      } else {
        SavePendingInvition() // not a zenpath user
      }
    }
  }

  async function SavePendingInvition() {
    let pendingMembers = pendingInvites ? pendingInvites : []
    const invitation = { email: email, type: type }
    pendingMembers.push(invitation)

    await UpdateCompany(id, 'pendingInvites', pendingMembers, dbURL).catch((err) => console.log('company error: ', err));
    await SaveNotification(id, email, currentUser.id, 'invite', dbURL).catch((err) => console.log('notification error: ', err));

    const currentUserFullName = currentUser['fName'] + ' ' + currentUser['lName']
    const companyTitle = company['title']

    await SendInviteEmail(email, currentUserFullName, companyTitle)
    setValue('')
    Reload(setRefreshUID)
  }
}


export function RemoveInvite(member: any, company: any, dbURL: string, setRefreshUID: any) {
  const { role, userUID, email, status } = member
  const { id, admins, members, drivers, pendingInvites } = company

  if (role !== 'admin' && admins.length >= 1) {
    RevokeInvition()
  }

  async function RevokeInvition() {    
    const notifications = await GetNotifications(email, 'invite', company.id, true, dbURL).catch((err) => console.log('notification error: ', err));
    const notification = notifications && notifications[0]
    if (notification) {
      const keyValues = [{ 'isPublic': false }]
      await UpdateNotification(notification.id, keyValues, dbURL).catch((err) => console.log('notification update error: ', err));
    }
    
    const memberUID = userUID
    if (memberUID) {
      let allMembers = []
      let key = ''
      if (admins.includes(memberUID)) {
        key = 'admins'
        allMembers = admins
        const index = allMembers.indexOf(memberUID);
        allMembers.splice(index, 1);
      } else if (drivers.includes(memberUID)) {
        key = 'drivers'
        allMembers = drivers
        const index = allMembers.indexOf(memberUID);
        allMembers.splice(index, 1);
      } else if (members.includes(memberUID)) {
        key = 'members'
        allMembers = members
        const index = allMembers.indexOf(memberUID);
        allMembers.splice(index, 1);
      }

      if (key) {        
        await UpdateCompany(id, key, allMembers, dbURL).catch((err) => console.log('company error: ', err));
        const employees = await GetEmployees(id, dbURL, null, memberUID).catch((err) => console.log('employees error: ', err));     
        const employee = employees.length > 0 && employees[0]
        if (employee) {
          const employeeUID = employee.id
          await UpdateEmployee(employeeUID, dbURL, 'userUID', '')
          // b3AQ5KCMqdqPer4Xbpfx --- driver
        }
      }
    } else {
      const inviteInfo = pendingInvites.filter(function(el: any) { return el.email != email });
      await UpdateCompany(id, 'pendingInvites', inviteInfo, dbURL).catch((err) => console.log('company error: ', err));
    }

    Reload(setRefreshUID)
  }
}


function Reload(setRefreshUID: any) {
  const uid = v1()
  setRefreshUID(uid)
}



// export function HandleChange(e: any, newValue: any, setValue: any) {
//     setValue(newValue);
//   };
  

  
  // export function InviteRemoveButtonPressed(userUID: any, email: any, boardUID: any, memberStatus: any, allActiveRoles: any, setRefreshUID: any) {
  //   let admins = []
  
  //   for (let i = 0; i < allActiveRoles.length; i++) {
  //     const activeRole = allActiveRoles[i]
  
  //     if (activeRole['role'] === 'admin') {
  //       admins.push(activeRole)
  //     }
  //   }
  
  //   if (admins.length > 1) {
  //     RemoveMemberInvite(boardUID, userUID, email, function() {
  //       Reload(setRefreshUID)
  //     })
  //   } else {
  //     const isFound = admins.some(element => {
  //       if (element.userUID === userUID) {
  //         return true;
  //       }
    
  //       return false;
  //     });
  
  //     if (!isFound) {
  //       RemoveMemberInvite(boardUID, userUID, email, function() {
  //         Reload(setRefreshUID)
  //       })
  //     } else {
  //       console.log('Cant remove only admin');
  //     }
  //   }
  // }
  
  // export function DeleteBoardButtonPressed(boardUID: any, callback: any) {
  //   DeleteBoard(boardUID, function(success: any, error: any) {
  //     callback(success)
  //   }) 
  // }
  
  // export function DeleteBoardPressed(boardUID: any, callback: any) {
  //   DeleteBoard(boardUID, function(success: any, error: any) {
  //     callback(success)
  //   }) 
  // }
  
  // function Reload(setRefreshUID: any) {
  //   const uid = v1()
  //   setRefreshUID(uid)
  // }
  
  // export function GetTripData(tripInfo: any, clients: any) {
  //   const trip = { client: null, data: tripInfo }
  //   const tripClientUID = tripInfo['71130']
  
  //   for (let i = 0; i < clients.length; i++) {
  //     const client = clients[i]
    
  //     if (client.id === tripClientUID) {
  //       trip['client'] = client
  //     }
  //   }
  
  //   return trip
  // }
  
    // CreateSubscription(stripeCustomerUID, stripeInfo.url, plan, seats, clientReferenceId, function(success, subscriptionData, error) {
    //   if (!error) {
    //     const subscriptionId = subscriptionData['subscriptionId']
    //     const clientSecret = subscriptionData['clientSecret']
  
    //     UpdateBoardSubscriptionInfo(boardUID, subscriptionId, stripeInfo.isLive, function(success, error) {
    //       callback(clientSecret)
    //     })
    //   }
    // })
  // }
  
  // export function getPaymentMethod(companyInfo: any, stripeInfo: any, callback: any) {
  //   if (companyInfo['subscription']) {
  //     const paymentMethodUID = companyInfo.subscription['default_payment_method']
  
  //     GetPaymentMethod(stripeInfo.url, paymentMethodUID, function(success: any, paymentMethodData: any, error: any) {
  //       callback(paymentMethodData)
  //     })
  //   } else {
  //     callback(null)
  //   }
  // }
  
  // export function cancelSubscription(subscriptionUID: any, stripeInfo: any, history: any) {
  
  //   CancelSubscription(subscriptionUID, stripeInfo.url, function(success: any, error: any) {
  //     if (success) {
  //       history.push('/')
  //     }
  //   }) 
  // }
  
  // export function InputTypes(name: any, csv: any, data: any, companySettings: any) {
  //   var info = { [v1()]: {} }
    
  //   if (name === 'importTripEmployeeInfo') {
  //     var newData = [{ title: 'first name', name: 'fName', type: 'text', value: data ? data['fName'] : '', required: false }, { title: 'last name', name: 'lName', type: 'text', value: data ? data['lName'] : '', required: false }]
  
  
  
  //     for (let i = 0; i < companySettings.headers.length; i++) {
  //       const header = companySettings.headers[i]
  //       if (header.title.toLowerCase() !== 'name' && header.uid !== '71130') {
  //         // var value = data ? data[header.uid] : ''
          
  //         // if (!value) {
  //         //   if (i === 0) {
  //         //     // value = data.riderUID
  //         //   } else if (i === 1) {
  //         //     // value = data.type
  //         //   } else if (i === 3) {
  //         //     // value = data.pickupTime
  //         //   } else if (i === 4) {
  //         //     // value = data.destination
  //         //   } else if (i === 5) {
  //         //     // value = data.pickupDate.toDate()
  //         //   } else if (i === 6) {
  //         //     // value = data.driverUID
  //         //   }
  //         // } else {
  //         //   if (header.type === 'date') {
  //         //     // value = data[header.uid].toDate()
  //         //   }
  //         // }
  
  //         const item = { title: header.title, name: header.uid, type: header.type, value: '', required: false }
  //         newData.push(item)
  //       }
  //     }
  
  //     info[name] = { fields: newData }
  //   } else {
  
  //   }
  
  //   return info
  // }
  
  // export const determineType = (item: any) => {
  //   let newItem = { type: 'text', value: item }
  
  //   // Check for time
  //   const regexTimes = [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]+ (pm|am|PM|AM)/, /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]/]
  //   for (let i = 0; i < regexTimes.length; i++) {
  //     const regex = regexTimes[i]
  
  //     if (regex.test(item)) {
  //       // const timeStr = item.match(regex)[0]
  
  //       newItem.type = 'time'
  //       newItem.value = ConvertTime12to24(item.match(regex)[0])
  //       break;
  //     }
  //   }
  
  //   // Check for date
  //   const regexDates = [/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/, /\b(?:Jan(?:uary)?|Feb(?:ruary)?|...|Dec(?:ember)?) [0-9][0-9]\, \d{4}/]
  //   for (let i = 0; i < regexDates.length; i++) {
  //     const regex = regexDates[i]
  
  //     if (regex.test(item)) {
  //       const regexYear = /\d{4}/
  //       const regexMonth = /\b(?:Jan(?:uary)?|Feb(?:ruary)?|...|Dec(?:ember)?)/
  //       const regexDay = /[0-9][0-9]/
  
  //       const dateStr = item.match(regex)[0]
  //       const date_year = dateStr.match(regexYear);
  //       const date_month = GetMonths[dateStr.match(regexMonth)]
  //       const date_day = dateStr.match(regexDay)
  
  //       if (date_year && date_month && date_day) {
  //         const tripDate = new Date(+date_year, +date_month - 1, +date_day);
  //         newItem.type = 'date'
  //         newItem.value = tripDate
  //       }
  
  //       break;
  //     }
  //   }
  
  //   // Check for address
  //   const regexAddresses = [/\d+ ([^,]+), ([A-Z]{2}) (\d{5})/]
  //   for (let i = 0; i < regexAddresses.length; i++) {
  //     const regex = regexAddresses[i]
  
  //     if (regex.test(item)) {
  //       const addressStr = item.match(regex)[0]
  
  //       newItem.type = 'address'    
  //       // const address = { address: newAddress, latLng: latLng }
  //       const address = { address: addressStr }
  //       newItem.value = address
  
  //       break;
  //     }
  //   }
  
  //   // Check for phone
  //   const regexPhone = [/(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/]
  //   for (let i = 0; i < regexPhone.length; i++) {
  //     const regex = regexPhone[i]
  
  //     if (regex.test(item)) {
  //       newItem.type = 'phone'
  //       newItem.value = item.match(regex)[0]
  //       break;
  //     }
  //   }
  
  //   return newItem
  // }
  
  // export function StartImport(boardUID: any, trips: any) {
  //   SaveImportedTrips(boardUID, trips, function() {
  //     console.log('Done Importing... ');
  //   })
  // }


