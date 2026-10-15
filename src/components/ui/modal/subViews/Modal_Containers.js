import React, { useState, useEffect, useRef } from 'react';
import validator from 'validator';
import { TailSpin } from  'react-loader-spinner';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { parse } from 'papaparse';
import Confetti from 'react-confetti';
import { UpdateSubscription } from '@/helpers/stripe/Stripe';
// import Divider from '../../../components/divider/Divider';
// import Switch from '../../../components/switch/Switch';
// import PricePlan from '../../../components/pricePlan/PricePlan';
// import CheckoutForm from '../../../components/checkoutForm/CheckoutForm.js';
import { CapitalizeFirstLetterOfEachWord, FormatDate, AbriviateWord, GetPlans, SubscriptionStatus, GetTeamSizeOptions, WordCount } from '@/lib/GlobalFunctions';
// import closeIcon from '../../../assets/images/close.png';
// import ProfileIcon from '../../../assets/images/Profile.svg';
// import moreIcon from '../../../assets/images/More.svg';
// import AppStoreIcon from '../../../assets/images/AppStore.png';
// import GooglePlayIcon from '../../../assets/images/GooglePlay.png';
// import DriverIcon from '../../../assets/images/Driver.png';

import { createSubscription, getPaymentMethod, InputTypes, determineType, StartImport, updateSubscription, cancelSubscription } from '../Actions';
import '../Modal.css';



export const TooltipContainer = ( props ) => {
  const { name, data, showModal } = props



    return (
      <>
        {
          name === 'billingOptions' ?
            <div style={{ width: '200px' }}>
                <button className='WGi5g' onClick={ () => showModal('manageSeats', true) }>{ 'Manage seats' }</button>
                {/* <Divider width={ '100%' } height={ '1px' } color={ 'lightGray' } /> */}
                <button className='WGi5g' onClick={ () => showModal('cancelSubscription', true) }>{ 'Cancel subscription' }</button>
            </div>
          :
          <></>
        }
      </>
    )
  }

