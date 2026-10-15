import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function GetUserInfo(userUID: string, allUsers: any[]): any | null {
    if (!userUID || !allUsers) return null;
    return allUsers.find(user => user.id === userUID) ?? null;
}

































export function CurrentDevice() {
    const screenSize = window.innerWidth
  
    if (screenSize > 768) {
      // Desktop
      return 'desktop'
    } else {
      // Mobile
      return "mobile"
    }
}


export function CapitalizeFirstLetter(string: string) {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } else {
    return string
  }
}


export function CapitalizeFirstLetterOfEachWord(words: string) {
  if (words && words.length > 0) {
    var separateWord = words.toLowerCase().split(' ');
    for (var i = 0; i < separateWord.length; i++) {
       separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
       separateWord[i].substring(1);
    }

    return separateWord.join(' ');
  } else {
    return ''
  }
}


export function IsAccessGranted(companyInfo: any, currentUser: any) {
  let isGranted = ''

  if (companyInfo && currentUser) {
    const userUID = currentUser.id

    if (currentUser.email === 'ryekoda@gmail.com') {
      isGranted = 'approved'
      return isGranted
    } else {
      // const allActiveRoles = companyInfo.allActiveRoles

      // test
      const approvedRoles = [...companyInfo.admins, ...companyInfo.members]

      if (approvedRoles.includes(userUID)) {
        isGranted = 'approved'
      } else {
        isGranted = 'rejected'
      }

      return isGranted
    }
  } else {
    return isGranted
  }
}


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

export function GetMembers2(admins: any, members: any, drivers: any, pendingInvites: any) {
  let allMembers = []

  for (let i = 0; i < admins.length; i++) {
    const admin = admins[i]

    if (!userExists(admin, allMembers)) {
      allMembers.push({ role: 'admin', userUID: admin, userName: '', email: '' })
    }
  }

  for (let i = 0; i < members.length; i++) {
    const member = members[i]

    if (!userExists(member, allMembers)) {
      allMembers.push({ role: 'member', userUID: member, userName: '', email: '' })
    }
  }
  
  if (drivers) {
    for (let i = 0; i < drivers.length; i++) {
      const driver = drivers[i]
  
      if (!userExists(driver, allMembers)) {
        allMembers.push({ role: 'driver', userUID: driver, userName: '', email: '' })
      }
    }
  }

  if (pendingInvites) {
    for (let i = 0; i < pendingInvites.length; i++) {
      const pendingInvite = pendingInvites[i]

      if (pendingInvites) {
        if (!userExists(pendingInvites, allMembers)) {
          allMembers.push({ role: pendingInvite.type, userUID: '', userName: '', email: pendingInvite.email, status: 'pending' })
        }
      }
    }
  }

  return allMembers
}

function userExists(userUID: string, allMembers: any) {
  return allMembers.some(function(item: any) {
    return item.userUID === userUID;
  });
}

export function SubscriptionStatus(companyInfo: any, featureTier: any) {
  var status = {
    isSubscriptionActive: false,
    isFeatureAvailable: false,
    isInGracePeriod: false
  }

  // Check feature
  if (featureTier === 'basic') {
    if (companyInfo && companyInfo['subscription']) {
      if (companyInfo.subscription['plan'] && (companyInfo['subscription'].plan.product === 'prod_LqdmZoEun67EcL') || (companyInfo['subscription'].plan.product === 'prod_MGXTFMyk9JMFbN')) {
        status['isFeatureAvailable'] = true
      }
    }
  } else if (featureTier === 'standard') {
    if (companyInfo && companyInfo['subscription']) {
      if (companyInfo.subscription['plan'] && (companyInfo['subscription'].plan.product === 'prod_MjLp7YteNG903X') || (companyInfo['subscription'].plan.product === 'prod_MjLixr8gcOoYf5')) {
        status['isFeatureAvailable'] = true
      }
    }
  }

  // check payment status
  if (companyInfo && companyInfo['subscription'] && companyInfo.subscription['current_period_end']) {
    const subscriptionPeriodEndDate = companyInfo['subscription'].current_period_end * 1000
    const subscriptionGracePeriod = subscriptionPeriodEndDate + 12096e5
    const gracePeriodDate = new Date(subscriptionGracePeriod);
    const subscriptionEndDate = companyInfo['ended_at'] ? new Date(companyInfo.ended_at) : null
    const subscriptionStatus = companyInfo['subscription'].status
    const currentDate = new Date()

    // if (currentDate <= subscriptionPeriodEndDate) {
    if (currentDate <= new Date(subscriptionPeriodEndDate)) {
      status['isSubscriptionActive'] = subscriptionStatus === 'active' ? true : false
    } else if (subscriptionEndDate) {
      // Subscription cancelled
      status['isSubscriptionActive'] = false
    } else {
      if (currentDate <= gracePeriodDate) {
          // unable to process payment
          status['isInGracePeriod'] = true
      } else {
        status['isFeatureAvailable'] = false
      }
    }
  }

  return status
}

