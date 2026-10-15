import { GetCompany, UpdateCompany } from '@/helpers/database/Companies';
import { SaveEmployee, GetEmployees } from '@/helpers/database/Employees';
import { UpdateNotification } from '@/helpers/database/Notifications';



const roleKeys: Record<string, 'admins' | 'members' | 'drivers'> = {
    admin: 'admins',
    member: 'members',
    driver: 'drivers',
}

// Accepts or declines a workspace invite. Returns true if it went through.
//
// 1. Marks the invite notification as read and responded.
// 2. On accept: adds the user to the invited role and makes sure they have an employee profile.
// 3. Either way: removes the pending invite for this email from the workspace.
export async function SavePendingInviteResponse(notificationUID: string, companyUID: string, currentUser: any, isInviteApproved: boolean, dbURL: string) {
    const userUID = currentUser.id
    const email = (currentUser.email ?? '').toLowerCase()

    try {
        await UpdateNotification(notificationUID, [{ 'isRead': true }, { 'isResponded': true }], dbURL)

        const company = await GetCompany(companyUID, dbURL)
        if (!company) return false

        const pendingInvites: any[] = company.pendingInvites ?? []
        const invite = pendingInvites.find(item => (item.email ?? '').toLowerCase() === email)
        // The invite was already answered or withdrawn; nothing left to change.
        if (!invite) return true

        if (isInviteApproved) {
            const roleKey = roleKeys[invite.type] ?? 'members'
            const roleUIDs: string[] = company[roleKey] ?? []
            if (!roleUIDs.includes(userUID)) {
                await UpdateCompany(companyUID, roleKey, [...roleUIDs, userUID], dbURL)
            }

            const employees = await GetEmployees(companyUID, dbURL, null, userUID)
            if (!employees || employees.length === 0) {
                await SaveEmployee({
                    'fName': currentUser.fName,
                    'lName': currentUser.lName,
                    'dateHired': new Date(),
                    'userUID': userUID
                }, companyUID, dbURL)
            }
        }

        const remainingInvites = pendingInvites.filter(item => (item.email ?? '').toLowerCase() !== email)
        await UpdateCompany(companyUID, 'pendingInvites', remainingInvites, dbURL)

        // Analytics_Fir()[isInviteApproved ? 'accepted_invite' : 'rejected_invite']()
        return true
    } catch (err) {
        console.log('invite response error: ', err)
        return false
    }
}
