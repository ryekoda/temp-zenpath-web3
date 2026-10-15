import { FC } from "react";
import '../components/old/PricingPlan.css';



interface nameProps {
  isCheckout: any
  selectedPlan?: any
  plan: any
  seats: any
  isMonthlyPayment: any
  onTap: any
}

const PricePlan: FC<nameProps> = ({ isCheckout, selectedPlan, plan, seats, isMonthlyPayment, onTap }) => {
  return (
    <div className='s2FGw'>

      {
        isCheckout &&
          <div style={{ paddingTop: '12px', paddingBottom: '20px' }}>
            <div className='yIw6i' style={{ border: selectedPlan && selectedPlan.index === plan.index ? '2px solid #717FF6' : '2px solid gray', backgroundColor: selectedPlan && selectedPlan.index === plan.index ? '#717FF6' : 'white' }} onClick={ () => onTap(plan) }>
              <div style={{ width: '10px', height: '10px', borderRadius: '50px', margin: '0 auto', backgroundColor: 'white', marginTop: '5px' }}></div>
            </div>
          </div>
      }

      <div className='kAVdy' id={ selectedPlan && selectedPlan.index === plan.index ? 'LeN8V' : plan.isRec ? 'XVzxb' : 'shZNm' } onClick={ () => onTap(isCheckout ? plan : null) }>
        <div className='zrsRq' id={ plan.isRec ? 'eZ5au' : 'AcIBu' }></div>

        <div className='Dnil1'>
          <h1 className='JpiWU'>{ plan.title }</h1>

          <div className='nKvy1'>
            <p className='vwKwq' id={ plan.isRec ? 'DD79s' : 'CoxID' }>{ '$' + plan.price }</p>
            <div className='tRjsP'>
              <p className='pu5DQ' id='M5qJY'>{ 'seat / ' }</p>
              <p className='pu5DQ' id=''>{ 'month' }</p>
            </div>
          </div>

          <div className='fqiF6'>
            <p className='bL6XT' id='UpSk3'>{ plan.index !== 0 ? 'Total: $' + (plan.price * seats) + ' / ' + 'month' : '' }</p>
            <p className="bL6XT" id='A2FpD'>{ plan.index !== 0 ? isMonthlyPayment ? 'Billed monthly' : 'Billed annually' : 'FREE' }</p>
          </div>

          {
            !isCheckout &&
              <button className='mGkQt' id={ plan.isRec ? 'Q1Qpq' : 'GFdI4' } onClick={ () => onTap(plan) }>Try for free</button>
          }

          <p className='ApKaU'>{ plan.note }</p>
          <p className="IMPqs">{ plan.details }</p>




          <div className='AakBN'>
            {
              plan.perks.map((perk: any) => (
                <div key={ perk } className="wOshq">
                  <p className='hkr6J'>{ perk }</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}



export default PricePlan
