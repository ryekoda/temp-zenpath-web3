export function TimeConverter(rawTime) {

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
  
  export function TimeConverterFromDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
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
  
  export function FormatDate(date) {
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
  
  export function FormatDate_Slash(date) {
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
  
    return [month, day, year].join('/');
  }
  
  export function CapitalizeFirstLetter(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
      return string
    }
  }
  
  export function CapitalizeFirstLetterOfEachWord(words) {
  
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
  
  export function AbriviateWord(words) {
    if (words) {
      var separateWord = words.toLowerCase().split(' ');
      for (var i = 0; i < separateWord.length; i++) {
         separateWord[i] = separateWord[i].charAt(0).toUpperCase()
      }
   
      return separateWord.join('').substring(0,2);
    } else {
      return words
    }
  }
  
  export function FormatPhoneNumber(phoneNumberString) {
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
  
  export function IsAccessGranted(companyInfo, userInfo) {
    let isGranted = ''
  
    if (companyInfo && userInfo) {
      const userUID = userInfo.id
  
      if (userInfo.email === 'ryekoda@gmail.com') {
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
  
  
        // for (let i = 0; i < allActiveRoles.length; i++) {
        //   const activeRole = allActiveRoles[i]
        //   const activeRoleUID = activeRole.userUID
  
        //   if (activeRoleUID === userUID) {
        //     isGranted = 'approved'
        //     return isGranted
        //   } else {
        //     if (activeRoleUID === allActiveRoles[allActiveRoles.length - 1].userUID) {
        //       return isGranted
        //     }
        //   }
        // }
      }
    } else {
      return isGranted
    }
  }
  
  export function IsLoadMoreAvailable(itemsLength) {
    const result = itemsLength === 0 ? false : Number.isInteger(itemsLength / 48)
    return result
  }
  
  export const HeaderTitles = (companySettings, isFiltered) => {
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
  
  export function InputOptionsConvert(allData) {
    var inputOptions = {}
    var allOptions = []
  
    for (let i = 0; i < allData.length; i++) {
      const item = allData[i]
  
      const option = { value: item.id, title: item.fName + ' ' + item.lName }
      allOptions.push(option)
    }
  
    allOptions.sort(function(a, b) {
      var textA = a && a['title'] ? a.title.toUpperCase() : '';
      var textB = b && b['title'] ? b.title.toUpperCase() : '';
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
   
    inputOptions = { dropDown: allOptions }
    return inputOptions
  }
  
  export function GetDriverNameFromUID(driverUID, allDrivers) {
    var driverName = ''
  
    for (let i = 0; i < allDrivers.length; i++) {
      const driver = allDrivers[i]
  
      if (driver.id === driverUID) {
        driverName = driver.fName + ' ' + driver.lName
      }
    }
  
    return driverName
  }
  
  // export function GetMembers(company) {
  //   let allMembers = []
  
  //   if (company) {
  //     const { admins, members, pendingMembersEmails } = company
     
  //     for (let i = 0; i < admins.length; i++) {
  //       const admin = admins[i]
  
  //       if (!userExists(admin, allMembers)) {
  //         // const userName = GetUserNames(admin)
  //         allMembers.push({ role: 'admin', userUID: admin, userName: admin, email: '' })
  //       }
  //     }
  
  //     for (let i = 0; i < members.length; i++) {
  //       const member = members[i]
  
  //       if (!userExists(member, allMembers)) {
  //         allMembers.push({ role: 'member', userUID: member, userName: member, email: '' })
  //       }
  //     }
  
  //     for (let i = 0; i < pendingMembersEmails.length; i++) {
  //       const pendingMemberEmail = pendingMembersEmails[i]
  
  //       if (pendingMemberEmail) {
  //         if (!userExists(pendingMemberEmail, allMembers)) {
  //           allMembers.push({ role: 'pending', userUID: '', userName: pendingMemberEmail, email: pendingMemberEmail })
  //         }
  //       }
  //     }
  //   }
  
  //   return allMembers
  // }
  
  export function GetMembers2(admins, members, drivers, pendingInvites) {
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
  
  function userExists(userUID, allMembers) {
    return allMembers.some(function(item) {
      return item.userUID === userUID;
    });
  }
  
  export function CheckForUnreadNotifications(notifications) {
    var hasUnread = false
  
    for (let i = 0; i < notifications.length; i++) {
      const notification = notifications[i]
      const isRead = notification.isRead
  
      if (!isRead) {
        hasUnread = true
        break;
      }
    }
  
    return hasUnread
  }
  
  export function GetSubscriptionPlanInfo(companyInfo) {
    let plan = null
  
    if (companyInfo && companyInfo['subscription'] && companyInfo.subscription.status === 'active') {
      const subscription = companyInfo.subscription
      let productTitle = 'basic'
  
      if (subscription.plan.product === 'prod_LqdmZoEun67EcL' || subscription.plan.product === 'prod_MGXTFMyk9JMFbN') {
        productTitle = 'basic'
      }
  
      plan = { title: productTitle , seats: subscription.quantity }
    }
  
    return plan
  }
  
  export function GetTeamSizeOptions() {
    const options = [
        { label: '3', value: 3 },
        { label: '5', value: 5 },
        { label: '10', value: 10 },
        { label: '15', value: 15 },
        { label: '20', value: 20 },
        { label: '25', value: 25 },
        { label: '30', value: 30 },
        { label: '40', value: 40 },
        { label: '50', value: 50 },
        { label: '100', value: 100 },
        { label: '200+', value: 200 }
    ];
  
    return options
  }
  
  export function GetPlans(isMonthlyPlan, isLive) {
  
    const planUID = (title) => {
      if (isLive) {
        if (title === 'basic') {
          return isMonthlyPlan ? 'price_1LY0OUFtKdf0x5ZlCHEa6YFS' : 'price_1LY0OUFtKdf0x5ZlQddzwB2u'
        } else if (title === 'standard') {
          return isMonthlyPlan ? 'price_1Lzt1OFtKdf0x5ZlX4E31GAD' : 'price_1MEKIdFtKdf0x5ZlbsWlXyQK'
        } else {
          return title
        }
      } else {
        if (title === 'basic') {
          return isMonthlyPlan ? 'price_1LWRacFtKdf0x5ZlMoxnUahy' : 'price_1LWReiFtKdf0x5Zl6wzxV8zV'
        } else if (title === 'standard') {
          return isMonthlyPlan ? 'price_1Lzt84FtKdf0x5ZlDkde06xu' : 'price_1Lzt84FtKdf0x5ZlxSdINsmW'
        } else {
          return ''
        }
      }
    }
  
    const plans = [
        {
          index: 0, 
          title: 'Free', 
          icon: '/images/freeBadge.png', 
          price: 0, 
          note: 'For individuals looking to get started with dispatch',
          details: '_', 
          perks: ['Up to 50 trips per month', 'Unlimited entries', 'Up to 2 workspaces', 'Up to 2 team members', 'iOS and Android mobile app'], 
          isRec: false
        },
        {
          index: 1, 
          title: 'Basic', 
          icon: '/images/starterBadge.png', 
          price: isMonthlyPlan ? 9 : 5, 
          note: 'Manage your team in one place',
          details: 'Everything in FREE plan plus:',
          perks: ['Unlimited trips', 'Unlimited workspaces', 'Prioritized customer support'],
          isRec: false,
          planUID: planUID('basic')
        },
        {
          index: 2, 
          title: 'Standard', 
          icon: '/images/starterBadge.png', 
          price: isMonthlyPlan ? 19 : 12, 
          note: 'Scale your team with streamlined solutions',
          details: 'Everything in Basic plan plus:',
          perks: ['Unlimited trip report history'],
          isRec: true,
          planUID: planUID('standard')
        }
    ]
  
    return plans
  }
  
  export function WordCount(str) {
    if (str) {
      str = str.replace(/(^\s*)|(\s*$)/gi,"");
      str = str.replace(/[ ]{2,}/gi," ");
      str = str.replace(/\n /,"\n");
      return str.split(' ').length;
    } else {
      return ''
    }
  }
  
  export const GetMonths = {
    jan: '01',
    feb: '02',
    mar: '03',
    apr: '04',
    may: '05',
    jun: '06',
    jul: '07',
    aug: '08',
    sep: '09',
    oct: '10',
    nov: '11',
    dec: '12',
  }
  
  export const ConvertTime12to24 = (time12h) => {
    const [time, modifier] = time12h.split(' ');
  
    let [hours, minutes] = time.split(':');
  
    if (hours === '12') {
      hours = '00';
    }
  
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
  
    return `${hours}:${minutes}`;
  }
  
  
  export function GetDropDownOptions(name, options, currentFieldData, allDrivers) {
    let dropDownOptions = []
  
    if (name === '46783') {
      // employees
  
      allDrivers.sort(function(a, b) {
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
  
  export function SubscriptionStatus(companyInfo, featureTier) {
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
  
      if (currentDate <= subscriptionPeriodEndDate) {
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
  
  export function toDate(dStr,format) {
      var now = new Date();
      if (format == "h:m") {
           now.setHours(dStr.substr(0,dStr.indexOf(":")));
           now.setMinutes(dStr.substr(dStr.indexOf(":")+1));
           now.setSeconds(0);
           return now;
      }else 
          return "Invalid Format";
  }
  
  export function GetUserInfo(userUID, allUsers) {
    if (userUID && allUsers) {
      for (var i = 0; i < allUsers.length; i++) {
        let user = allUsers[i];
  
        if (user.id === userUID) {
          return user
        }
      }
    } else {
      return null
    }
  }


  // active
  // past_due
  // unpaid
  // canceled
  // incomplete
  // incomplete_expired
  // trialing
  // all
  // ended