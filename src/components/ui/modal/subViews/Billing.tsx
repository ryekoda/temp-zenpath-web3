"use client"
import { FC, useState, useEffect } from 'react';
import Image from 'next/image';
import { GetPaymentMethod } from '@/helpers/stripe/Stripe';
import { CapitalizeFirstLetterOfEachWord } from '@/lib/GlobalFunctions';



interface Props {
    userInfo: any
    stripeInfo: any
    company: any
    isShowingCheckout: any
    setIsShowingCheckout: any
    boardUID: any
    isToolTipOpen: any
    setIsToolTipOpen: any
    setCurrentTooltip: any
    handleModalOpen: any
    handleToolTipOpen: any
}

const Billing_Container: React.FC<Props> = ({ userInfo, stripeInfo, company, isShowingCheckout, setIsShowingCheckout, boardUID, isToolTipOpen, setIsToolTipOpen, setCurrentTooltip, handleModalOpen, handleToolTipOpen }) => {
  const [paymentInfo, setPaymentInfo]: any = useState()
  const [nextBillDate, setNextBillDate]: any = useState()
  const monthNames: any = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  
  useEffect(() => {
    getPaymentMethod(company, stripeInfo)
  }, [])


  async function getPaymentMethod(companyInfo: any, stripeInfo: any) {
    if (companyInfo['subscription']) {
      const paymentMethodUID = companyInfo.subscription['default_payment_method']

      const paymentMethod = await GetPaymentMethod(paymentMethodUID, stripeInfo.baseURL)
      const paymentCardInfo = paymentMethod.card
      setPaymentInfo(paymentCardInfo)
  
      var subscriptionRenewDate = new Date(company.subscription.current_period_end * 1000);
      setNextBillDate(subscriptionRenewDate)
    }
  }
  
  function moreOptionsPressed() {
    setIsToolTipOpen(!isToolTipOpen)
    setCurrentTooltip('modal')
  }

    
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'scroll' }}>
        {
          (company.subscription && company.subscription.status === 'active' && paymentInfo) ?
            <>
                    <div style={{ width: '600px', margin: '0 auto' }}>
          <h2 style={{ margin: '0px', marginTop: '30px', fontSize: '20px', fontWeight: '600' }}>Payment method for your team: { CapitalizeFirstLetterOfEachWord(company.title) }</h2>
          <div style={{ width: '600px', height: '200px', border: '1px solid gray', borderRadius: '5px', marginTop: '30px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ padding: '20px 20px 20px 20px' }}>
              {
                paymentInfo &&
                  <div style={{ height: '100%' }}>
                    <div style={{ height: '100px' }}>
                      <p style={{ margin: '0px', fontSize: '18px', fontWeight: 'bold' }}>{ CapitalizeFirstLetterOfEachWord(paymentInfo.brand) } •••• { paymentInfo.last4 }</p>
                      <p style={{ margin: '0px', marginTop: '14px', fontSize: '15px' }}>Expires { monthNames[paymentInfo.exp_month - 1] } { paymentInfo.exp_year }</p>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                      <button style={{ width: '100%', height: '40px', border: 'none' }}>Change</button>
                    </div>
                  </div>
              }
            </div>
          </div>
          <p>To remove your payment option, cancel your subscriptions below</p>
        </div>
  
        <div style={{ width: '600px', margin: '0 auto' }}>
          <h2 style={{ margin: '0px', marginTop: '50px', fontSize: '20px', fontWeight: '600' }}>Subscriptions for your team: { CapitalizeFirstLetterOfEachWord(company.title) }</h2>
          <div style={{ width: '600px', height: '200px', border: '1px solid gray', borderRadius: '5px', marginTop: '30px' }}>
            <div style={{ padding: '20px 20px 20px 20px' }}>
              {
                paymentInfo &&
                  <div>
                    <div style={{ height: '100px' }}>
                      <p style={{ margin: '0px', fontSize: '18px', fontWeight: 'bold' }}>{ (company.subscription.plan.product === 'prod_LqdmZoEun67EcL' || company.subscription.plan.product === 'prod_MGXTFMyk9JMFbN') ? 'Basic' : '' } plan</p>
                      <p style={{ margin: '0px', marginTop: '14px', fontSize: '15px' }}>{ company.subscription.cancel_at_period_end ? 'Plan ends' : 'Next bill'} on { nextBillDate && monthNames[nextBillDate.getMonth()] + nextBillDate.getDate() + ', ' + nextBillDate.getFullYear() }</p>
                      <p style={{ margin: '0px', marginTop: '2px', fontSize: '15px' }}>{ '$'+ ((company.subscription.plan.amount * company.subscription.quantity) / 100) + '/' + company.subscription.plan.interval } • { CapitalizeFirstLetterOfEachWord(paymentInfo.brand) } •••• { paymentInfo.last4 }</p>
                    </div>
  
                    <div style={{ marginTop: '20px' }}>
                      <button style={{ width: '88%', height: '40px', border: 'none' }}>Change plan</button>
                      <div className='fgsmQ' style={{ width: '10%', height: '40px', border: 'none', float: 'right', borderRadius: '5px' }} onClick={ (e) => handleToolTipOpen('billingOptions', e) }>
                        <div style={{ width: '24px', height: '24px', margin: '0 auto', marginTop: '8px' }}>
                          <Image className='' src="/images/More.svg" alt="more icon" width={24} height={24}/>
                        </div>
                      </div>
                    </div>
                  </div>
              }
            </div>
          </div>
        </div>
            </>
          :
          <>
            <div style={{ width: '200px', margin: '0 auto' }}>
              <h3 style={{ margin: '0px', textAlign: 'center', marginTop: '200px' }}>Current plan: Free</h3>
              <button style={{ width: '120px', margin: '0 auto', display: 'block', marginTop: '20px', height: '40px' }} onClick={ () => handleModalOpen('pricing') }>Upgrade Plan</button>
            </div>
          </>
        }
  
    </div>
  )
}


export default Billing_Container