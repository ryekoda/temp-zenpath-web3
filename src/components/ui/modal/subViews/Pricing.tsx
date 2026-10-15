"use client"
import { FC, useState } from 'react';
import { TailSpin } from  'react-loader-spinner';
import Input from '@/components/ui/input/Input';
import PricePlan from '@/components/PricingPlan';
import Switch from '@/components/ui/Switch';
import { UpdateCompany } from '@/helpers/database/Companies';
import { CreateStripeCustomer, CreateSubscription, UpdateSubscription, GetPaymentMethod } from '@/helpers/stripe/Stripe';
import { GetPlans, SubscriptionStatus, GetTeamSizeOptions } from '@/lib/GlobalFunctions';
import Checkout_Container from './Checkout';



interface Props {
    userInfo: any
    stripeInfo: any
    isShowingCheckout: any
    setIsShowingCheckout: any
    boardUID: any
    company: any
    onDismiss: any
    dbURL: any
}

const Pricing_Container: React.FC<Props> = ({ userInfo, stripeInfo, isShowingCheckout, setIsShowingCheckout, boardUID, company, onDismiss, dbURL }) => {
    const [isMonthlyPayment, setIsMonthlyPayment] = useState(false)
    const [seats, setSeats] = useState(3);
    const [clientSecret, setClientSecret] = useState()
    const [selectedPlan, setSelectedPlan] = useState(GetPlans(isMonthlyPayment, stripeInfo.isLive)[0])
    const [isContinueButtonDisabled, setIsContinueButtonDisabled] = useState(false)
    // const history = useHistory();
  
    const handleChange = (event: any) => { setSeats(event.target.value) };
  
    function planSelected(plan: any) { 
      setSelectedPlan(plan)
    }
  
    function getClientReferenceId() {
      // const clientRef = (window.Rewardful && window.Rewardful.referral) || ('checkout_'+(new Date).getTime())
      const clientRef = ''
      return clientRef;
    }
  
    async function continueButtonPressed() {
      if (selectedPlan.index === 0) {
        onDismiss(true)
      } else {
        setIsContinueButtonDisabled(true)

        const isPaidSubscription = (SubscriptionStatus(company).isSubscriptionActive || SubscriptionStatus(company).isInGracePeriod) ? true : false
        if (!isPaidSubscription) {
          if (selectedPlan && selectedPlan.index !== 0) {
            const plan = GetPlans(isMonthlyPayment, stripeInfo.isLive)[selectedPlan.index]
            setIsShowingCheckout(true)
            const clientSecret = await createSubscription(userInfo, boardUID, stripeInfo, plan, seats, getClientReferenceId())
            if (clientSecret) {
              setClientSecret(clientSecret)
            }

            setIsContinueButtonDisabled(false)
          } else {
            setIsContinueButtonDisabled(false)
          }
        } else {
          setIsContinueButtonDisabled(false)
        }
      }
    }


    async function createSubscription(userInfo: any, boardUID: any, stripeInfo: any, plan: any, seats: any, clientReferenceId: any) {
      let stripeCustomerUID = stripeInfo.isLive ? userInfo['stripeUID'] : userInfo['stripeUID_test']
  
      if (stripeCustomerUID) {
        const subscriptionData: any = await CreateSubscription(stripeCustomerUID, stripeInfo.baseURL, plan, seats, clientReferenceId)
        if (subscriptionData) {           
          const subscriptionId = subscriptionData['id']          
          const payment_intent = subscriptionData['latest_invoice'].payment_intent
          const clientSecret = payment_intent['client_secret']      
          await UpdateCompany(boardUID, stripeInfo.isLive ? 'subscriptionUID' : 'testSubscriptionUID', subscriptionId, dbURL).catch((err: any) => console.log('company error: ', err));
          return clientSecret
        }
      } else {
        const customer: any = await CreateStripeCustomer(userInfo.id, userInfo.email, stripeInfo.baseURL, dbURL, stripeInfo.isLive)
        if (customer) {
          const stripeCustomerUID = customer.id
          const subscriptionData: any = await CreateSubscription(stripeCustomerUID, stripeInfo.baseURL, plan, seats, clientReferenceId)
          if (subscriptionData) {           
            const subscriptionId = subscriptionData['id']          
            const payment_intent = subscriptionData['latest_invoice'].payment_intent
            const clientSecret = payment_intent['client_secret']       
            await UpdateCompany(boardUID, stripeInfo.isLive ? 'subscriptionUID' : 'testSubscriptionUID', subscriptionId, dbURL).catch((err: any) => console.log('company error: ', err));
            return clientSecret
          }
        }
      }
    }
  
  
    return (
      <>
        {
          isShowingCheckout ?
            <>
              {
                (clientSecret) ?
                  <Checkout_Container stripeInfo={ stripeInfo } clientSecret={ clientSecret } plan={ GetPlans(isMonthlyPayment, stripeInfo.isLive)[selectedPlan.index] } isMonthlyPayment={ isMonthlyPayment } seats={ seats }  />
                :
                  <div>
                    <div style={{ width: '80px', height: '80px', margin: '0 auto',  marginTop: '200px', display: 'block' }}>
                      <TailSpin color="gray" height={ 80 } width={ 80 } />
                    </div>
                    <p style={{ margin: '0px', marginTop: '40px', textAlign: 'center', color: 'gray' }}>Loading...</p>
                  </div>
              }
            </>
          :
            <div style={{ position: 'relative', minHeight: '80vh' }}>
  
              <div style={{ width: '100%', height: '70vh', overflow: 'scroll', scrollbarWidth: 'thin' }}>
                <div style={{ width: '90%', margin: '0 auto' }}>
                  <div className='NB4ru'>
                    <h1 className='GqdzD'>Choose the right plan for your team</h1>
                    <h3 style={{ textAlign: 'center', color: '#494949' }}>You have reached your monthly limit, choose your team plan</h3>
                  </div>
  
                  <Switch isOn={ isMonthlyPayment } handleToggle={ () => setIsMonthlyPayment(!isMonthlyPayment) } />
  
                  <div style={{ marginTop: '20px', width: '150px' }}>
                    <label>
                      Choose team size:
                      <Input name={ 'seats' } frameType='dropDown' inputValue={ seats } options={ GetTeamSizeOptions().map(a => a.label) } onChange={ (e: any) => handleChange(e) }/>
                    </label>
                  </div>
  
                  <div className="CE4MC_" id="REO9f_" style={{ display: 'flex', paddingBottom: '100px' }}>
                    <div className='pSP3x'>
                      {
                        GetPlans(isMonthlyPayment, stripeInfo.isLive).map(plan => (
                          <PricePlan key={ plan.title } plan={ plan } seats={ seats } isMonthlyPayment={ isMonthlyPayment } onTap={ planSelected } selectedPlan={ selectedPlan } isCheckout={ true } />
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>
  
              {
                !isShowingCheckout &&
                  <div className='ALrIN'>
                    {/* <Divider width={ '100%' } height={ '1px' } color={ 'lightGray' } /> */}
                    <button className='kK4NS' onClick={ continueButtonPressed } disabled={ isContinueButtonDisabled }>Continue</button>
                  </div>
              }
            </div>
        }
      </>
    )
}


export default Pricing_Container