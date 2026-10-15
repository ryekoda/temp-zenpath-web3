import React, { useState } from 'react';
import Image from 'next/image';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { CapitalizeFirstLetterOfEachWord } from '@/lib/GlobalFunctions';

import '@/components/old/CheckoutForm.css'



const CheckoutForm = ({ plan, isMonthlyPayment, seats }) => {
    const item = {
        price: plan.price,
        seats: seats,
        subTotal: plan.price * seats,
        total: (plan.price * seats) * (isMonthlyPayment ? 1 : 12)
    }
    const stripe = useStripe();
    const elements = useElements();
    const [isBuyButtonDisabled, setIsBuyButtonDisabled] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null);


    // function getClientReferenceId() {
    //   const clientRef = (window.Rewardful && window.Rewardful.referral) || ('checkout_'+(new Date).getTime())

    //   return clientRef;
    // }
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsBuyButtonDisabled(true)
    if (!stripe || !elements) {
      return;
    }
    // https://example.com/order/123/complete
    const {error} = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: 'https://www.usezenpath.com/'
      }
    });
    // clientReferenceId: getClientReferenceId()

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }

    setIsBuyButtonDisabled(false)
  };

  return (
    <form onSubmit={ handleSubmit }>
        <div style={{ display: 'flex' }}>
            <div style={{ width: '50%', padding: '0px 50px 0px 0px' }}>
                <PaymentElement />
            </div>

            <div style={{ width: '50%', padding: '0px 0px 0px 50px' }}>
                <div style={{ width: '150px', height: '150px', margin: '0 auto' }}>
                    <Image src="/images/Thumb.svg" alt="thumb icon" width={150} height={150}/>
                </div>
                <p style={{ margin: '0 auto', textAlign: 'center', fontSize: '15px', marginTop: '14px' }}>Prorated Money Back Guarantee</p>

                <div style={{ display: 'flex', marginTop: '50px' }}>
                    <p style={{ margin: '0px' }}>{ CapitalizeFirstLetterOfEachWord(plan.title) } plan { item.seats } { item.seats > 1 ? 'seats' : 'seat' }</p>

                    {
                      isMonthlyPayment ?
                        <p style={{ margin: '0px', marginLeft: 'auto' }}>{ '$' + item.total }</p>
                      :
                        <p style={{ margin: '0px', marginLeft: 'auto' }}>{ '($' + item.subTotal } x { '12 months)' } { '$' + item.total }</p>
                    }
                </div>
                {/*<p style={{ margin: '0px', marginLeft: 'auto' }}>{ isMonthlyPayment ? '$' + item.total : '($' + item.subTotal } x { '12 months)' } { '$' + item.total }</p>*/}
                <div style={{ display: 'flex', marginTop: '50px', paddingBottom: '10px' }}>
                    <p style={{ margin: '0px', fontWeight: 'bold' }}>Total</p>
                    <p style={{ margin: '0px', marginLeft: 'auto', fontWeight: 'bold' }}>${ item.total }</p>
                </div>
                {/* <Divider width={ '100%' } height={ '1px' } color={ 'lightGray' } /> */}
                <button className={ (!stripe || isBuyButtonDisabled) ? 'zIm0e disabled' : 'zIm0e' } disabled={!stripe || isBuyButtonDisabled}>Submit Purchase</button>
    
                {errorMessage && <div style={{ fontSize: '14px', color: 'red' }}>{errorMessage}</div>}
            </div>
        </div>
    </form>
  )
};

export default CheckoutForm;