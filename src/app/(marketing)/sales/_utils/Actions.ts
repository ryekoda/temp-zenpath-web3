import { ContactUs } from '@/helpers/sendInBlue/SendInBlue';



export interface ContactSalesValues {
    name: string
    email: string
    jobTitle: string
    phone: string
    compName: string
    compSize: string
    helpDetails: string
}

// Returns an error code for ErrorMessage, or 0 when the message was sent.
export async function SubmitContactSales(values: ContactSalesValues) {
    const wholeName = values.name.trim().split(/\s+/)
    const fName = wholeName[0]
    const lName = wholeName.length > 1 ? wholeName[wholeName.length - 1] : ''

    if (!fName || !lName) return 1

    const isSent = await ContactUs(
        values.email.trim(),
        fName,
        lName,
        values.jobTitle.trim(),
        values.phone.trim(),
        values.compName.trim(),
        values.compSize,
        values.helpDetails.trim()
    )

    return isSent ? 0 : 2
}

export function ErrorMessage(errorCode: number) {
    var info = { message: '' }

    switch(errorCode) {
      case 1:
        info['message'] = 'Please enter first & last name'
        break;
      case 2:
        info['message'] = "We couldn't send your message. Please try again in a moment"
        break;
      default:
        info['message'] = ''
        break;
    }

    return info
  }
