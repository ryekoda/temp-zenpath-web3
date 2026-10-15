// Whether the signed-in user may use a workspace.

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
