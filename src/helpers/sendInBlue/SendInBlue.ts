import axios from 'axios';



export async function AddToEmailList(email: string, fName: string, lName: string) {
  const urlString = "https://backend-n4cp.onrender.com/api/email/subscribe"

  try {
    const response = await axios.post(urlString, {
      listID: 2,
      email: email,
      fName: fName.toLowerCase(),
      lName: lName.toLowerCase()
    })

  } catch (error: any) {
    console.log("Error", error.message);
  }
}

// Returns true if the backend accepted the request. `message` is sent as an extra field;
// the backend needs to read it for the visitor's message to be included.
export async function ContactUs(email: string, fName: string, lName: string, jobTitle: string, phone: any, compName: string, compSize: any, message?: string): Promise<boolean> {
  const urlString = "https://backend-n4cp.onrender.com/api/email/contact-us"

  try {
    await axios.post(urlString, {
      listID: 3,
      email: email,
      fName: fName.toLowerCase(),
      lName: lName.toLowerCase(),
      jobTitle: jobTitle ? jobTitle.toLowerCase() : '',
      phone: phone,
      compName: compName.toLowerCase(),
      compSize: compSize,
      message: message ?? ''
    })

    return true
  } catch (error: any) {
    console.log("Error", error.message);
    return false
  }
}

export async function SendInviteEmail(recipEmail: string, senderName: string, boardName: string, message?: any) {
  const urlString = "https://backend-n4cp.onrender.com/api/email/invite"

  try {
    const response = await axios.post(urlString, {
      email: recipEmail,
      senderName: senderName.toLowerCase(),
      boardName: boardName.toLowerCase(),
      message: message ? message.toLowerCase() : ''
    })

  } catch (error: any) {
    console.log("Error", error.message);
  }
}
