// Plans, prices, seats and subscription status.

export function GetPlans(isMonthlyPlan: any, isLive: any) {

  const planUID = (title: string) => {
    if (isLive) {
      if (title === 'basic') {
        return isMonthlyPlan ? 'price_1LY0OUFtKdf0x5ZlCHEa6YFS' : 'price_1LY0OUFtKdf0x5ZlQddzwB2u'
      } else if (title === 'standard') {
        return isMonthlyPlan ? 'price_1Lzt1OFtKdf0x5ZlX4E31GAD' : 'price_1MEKIdFtKdf0x5ZlbsWlXyQK'
      } else {
        return title
      }
    } else {
      if (title === 'basic') {
        return isMonthlyPlan ? 'price_1LWRacFtKdf0x5ZlMoxnUahy' : 'price_1LWReiFtKdf0x5Zl6wzxV8zV'
      } else if (title === 'standard') {
        return isMonthlyPlan ? 'price_1Lzt84FtKdf0x5ZlDkde06xu' : 'price_1Lzt84FtKdf0x5ZlxSdINsmW'
      } else {
        return ''
      }
    }
  }

  const plans = [
      {
        index: 0, 
        title: 'Free', 
        icon: '/images/freeBadge.png', 
        price: 0, 
        note: 'For individuals looking to get started with dispatch',
        details: '_', 
        perks: ['Up to 50 trips per month', 'Unlimited entries', 'Up to 2 workspaces', 'Up to 2 team members', 'iOS and Android mobile app'], 
        isRec: false
      },
      {
        index: 1, 
        title: 'Basic', 
        icon: '/images/starterBadge.png', 
        price: isMonthlyPlan ? 9 : 5, 
        note: 'Manage your team in one place',
        details: 'Everything in FREE plan plus:',
        perks: ['Unlimited trips', 'Unlimited workspaces', 'Prioritized customer support'],
        isRec: false,
        planUID: planUID('basic')
      },
      {
        index: 2, 
        title: 'Standard', 
        icon: '/images/starterBadge.png', 
        price: isMonthlyPlan ? 19 : 12, 
        note: 'Scale your team with streamlined solutions',
        details: 'Everything in Basic plan plus:',
        perks: ['Unlimited trip report history'],
        isRec: true,
        planUID: planUID('standard')
      }
  ]

  return plans
}


export function GetTeamSizeOptions() {
  const options = [
      { label: '3', value: 3 },
      { label: '5', value: 5 },
      { label: '10', value: 10 },
      { label: '15', value: 15 },
      { label: '20', value: 20 },
      { label: '25', value: 25 },
      { label: '30', value: 30 },
      { label: '40', value: 40 },
      { label: '50', value: 50 },
      { label: '100', value: 100 },
      { label: '200+', value: 200 }
  ];

  return options
}


export function GetSubscriptionPlanInfo(companyInfo: any) {
  let plan = null

  if (companyInfo && companyInfo['subscription'] && companyInfo.subscription.status === 'active') {
    const subscription = companyInfo.subscription
    let productTitle = 'basic'

    if (subscription.plan.product === 'prod_LqdmZoEun67EcL' || subscription.plan.product === 'prod_MGXTFMyk9JMFbN') {
      productTitle = 'basic'
    }

    plan = { title: productTitle , seats: subscription.quantity }
  }

  return plan
}


// featureTier ('basic' | 'standard') also checks whether that tier's features are unlocked.
export function SubscriptionStatus(companyInfo: any, featureTier?: string) {
  var status = {
    isSubscriptionActive: false,
    isFeatureAvailable: false,
    isInGracePeriod: false
  }

  // Check feature
  if (featureTier === 'basic') {
    if (companyInfo && companyInfo['subscription']) {
      if (['prod_LqdmZoEun67EcL', 'prod_MGXTFMyk9JMFbN'].includes(companyInfo.subscription.plan?.product)) {
        status['isFeatureAvailable'] = true
      }
    }
  } else if (featureTier === 'standard') {
    if (companyInfo && companyInfo['subscription']) {
      if (['prod_MjLp7YteNG903X', 'prod_MjLixr8gcOoYf5'].includes(companyInfo.subscription.plan?.product)) {
        status['isFeatureAvailable'] = true
      }
    }
  }

  // check payment status
  if (companyInfo && companyInfo['subscription'] && companyInfo.subscription['current_period_end']) {
    const subscriptionPeriodEndDate = companyInfo['subscription'].current_period_end * 1000
    const subscriptionGracePeriod = subscriptionPeriodEndDate + 12096e5
    const gracePeriodDate = new Date(subscriptionGracePeriod);
    const subscriptionEndDate = companyInfo['ended_at'] ? new Date(companyInfo.ended_at) : null
    const subscriptionStatus = companyInfo['subscription'].status
    const currentDate = new Date()

    if (currentDate <= new Date(subscriptionPeriodEndDate)) {
      status['isSubscriptionActive'] = subscriptionStatus === 'active' ? true : false
    } else if (subscriptionEndDate) {
      // Subscription cancelled
      status['isSubscriptionActive'] = false
    } else {
      if (currentDate <= gracePeriodDate) {
          // unable to process payment
          status['isInGracePeriod'] = true
      } else {
        status['isFeatureAvailable'] = false
      }
    }
  }

  return status
}
