"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { cn } from '@/lib/cn';
import { CapitalizeFirstLetter } from '@/lib/format/text';
import { GetDropDownOptions } from '@/lib/tables/columns';
import { fieldClassName, labelClassName, pickerSx, textareaClassName } from './fieldStyles';

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
      // A cleared or half-typed picker gives null or an invalid date; save no value rather than an Invalid Date
      item.target['value'] = newValue?.isValid() ? newValue.toDate() : null
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


  const fieldId = `field-${name}`

  return (
    <div className={ cn(frameType !== 'submit' && 'mt-4 first:mt-0') }>
      {
        title &&
          <label htmlFor={ fieldId } className={ labelClassName }>
            { CapitalizeFirstLetter(title) }
            {
              (required && !hideRequiredAsterisk) &&
                <>
                  <span aria-hidden="true" className='ml-0.5 text-status-danger'>*</span>
                  <span className='sr-only'> (required)</span>
                </>
            }
          </label>
      }

      {
        (frameType === 'text' || frameType === 'number' || frameType === 'phone') ?
          <input id={ fieldId } className={ fieldClassName } name={ name } placeholder={ placeholder } type={ type } value={ value } onChange={ (e) => onChange(e) } required={ required }/>
        : frameType === 'longText' ?
          <textarea id={ fieldId } className={ textareaClassName } name={ name } rows={5} value={ value } onChange={ (e) => onChange(e) } required={ required }/>
        : frameType === 'dropDown' ?
          <DropDrown id={ fieldId } name={ name } type={ name === '71130' ? 0 : 1 } value={ value } autoCompleteData={ autoCompleteData } options={ (options && options.length > 0) ? options : GetDropDownOptions(name, options, field, allDrivers) } onChange={ onChange } errorCode={ errorCode } errorMessage='Enter client first & last name' isRequired={ required }/>
        : frameType === 'address' ?
          <>
            {
              allowAddressSuggestion ?
                <>
                  <Checkbox_Container title='Client Home' isChecked={ !isNewAddress } onChange={ toggleChange }/>

                  {
                    (isNewAddress) &&
                      <Address id={ fieldId } name={ name } value={ typeof value === 'object' ? value.address : value } onChange={ onChange }/>
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
                            <Address id={ fieldId } name={ name } value={ typeof value === 'object' ? value.address : value }/>
                        }
                      </>
                    :
                      <Address id={ fieldId } name={ name } value={ typeof value === 'object' ? value.address : value } onChange={ onChange }/>
                  }
                </>
            }
          </>
        : frameType === 'time' ?
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker value={ value ? dayjs(value) : dayjs(new Date()) } onChange={ (e) => InputChanged(e) } sx={ pickerSx } slotProps={{ textField: { id: fieldId } }}/>
          </LocalizationProvider>
        : frameType === 'date' ?
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker value={ value ? dayjs(value) : dayjs(new Date()) } onChange={ (e) => InputChanged(e) } sx={ pickerSx } slotProps={{ textField: { id: fieldId } }}/>
          </LocalizationProvider>
        : frameType === 'checkbox' ?
          <Checkbox_Container isChecked={ isChecked } onChange={ checkboxChanged }/>
        : frameType === 'signature' ?
          <div className='w-fit rounded-[var(--radius-button)] border border-line bg-white p-2'>
            <Image src={ value } alt='Signature' width={120} height={60} className='h-[60px] w-auto object-contain'/>
          </div>
        : frameType === 'submit' &&
          <input className='h-12 w-full cursor-pointer rounded-[var(--radius-button)] bg-brand-600 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60' type={ type } value={ value } disabled={ isDisabled }/>
      }
    </div>
  )
}


export default Input;