export const ActivityCell = ({ data }) => {
  const message = (type) => {
    switch (type) {
      case 'changedTripStatus':
        return 'changed trip status'
        break;
    }
  }

  

  return (
    <div style={{ display: 'flex', paddingBottom: '20px' }}>
      {
        data && data['info'] &&
          <>
            <div style={{ width: '13%' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50px', backgroundColor: 'lightGray', overflow: 'hidden' }}>
                <p style={{ margin: '0px', width: '100%', textAlign: 'center', fontWeight: 'bold', marginTop: '8px' }}>{ AbriviateWord(data.name) }</p>
              </div>
            </div>

            <div style={{ width: '87%', display: 'block' }}>
              <p style={{ wordWrap: 'break-word', margin: '0px', fontSize: '15px' }}><span style={{ fontWeight: 'bold' }}>{ CapitalizeFirstLetterOfEachWord(data.name) }</span> { message(data.type) }</p>
              <p style={{ wordWrap: 'break-word', margin: '0px', fontSize: '15px', marginTop: '4px' }}>{ (data.info['oldValue'] ? data.info['oldValue'] : '') + ' → ' + data.info.value }</p>

              {
                data.info['desc'] &&
                  <div style={{ paddingTop: '4px', paddingBottom: '10px' }}>
                    <p style={{ wordWrap: 'break-word', margin: '0px', fontSize: '13px', marginTop: '8px' }}>Driver Notes: </p>
                    <p style={{ wordWrap: 'break-word', margin: '0px', fontSize: '13px', marginTop: '2px', color: 'gray', fontSyle: 'italic' }}>{ "\"" + data.info['desc'] + "\"" }</p>
                  </div>
              }

              <p style={{ wordWrap: 'break-word', margin: '0px', color: 'gray', fontSize: '13px', marginTop: '4px' }}>{ FormatDate(data.createdAt.toDate()) + ' at ' + data.createdAt.toDate().toLocaleTimeString('en-US') }</p>
            </div>
          </>
      }
    </div>
  )
}

export const Header = ( props ) => {
  const { title, onDismiss } = props


  return(
      <div className='ZTmlQ' style={{ paddingBottom: title ? '10px' : '40px' }}>             
          <h2 className='kCvoP'>{ CapitalizeFirstLetterOfEachWord(title) }</h2>
      
          <div className='vjLfa' onClick={ onDismiss }>
              <img src={ closeIcon } alt='closeIcon' style={{ maxHeight: '100%' }} />
          </div>
      </div>
  )
}


// MARK: -------  Delete Board 
export const DeleteBoard_Container = ( props ) => {
  const { company, onDismiss } = props



  function deleteBoardButtonPressed() {
    // DeleteBoardPressed(company.id, function(success) {
    //   if (success) {
    //     // history.push('/')
    //   }
    // })
  }


  return (
    <>
      <p style={{ width: '100%', textAlign: 'center', marginTop: '40px' }}>Are you sure you want to delete: <span style={{ fontWeight: 'bold' }}>{ CapitalizeFirstLetterOfEachWord(company.title) }</span>?</p>
      <div style={{ display: 'flex', width: '50%', margin: '0 auto', position: 'relative' }}>
        <div style={{ padding: '0px 4px 0px 4px' }}>
          <button className='Wbl1L' id='KCdeH' style={{ width: '100px', height: '34px' }} onClick={ onDismiss }>Cancel</button>
        </div>
        <div style={{ padding: '0px 4px 0px 4px', marginLeft: 'auto' }}>
          <button className='Wbl1L' id='JeKLG' style={{ width: '100px', height: '34px' }} onClick={ deleteBoardButtonPressed }>Delete</button>
        </div>
      </div>
    </>
  )
}


// MARK: -------  Import 
// export const Import_Container = ( props ) => {
//   const { companySettings } = props
//   const [step, setStep] = useState(0)
//   const [file, setFile] = useState()
//   const [fields, setFields] = useState(InputTypes('importTripEmployeeInfo', 'csv', null, companySettings)['importTripEmployeeInfo'].fields)
//   const [isNameCombined, setIsNameCombined] = useState(true)
//   const [clientNameOrderReversed, setClientNameOrderReversed] = useState(false)

//   const [selectedFileTitles, setSelectedFileTitles] = useState([])


//   // const handleChange = (event, title) => {

//   //   if (title === 'fName') {
//   //     // setFields()
//   //     // setLeadingColumn(event.target.value);
//   //   } else {
//   //     setLeadingColumn2(event.target.value);
//   //   }
//   // };

//   const rearangeName = () => {
//     if (fields && fields[0].value && fields[1].value) {
//       setFields(fields.map(item => {
//         if (item.name !== 'fName' && item.name !== 'lName') return item
//         if (item.name === 'fName') return {...item, value: fields[1].value }
//         if (item.name === 'lName') return {...item, value: fields[0].value }
//       }))
//     }
//   }

//   function startImport() {
//     // // const clients = []
//     // const trips = []

//     // file.result.data.map(item => {
//     //   // let client = {}
//     //   let trip = {}

//     //   for (let i = 0; i < fields.length; i++) {
//     //     const field = fields[i]
//     //     const name = field['name']
//     //     const fileHeader = field['fileHeader']

//     //     if (item[fileHeader]) {
//     //       const value = item[fileHeader].trim()
//     //       const rawValue = determineType(value).value
//     //       trip[name] = rawValue
   
//     //       // if (name === 'fName' || name === 'lName') {
//     //       //   client[name] = rawValue
//     //       // } else {
//     //       //   trip[name] = rawValue
//     //       // }
//     //     }
//     //   }

//     //   // if (client) {
//     //   //   clients.push(client)
//     //   // }

//     //   if (trip['fNmae'] || trip['lName']) {
//     //     trips.push(trip)
//     //   }
//     // })

//     // StartImport(companySettings.orgUID, trips)
//   }

//   const ref = useRef()
//   const handleClick = (e) => {
//     ref.current.click()
//   }

//   // const handleFileChange = event => {
//   async function handleFileChange(event) {

//     const fileObj = event.target.files && event.target.files[0];
//     if (!fileObj) {
//       return;
//     }


//     // 👇️ reset file input
//     event.target.value = null;

//     // 👇️ is now empty

//     // 👇️ can still access file object here
//     if (fileObj) {
//       const text = await fileObj.text()
//       const result = parse(text, { header: true });

//       setFile({ 'name': fileObj.name, 'result': result })
//       setStep(1)
//     }
//   };


//   return (
//     <div style={{ width: '100%', height: '100vh', overflow: 'scroll' }}>
//       <div style={{ width: '60%', margin: '0 auto', position: 'relative' }}>
//         {/* <h1 style={{ margin: '0px', textAlign: 'center', marginTop: '20px' }}>Import Data from Excel > to Zenpath</h1> */}

//         <div style={{ width: '100%', marginTop: '20px' }}>
//           {/* <p>Import Data</p> */}

//           {
//             step === 0 ? 
//               <div className='qEsCW' style={{ width: '600px', height: '300px', border: '2px dashed black' }} onClick={handleClick} onDragOver={ (e) => { e.preventDefault() } } 
//               onDrop={ (e) => { 
//                 e.preventDefault() 

//                 Array.from(e.dataTransfer.files)
//                   .filter((file) => file.type === 'text/csv')
//                   .forEach( async (file) => {
//                     const text = await file.text()
//                     const result = parse(text, { header: true });

//                     if (result) {
//                       setFile({ 'name': file.name, 'result': result })
//                       setStep(1)
//                     }

//                     // const text = await file.text()
//                     // setContacts( (existing) => [...existing, ...results.data] )
//                   })
//               } }>

//                 <p style={{ textAlign: 'center', marginTop: '120px', fontSize: '15px' }}>Drag file here or <span style={{ color: 'blue' }}>click to browse</span></p>
//                 <p style={{ textAlign: 'center', fontSize: '15px' }}>All .csv file types are supported</p>
//                 <input
//                   ref={ref}
//                   type="file"
//                   id="input_file"
//                   accept=".csv"
//                   style={{ display: 'none' }}
//                   onChange={handleFileChange}
//                 />
//               </div>
//             : step === 1 ?
//               <div>
//                 <p>imported: { file.name }</p>
//                 <button onClick={ () => setStep(2) }>Next</button>
//               </div>
//             : step === 2 ?
//               <div>
//                 <p>Map your data</p>
//                 {/* <p>Choose which column from the Excel file will appear as the client's name</p> */}

//                 <div style={{ display: 'flex' }}>
//                   {
//                      fields.slice(0, 2).map(field => (
//                       <div key={ field.name } style={{ width: '150px', padding: '0px 10px 0px 0px' }}>
//                         <div style={{ height: '80px' }}>
//                           {
//                             ((field.name === 'lName' && !fields[0].value) || (field.name === 'lName' && fields[0].value && field.value && isNameCombined)) ?
//                               <></>
//                             :
//                               <TempInput existingBoardKey={ field.name } file={ file } data={ fields } setData={ setFields } companySettings={ companySettings } setIsNameCombined={ setIsNameCombined } selectedFileTitles={ selectedFileTitles } setSelectedFileTitles={ setSelectedFileTitles } isNameImport={ true } />
//                           }
//                         </div>

//                         <p style={{ fontWeight: 'bold', margin: '0px' }}>{ field.name === 'fName' ? 'First Name' : 'Last Name' }</p>
//                         <p style={{ margin: '0px', marginTop: '8px' }}>{ field.value }</p>
//                       </div>
//                      ))
//                   }

//                   {
//                     (fields[0].value && fields[1].value && isNameCombined) &&
//                       <button style={{ height: '30px', margin: '104px 0px 0px 0px' }} onClick={ rearangeName }>Swap order</button>
//                   }
//                 </div>

//                 <button style={{ marginTop: '4px' }} onClick={ () => setStep(3) }>Next</button>
//               </div>
//             : step === 3 ?
//             <div>
//               <div style={{ display: 'flex' }}><p style={{ width: '150px' }}>Excel Columns</p><p style={{ width: '150px' }}>Existing board Columns</p></div>
//               {
//                 Object.keys(file.result.data[0]).filter(e => (fields.some(field => (field['name'] === 'fName' && field['fileHeader'] !== e)))).map(key => (
//                   <div key={ key } style={{ display: 'flex', paddingBottom: '20px' }}>
//                     <div style={{ display: 'block' }}>
//                       <p style={{ width: '150px', margin: '0px' }}>{ key }</p>
//                       <p style={{ margin: '0px', width: '150px', fontSize: '14px', color: 'gray' }}>{ file.result.data[0][key] }</p>
//                     </div>
//                     <TempInput excelKey={ key } file={ file } companySettings={ companySettings } data={ fields } setData={ setFields } setIsNameCombined={ setIsNameCombined } isNameImport={ false } />
//                   </div>
//                 ))
//               }

//               <button style={{ marginTop: '4px' }} onClick={ () => setStep(4) }>Next</button>
//             </div>
//             : step === 4 ?
//               <div>
//                 <p>Create new items</p>
//                 <p>Add all duplicates as new items to the board</p>
//                 <button onClick={ startImport }>Start import</button>
//               </div>
//             :
//             <></>
//           }

//         </div>
//       </div>
//     </div>
//   )
// }


const TempInput = ( props ) => {
  const { name, excelKey, existingBoardKey, file, companySettings, data, setData, setIsNameCombined, selectedFileTitles, setSelectedFileTitles, isNameImport } = props
  const [focusedKey, setFocusedKey] = useState(excelKey ? excelKey : existingBoardKey)
  const [focusedItem, setFocusedItem] = useState(data.filter((e) => e['fileHeader'] === excelKey ))
  const [fileData, setFileData] = useState(file && file.result.data[0])
  const [value, setValue] = useState('')

  // const [selectedFileTitles, setSelectedFileTitles] = useState([])

  // const [gg, setGG] = useState(data.filter((e) => e['fileHeader'] === focusedKey ))



  // function handleChange(e, name) {
  // function handleChange(e) {
  //   e.stopPropagation();

  //   const target = e.target
  //   const selectedItemKey = target.value
  //   // const excelItem = determineType(fileData[selectedItemKey] ? fileData[selectedItemKey] : fileData[excelKey])
  //   // const tem = fileData[selectedItemKey] ? fileData[selectedItemKey] : fileData[excelKey]


  //   if (data) {
  //     // setData(data.map(dataInfo => {
  //     //   if (dataInfo['fileHeader'] ? (dataInfo['fileHeader'] !== selectedItemKey) : (dataInfo.name !== (existingBoardKey ? existingBoardKey : selectedItemKey)) && dataInfo.name !== 'lName') return dataInfo
  //     //   if (dataInfo.name === 'fName') return (WordCount(excelItem.value) > 1 ? {...dataInfo, value: excelItem.value.split(" ")[0], fileHeader: excelKey } : {...dataInfo, value: excelItem.value, fileHeader: selectedItemKey })
  //     //   if (dataInfo.name === 'lName') return (existingBoardKey === 'fName' ? (WordCount(excelItem.value) > 1 ? {...dataInfo, value: excelItem.value.split(" ")[1], fileHeader: excelKey } : dataInfo) : {...dataInfo, value: excelItem.value, fileHeader: selectedItemKey })
  //     //   return {...dataInfo, value: excelItem.value, fileHeader: excelKey }
  //     // }))
  //   } else {
  //     // setData(item.value)
  //   }

  //   if (existingBoardKey === 'fName' && WordCount(excelItem.value) > 1) {
  //     setIsNameCombined(true)

  //     if (isNameImport) {
  //       const tem = fileData[selectedItemKey] ? selectedItemKey : excelKey  
  //       setSelectedFileTitles([tem])
  //     }
  //   } else {
  //     setIsNameCombined(false)

  //     // const tem = fileData[selectedItemKey] ? selectedItemKey : excelKey
  
  //     // let oldItems = [...selectedFileTitles]
  //     // if (!selectedFileTitles.includes(tem)) {
  //     //   oldItems.push(tem)
  //     // }

  //     // setSelectedFileTitles([tem])
  //   }
    //
  //   setValue(target.value);
  // }


  return (
    <div>
      {/* <select value={ value } onChange={ (e) => handleChange(e) } style={{ marginLeft: '0px', padding: '6px 6px 6px 6px', width: '150px', height: '44px', fontSize: 16, borderRadius: '5px', border: '1px solid #D9D9D9' }}>
        <option value=''>{ 'Choose a column from Excel' }</option>

        {
          isNameImport ?
            Object.keys(fileData).map((item) => (
              <option key={ item } value={ item }>{ item }</option>
            ))
          :
            companySettings.headers.filter(e => (e.uid !== '71130' && e.uid !== '46783' && e.uid !== '34057' && e.uid !== '10990')).map(header => (
              <option key={ header.uid } value={ header.uid } disabled={ determineType(fileData[focusedKey]).type === header.type ? false : true }>{ header.title }</option>
            ))
        }
      </select> */}

      <p style={{ margin: '0px', width: '100%', textAlign: 'right', fontSize: '12px', marginTop: '4px' }}>{ '' }</p>
    </div>
  )
}

const TaskAward = ({ name, width }) => {

  return (
    <div>
      {
        (name === 'firstTripScheduledTaskAward') &&
          <>
            <Confetti width={ width } numberOfPieces={ 1000 } recycle={ false } />
            <div style={{ width: '130px', margin: '0 auto', marginTop: '70px' }}>
              <img src={ DriverIcon } style={{ maxWidth: '100%' }} />
            </div>
            <h2 style={{ textAlign: 'center', margin: '0px', marginTop: '20px' }}>Congratulations!</h2>
            <p style={{ textAlign: 'center', margin: '0px', marginTop: '10px' }}>You are now ready for business.<br/>Download the Zenpath app to get your drivers started</p>
            <div style={{ width: '280px', display: 'flex', margin: '0 auto', textAlign: 'center', marginTop: '40px' }}>
              <a href="https://apps.apple.com/us/app/zenpath-fleet-management/id6443650553" target="__blank">
                <div style={{ width: '130px' }}>
                  <img src={ AppStoreIcon } style={{ maxWidth: '100%' }} />
                </div>
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.zenpath.app" target="__blank" style={{ marginTop: '3px', marginLeft: '20px' }}>
                <div style={{ width: '130px' }}>
                  <img src={ GooglePlayIcon } style={{ maxWidth: '100%' }} />
                </div>
              </a>
            </div>
          </>
      }
    </div>
  )
}


// MARK: -------  Manage Seats 
export const ManageSeats_Container = ( props ) => {
  const { company, stripeInfo, onDismiss } = props
  const [seats, setSeats] = useState(company.subscription.quantity);


  async function saveButtonPressed() {
    await UpdateSubscription(company.subscription.id, company.subscription.items.data[0].id, 'seats', seats, stripeInfo.baseURL).catch((err) => console.log('subscription error: ', err)); 
    onDismiss(true)
  }

  const handleChange = (event) => {
    setSeats(event.target.value);
  };
  
    return (
      <>
        <div style={{ marginTop: '20px', paddingBottom: '40px' }}>
            <label>
              Choose team size:
              <select value={ seats } onChange={ handleChange } style={{ marginLeft: '10px', padding: '6px 6px 6px 6px', width: '150px', fontSize: 16, borderRadius: '5px', border: '1px solid #D9D9D9' }}>
                { 
                  GetTeamSizeOptions().map((option) => (
                    <option key={ option.value } value={ option.value }>{ option.label }</option>
                  ))
                }
              </select>
            </label>
        </div>
        <div style={{ display: 'flex', width: '50%', margin: '0 auto', position: 'relative' }}>
          <div style={{ padding: '0px 4px 0px 4px', marginLeft: 'auto', marginTop: '10px' }}>
            <button className='Wbl1L' id='JeKLG' style={{ width: '200px', height: '34px', margin: '0 auto' }} onClick={ saveButtonPressed }>Save</button>
          </div>
        </div>
      </>
    )
}


// MARK: -------  Cancel Subscription 
export const CancelSubscription_Container = ( props ) => {
  const { company, stripeInfo, onDismiss } = props


  async function cancelSubscriptionButtonPressed() {
    await UpdateSubscription(company.subscription.id, null, 'cancel', true, stripeInfo.baseURL).catch((err) => console.log('subscription error: ', err)); 
    onDismiss(true)
  }

  return (
    <>
      <p style={{ width: '100%', textAlign: 'center', marginTop: '40px' }}>Are you sure you want to cancel your subscription?</p>
      <div style={{ display: 'flex', width: '50%', margin: '0 auto', position: 'relative' }}>
        <div style={{ padding: '0px 4px 0px 4px', marginLeft: 'auto', marginTop: '10px', paddingBottom: '14px' }}>
          <button className='Wbl1L' id='JeKLG' style={{ width: '200px', height: '34px', margin: '0 auto' }} onClick={ cancelSubscriptionButtonPressed }>Continue cancellation</button>
        </div>
      </div>
    </>
  )
}