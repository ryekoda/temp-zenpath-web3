import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { auth } from '@/config/firebase/Firebase';
import { GetUser } from '@/helpers/database/UserProfiles';
import { GetSubscription } from '@/helpers/stripe/Stripe';
import GetBaseURL from '@/lib/BaseURLs';



const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}


// These don't depend on who is signed in, so they're available immediately
// (pages like Pricing and Register read them before auth has resolved).
const isAppLive = true
const dbBaseURL = GetBaseURL('db', isAppLive)
const baseStripeInfo = {
  'pubKey': isAppLive ? 'pk_live_51KMes1FtKdf0x5ZlBIRPuB9sRUr04RHBSvELWeS8jVvpRC0DqUXOuHEWMWmX3js12DX4pxEU1y6abe9djX0YaEza009JuTliMP' : 'pk_test_51KMes1FtKdf0x5ZliDzCyo2lgz7dUcU7egpEGamkCQQjalBb32jgCMUZ5LD2LHSRwWkwo2lq5g5sS0h2aCC4Ktx400pNdr7s9S',
  'baseURL': GetBaseURL('stripe', isAppLive),
  'isLive': isAppLive
}

export function AuthProvider({ children }) {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState()
  const [stripeInfo, setStripeInfo] = useState(baseStripeInfo)
  const [isLoading, setIsLoading] = useState(true)



  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async function(user) {
      // Set the cookie first: app/page.tsx reads it on the server to decide
      // between the Splash page and the dashboard.
      const wasLoggedIn = Cookies.get('isLoggedIn') === 'true'
      Cookies.set('isLoggedIn', user ? 'true' : 'false')
      if (wasLoggedIn !== !!user) router.refresh()

      if (!user) {
        setCurrentUser(null)
        setStripeInfo(baseStripeInfo)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      const stripeData = { ...baseStripeInfo }
      const userInfo = await GetUser(dbBaseURL, null, user.uid, null, null).catch((err) => console.log('user error: ', err));

      if (userInfo) {
        const subscriptionUID = isAppLive ? (userInfo['stripeUID'] ? userInfo['stripeUID'] : userInfo.subscriptionUID) : userInfo['stripeUID_test']

        if (subscriptionUID) {
          const subscription = await GetSubscription(subscriptionUID, baseStripeInfo.baseURL).catch((err) => console.log('subscription error: ', err));
          stripeData['subscription'] = subscription
        }
      }

      setCurrentUser(userInfo)
      setStripeInfo(stripeData)
      setIsLoading(false)
    })

    return unsubscribe
  }, [router])
  

  const value = {
    currentUser,
    dbURL: dbBaseURL,
    stripeInfo,
    isLoading
  }

  return (
    <AuthContext.Provider value={ value }>
      { children }
    </AuthContext.Provider>
  )
}
