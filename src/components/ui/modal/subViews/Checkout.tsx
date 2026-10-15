"use client"
import { FC } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';



interface Props {
    stripeInfo: any
    clientSecret: any
    plan: any
    isMonthlyPayment: any
    seats: any
}

const Checkout_Container: React.FC<Props> = ({ stripeInfo, clientSecret, plan, isMonthlyPayment, seats }) => {
    const stripePromise = loadStripe(stripeInfo.pubKey);
    const stripeOptions = { clientSecret: clientSecret, appearance: {}, };
  
  
    return (
      <div style={{ width: '100%', height: '100vh', overflow: 'scroll' }}>
        <div style={{ width: '60%', margin: '0 auto', position: 'relative' }}>
          <h1 style={{ margin: '0px', textAlign: 'center', marginTop: '20px' }}>Checkout</h1>
  
          <div style={{ width: '100%', marginTop: '20px' }}>
            <Elements stripe={ stripePromise } options={ stripeOptions }>
              <CheckoutForm plan={ plan } isMonthlyPayment={ isMonthlyPayment } seats={ seats } />
            </Elements>
          </div>
        </div>
      </div>
    )
}


export default Checkout_Container