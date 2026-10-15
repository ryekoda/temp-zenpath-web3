import { stripeConfig } from '@/config/stripe/Stripe';
import axios from 'axios';
import { UpdateUser } from '@/helpers/database/UserProfiles';



export async function CreateStripeCustomer(userUID: string, email: string, baseURL: string, dbBaseURL: string, isLive: boolean) {
  const url = baseURL + '/api/stripe/customers'
  
  const doc = await axios.post(url, {
    'email': email
  })

  const data = doc['data'].customer
  if (data) {    
    // await UpdateUser(userUID, isLive ? 'stripeUID' : 'testStripeUID', data.id, dbBaseURL)
    return data
  } else {
    return
  }
}


export async function CreateSubscription(stripeCustomerUID: string, baseURL: string, plan: any, seats: any, clientReferenceId: string) {
  const url = baseURL + '/api/stripe/subscriptions'


  const doc = await axios.post(url, {
    'planUID': plan.planUID,
    'seats': seats,
    'customerUID': stripeCustomerUID,
    'clientReferenceId': clientReferenceId
  })

  const data = doc['data'].subscription
  if (data) {
      return data
  } else {
      return
  }
}

export async function GetSubscription(uid: string, baseURL: string) {
  const url = baseURL + '/api/stripe/subscriptions'

  const doc = await axios.get(url, {
    params: {
      'uid': uid
    }
  })

  const data = doc['data'].subscription

  if (data) {
      return data
  } else {
      return
  }
}


export async function UpdateSubscription(uid: string, subItemUID: string, key: string, value: any, baseURL: string, ) {
  const url = baseURL + '/api/stripe/subscriptions'
  
  const doc = await axios.put(url, {
    'uid': uid,
    'subItemUID': subItemUID,
    'key': key, 
    'value': value
  })

  const data = doc['data'].subscription
  if (data) {
      return data
  } else {
      return
  }
}


export async function DeleteSubscription(uid: string, baseURL: string) {
  const url = baseURL + '/api/stripe/subscriptions'

  const doc = await axios.delete(url, {
    data: {
      'uid': uid
    }
  });
  
  const data = doc['data'].subscription

  if (data) {
      return data
  } else {
      return
  }
}


export async function GetPaymentMethod(uid: string, baseURL: string) {
  const url = baseURL + '/api/stripe/payment'
  
  const doc = await axios.get(url, {
    params: {
      'uid': uid
    }
  })

  const data = doc['data'].payment

  if (data) {
      return data
  } else {
      return
  }
}
