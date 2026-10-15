import { useState, useEffect } from 'react';
import { GetCompany, GetCompanies } from '@/helpers/database/Companies';
import { GetSubscription } from '@/helpers/stripe/Stripe';



export function useCompany(companyUID, stripeInfo, isGranted, refreshUID, dbURL, isLoading, setIsLoading) {
  const [company, setCompany] = useState()


  useEffect(() => {

      if (isGranted) {
        (async () => {
          const companyData = await GetCompany(companyUID, dbURL).catch((err) => console.log('company error: ', err)); 

          let companyInfo = {
            ...companyData
          }

          // Get Subscription Info
          let subscriptionUID = ''
          if (stripeInfo.isLive) {
            subscriptionUID = companyInfo['subscriptionUID'] ? companyInfo['subscriptionUID'] : ''
          } else {
            subscriptionUID = companyInfo['testSubscriptionUID'] ? companyInfo['testSubscriptionUID'] : ''
          }

          if (subscriptionUID) {
            const baseURL = stripeInfo.baseURL

            const subscriptionData = await GetSubscription(subscriptionUID, baseURL).catch((err) => console.log('subscription error: ', err)); 
            if (subscriptionData) {
              companyInfo.subscription = subscriptionData
            }            
          }
   
          setCompany(companyInfo);
          if (typeof isLoading === 'boolean') setIsLoading(false)
        })();  
      }
  }, [ refreshUID ]);


  return company
}


// Returns { companies, isLoading } so callers can tell "still loading" apart from "no workspaces".
export function useCompanies(userInfo, isGranted, refreshUID, dbURL) {
  const [companies, setCompanies] = useState([])
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {

    if (userInfo && isGranted) {
      (async () => {
        const userUID = userInfo.id
        const companiesData = await GetCompanies(userUID, dbURL).catch((err) => console.log('companies error: ', err));
        setCompanies(companiesData ?? [])
        setIsLoading(false)
      })();  
    }
  }, [ userInfo, isGranted, refreshUID ]);

  
  return { companies, isLoading }
}
