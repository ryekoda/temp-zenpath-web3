// Looking up people: workspace members, users and drivers.

function userExists(userUID: string, allMembers: any) {
  return allMembers.some(function(item: any) {
    return item.userUID === userUID;
  });
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


export function GetUserInfo(userUID: string, allUsers: any[]): any | null {
    if (!userUID || !allUsers) return null;
    return allUsers.find(user => user.id === userUID) ?? null;
}


export function GetDriverNameFromUID(driverUID: any, allDrivers: any) {
  var driverName = ''

  for (let i = 0; i < allDrivers.length; i++) {
    const driver = allDrivers[i]

    if (driver.id === driverUID) {
      driverName = driver.fName + ' ' + driver.lName
    }
  }

  return driverName
}