export function IsLoadMoreAvailable(itemsLength: any) {
  const result = itemsLength === 0 ? false : Number.isInteger(itemsLength / 48)
  return result
}

export function TimeConverter(rawTime: any) {

  if (rawTime) {
    if (typeof rawTime === 'string') {
      let hour = rawTime.substring(0, 2)
      let mins = rawTime.substring(3, 5)

      if (hour < "12") {
        // AM
        switch(hour) {
          case "00":
            return ("12").concat(":", mins, " AM")
          default:
            return (hour).concat(":", mins, " AM")
        }
      } else {
        // PM
        switch(hour) {
          case "12":
            return (hour).concat(":", mins, " PM")
          case "13":
            return ("1").concat(":", mins, " PM")
          case "14":
            return ("2").concat(":", mins, " PM")
          case "15":
            return ("3").concat(":", mins, " PM")
          case "16":
            return ("4").concat(":", mins, " PM")
          case "17":
            return ("5").concat(":", mins, " PM")
          case "18":
            return ("6").concat(":", mins, " PM")
          case "19":
            return ("7").concat(":", mins, " PM")
          case "20":
            return ("8").concat(":", mins, " PM")
          case "21":
            return ("9").concat(":", mins, " PM")
          case "22":
            return ("10").concat(":", mins, " PM")
          case "23":
            return ("11").concat(":", mins, " PM")
          case "24":
            return ("12").concat(":", mins, " AM")
          default:
            return (hour).concat(":", mins, " PM")
        }
      }
    } else {
      // number
      return TimeConverterFromDate(new Date(rawTime))
    }
  } else {
    return ''
  }
}

export function TimeConverterFromDate(date: any) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

// export function GetUserInfo(userUID: string, allUsers: any[]) {
//   if (userUID && allUsers) {
//     for (var i = 0; i < allUsers.length; i++) {
//       let user = allUsers[i];
//       // console.log("VVVV: ", user.id, userUID, user);

//       if (user.id === userUID) {      
//         return user
//       }
//     }
//   } else {
//     return null
//   }
// }

export function FormatDate(date: any) {
  var d = new Date(date),
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();

  if (month.length < 2) {
    month = '0' + month;
  }

  if (day.length < 2) {
    day = '0' + day;
  }

  return [month, day, year].join('-');
}


export function FormatPhoneNumber(phoneNumberString: any) {
  if (phoneNumberString) {
    const match = phoneNumberString
       .replace(/\D+/g, '').replace(/^1/, '')
       .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
     const part1 = match.length > 2 ? `(${match.substring(0,3)})` : match
     const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
     const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
     return `${part1}${part2}${part3}`
  } else {
    return ''
  }
}

export function GenerateFormData(fields: any[]) {
  let data: any = {}

  for (let i = 0; i < fields.length; i++) {
    var field = fields[i]

    if (field.type === 'date' && !field.value) {
      data[field.name] = new Date()
    }

    if (field.type === 'phone' && field.value) {
      data[field.name] = field.value.replace(/[^a-zA-Z0-9]/g, '')
    }

    if (field.value) {
      data[field.name] = field.value
    }
  }

  return data
}


export function UTCTimeToLocalTime(utcTime: Date) {
  const offset = utcTime.getTimezoneOffset();
  const local = new Date(utcTime.getTime() + offset * 60000);
  return local
}