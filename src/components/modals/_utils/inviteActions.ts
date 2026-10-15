import { v1 } from "uuid";
import { UpdateCompany } from '@/helpers/database/Companies';
import { GetUser } from '@/helpers/database/UserProfiles';
import { SaveNotification, UpdateNotification, GetNotifications } from '@/helpers/database/Notifications';
import { GetEmployees, UpdateEmployee } from '@/helpers/database/Employees';
import { SendInviteEmail } from '@/helpers/sendInBlue/SendInBlue';
import { GetSubscriptionPlanInfo } from '@/lib/billing/plans';



export type InviteRole = 'admin' | 'member' | 'driver'

export const inviteRoles: { value: InviteRole, label: string, description: string }[] = [
  { value: 'admin', label: 'Admin', description: 'Account and billing settings, plus dispatch and driver tools.' },
  { value: 'member', label: 'Member', description: 'Dispatch and driver tools only.' },
  { value: 'driver', label: 'Driver', description: 'Driver tools only.' },
]


export async function Invite(email: string, type: string, company: any, currentUser: any, setErrorMessage: any, dbURL: string, setValue: any, setRefreshUID: any) {
  const { id, admins, members, drivers, pendingInvites } = company
  const subscriptionPlan = GetSubscriptionPlanInfo(company)
  const availableSeats = subscriptionPlan ? subscriptionPlan.seats : 2

  if (members.length >= availableSeats) {
    setErrorMessage(`Your plan includes ${availableSeats} ${availableSeats === 1 ? 'seat' : 'seats'}, and they're all in use. Upgrade or add seats to invite more people.`)
  } else {
    const isAdmin = admins.some((element: any) => element === currentUser.id);

    if (type === 'admin') {
      if (isAdmin) {
        await StartInvite() // success
      } else {
        setErrorMessage('Only an admin can invite another admin.')
      }
    } else {
      await StartInvite()
    }
  }


  async function StartInvite() {
    if (pendingInvites && pendingInvites.find((o: any) => o.email === email)) {
      setErrorMessage(`${email} has already been invited.`)
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
          await SavePendingInvition()
        } else {
          setErrorMessage(`${email} is already in this workspace.`)
        }
      } else {
        await SavePendingInvition() // not a zenpath user
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
  const { role, userUID, email } = member
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
        const employee = employees && employees.length > 0 && employees[0]
        if (employee) {
          await UpdateEmployee(employee.id, dbURL, 'userUID', '')
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
  setRefreshUID(v1())
}
