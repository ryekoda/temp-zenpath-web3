import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from '@/config/firebase/Firebase';
import { SaveUser, UpdateUser } from '@/helpers/database/UserProfiles';
import { CreateStripeCustomer } from '@/helpers/stripe/Stripe';
import { AddToEmailList } from '@/helpers/sendInBlue/SendInBlue';



export async function Login(email: string, password: string) {
  let data = {}
  
  await signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    data = {
      'user': userCredential.user,
      'error': null,
      'errorMessage': null
    }
  })
  .catch((error) => {
    data = {
      'user': null,
      'error': error.code,
      'errorMessage': error.message
    }
  });

  return data
}
  
  
// Returns the Firebase error code, or null if the reset email was sent.
export async function ResetPassword(email: string): Promise<string | null> {
  try {
    await sendPasswordResetEmail(auth, email)
    return null
  } catch (error: any) {
    return error.code ?? 'unknown'
  }
}


export async function Logout() {
  await signOut(auth).then(() => {
    return
  }).catch((error) => {
    return
  });
}


export async function Register(email: string, password: string, fName: string, lName: string, baseURL: string, stripeInfo: any) {
  let data: any = {}

  // Auth
  await createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    data = {
      'user': userCredential.user,
      'error': null,
      'errorMessage': null
    }
  })
  .catch((error) => {
    data = {
      'user': null,
      'error': error.code,
      'errorMessage': error.message
    }

    return data
  });

  // DB
  const authUID = data['user'] ? data['user'].uid : null
  let userUID = null

  if (authUID) {
    userUID = await SaveUser(authUID, email, fName, lName, baseURL)
  } else {
    return data
  }

  // Stripe
  let customerUID = null
  if (userUID) {
    const stripeCustomer = await CreateStripeCustomer(userUID, email, stripeInfo.baseURL, baseURL, stripeInfo.isLive)
    customerUID = stripeCustomer ? stripeCustomer.id : null
  } else {
    return data
  }

  // Update DB
  if (customerUID) {
    await UpdateUser(userUID, stripeInfo.isLive ? 'stripeUID' : 'stripeUID_test', customerUID, baseURL)
  } else {
    return data
  }

  // SendInBlue
  AddToEmailList(email, fName, lName)
  return data
}