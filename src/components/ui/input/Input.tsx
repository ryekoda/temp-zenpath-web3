"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Paragraph from '@/components/ui/Paragraph';
import { CapitalizeFirstLetter, GetDropDownOptions } from '@/lib/GlobalFunctions';

import DropDrown from './subViews/DropDrown';
import Address from './subViews/Address';
import { Radio, Checkbox_Container } from './subViews/Input_Views';
import { GetPreviousAddressSuggestions } from './Actions';



interface Props {
  name: string
  title?: string
  frameType: any
  type?: any
  inputValue: any
  placeholder?: any
  onChange?: any
  autoCompleteData?: any
  options?: any
  field?: any
  selectedItem?: any
  allDrivers?: any
  allClients?: any
  tripHistory?: any
  allowAddressSuggestion?: any
  allowPreviousAddressSuggestions?: any
  errorCode?: any
  hideRequiredAsterisk?: any
  required?: any
  isDisabled?: any
}

const Input: React.FC<Props> = ({ name, title, frameType, type, inputValue, placeholder, onChange, autoCompleteData, options, field, selectedItem, allDrivers, allClients, tripHistory, allowAddressSuggestion, allowPreviousAddressSuggestions, errorCode, hideRequiredAsterisk, required, isDisabled }) => {
  const [value, setValue]: any = useState('')
  const [isNewAddress, setIsNewAddress] = useState(true)
  const [isChecked, setIsChecked] = useState(false)



  useEffect(() => {
    setValue(inputValue ? inputValue : '')
    // setValue(inputValue)

    if (name === '67300') {
      setIsNewAddress(inputValue ? true : false)
    }
  }, [inputValue])

  useEffect(() => {
    if (frameType === 'checkbox') {
      if (name === selectedItem) {
        setIsChecked(true)
      } else {
        setIsChecked(false)
      }
    }
  }, [ selectedItem ])
 

  function InputChanged(e: any) {
    const newValue = e
    let item: any = { target: { 'name': name } }
    
    if (name === '97264' || name === '16538') {
      item.target['value'] = newValue.toDate()
    } else {
      item.target['value'] = newValue
    }

    onChange(item)
  }

  function toggleChange(e: any) {
    setIsNewAddress(!isNewAddress)

    const target = e.target
    const targetValue = target.checked
    const item = { target: { 'name': name, 'value': targetValue ? '' : inputValue } }
    onChange(item)
  }

  function checkboxChanged(e: any) {
    setIsChecked(!isChecked)

    const target = e.target

    const targetValue = target.checked
    const item = { target: { 'name': name, 'value': targetValue ? '' : inputValue } }
    onChange(item)
  }


  return (
    <div>
      <Paragraph size='xs' className="font-medium text-left mt-4" style={{ display: title ? 'block' : 'none' }}>
        <span>
          { CapitalizeFirstLetter(title) }
          <span className='ml-[2px] text-red-600'>{ (required && !hideRequiredAsterisk) && '*' }</span>
        </span>
      </Paragraph> 

      {
        (frameType === 'text' || frameType === 'number' || frameType === 'phone') ?
          <input className='dark:bg-white w-full p-3 border-solid border border-slate-400 rounded-md' name={ name } placeholder={ placeholder } type={ type } value={ value } onChange={ (e) => onChange(e) } required={ required }/>
        : frameType === 'longText' ?
          <textarea className='dark:bg-white w-full p-2 border-solid border border-slate-400 rounded-md' style={{ resize: 'none' }} name={ name } rows={8} value={ value } onChange={ (e) => onChange(e) } required={ required }/>
        : frameType === 'dropDown' ?
          <DropDrown name={ name } type={ name === '71130' ? 0 : 1 } value={ value } autoCompleteData={ autoCompleteData } options={ (options && options.length > 0) ? options : GetDropDownOptions(name, options, field, allDrivers) } onChange={ onChange } errorCode={ errorCode } errorMessage='Enter client first & last name' isRequired={ required }/>
        : frameType === 'address' ?
          <>
            {
              allowAddressSuggestion ?
                <>
                  <Checkbox_Container title='Client Home' isChecked={ !isNewAddress } onChange={ toggleChange }/>

                  {
                    (isNewAddress) &&
                      <Address name={ name } value={ typeof value === 'object' ? value.address : value } onChange={ onChange }/>
                  }
                </>
              :
                <>
                  {
                    allowPreviousAddressSuggestions ?
                      <>
                        {
                          GetPreviousAddressSuggestions(tripHistory).map((address, index) => (
                            <>
                              <Radio key={ index } title={ address.address } isChecked={ (value && address && value['latLng'] && address['latLng'] && address.latLng.lat === value.latLng.lat && address.latLng.lng === value.latLng.lng) } onChange={ toggleChange }/>
                            </>
                          ))
                        }

                        <Radio title='Other' isChecked={ isNewAddress } onChange={ toggleChange }/>

                        {
                          isNewAddress &&
                            <Address name={ name } value={ typeof value === 'object' ? value.address : value }/>
                        }
                      </>
                    :
                      <Address name={ name } value={ typeof value === 'object' ? value.address : value } onChange={ onChange }/>
                  }
                </>
            }
          </>
        : frameType === 'time' ?
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['TimePicker']}>
              <TimePicker value={ value ? dayjs(value) : dayjs(new Date()) } onChange={ (e) => InputChanged(e) }/>
            </DemoContainer>
          </LocalizationProvider>
        : frameType === 'date' ?
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker value={ value ? dayjs(value) : dayjs(new Date()) } onChange={ (e) => InputChanged(e) }/>
          </LocalizationProvider>
        : frameType === 'checkbox' ?
          <Checkbox_Container isChecked={ isChecked } onChange={ checkboxChanged }/>
        : frameType === 'signature' ?
          <Image src={ value } alt='signatureImage' width={60} height={60} />
        : frameType === 'submit' &&
          <input className='w-full mt-[10px] bg-[#26C797] hover:bg-[#41b794] text-white font-semibold p-3 rounded-md hover:cursor-pointer' type={ type } value={ value } disabled={ isDisabled }/>
      }
    </div>
  )
}


export default Input;
