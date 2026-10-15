import React, { useState, useRef } from 'react';
import Input from '@/components/ui/input/Input';
import { GetTaggedIndex } from '@/helpers/database/TaggedIndex';
import { cn } from '@/lib/cn';



interface Props {
    name: string
    companyUID?: string
    fields?: any
    setFields?: any
    selectedData?: any
    onInputChange?: any 
    options?: any 
    tripHistory?: any 
    allDrivers?: any 
    allClients?: any 
    isToolTipOpen?: any 
    currentTooltip?: any 
    errorMessage?: any 
    submitButtonTitle?: any 
    onSubmit?: any 
    onDelete?: any
    setIsToolTipOpen?: any
    handleToolTipOpen?: any
    handleToolTipClose?: any
    dbURL?: any
    autoCompleteData?: any
    setAutoCompleteData?: any
}

const Form: React.FC<Props> = ({ name, companyUID, fields, setFields, selectedData, onInputChange, options, tripHistory, allDrivers, allClients, isToolTipOpen, currentTooltip, errorMessage, submitButtonTitle, onSubmit, onDelete, setIsToolTipOpen, handleToolTipOpen, handleToolTipClose, dbURL, autoCompleteData, setAutoCompleteData }) => {
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false)
    const [isShowingConfirmDeleteButton, setIsShowingConfirmDeleteButton] = useState(false)
    const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = useState(false)
    const [timer, setTimer] = useState()
    const [errorCode, setErrorCode] = useState(0)

    

    function inputChanged(e: any) {
        if (e['preventDefault']) {
          e.preventDefault();
        }
        
        const target = e.target
        const targetCustomEvent = e['customEvent']
        const targetName = target.name
        let targetValue = target.value
        
        if (targetName === '97264') {
            // Time -> update time from date
            let tripDate: Date = fields.find((o: any) => o.name === '16538').value
            if (tripDate) {
                tripDate.setHours(targetValue.getHours())
                tripDate.setMinutes(targetValue.getMinutes())
                tripDate.setSeconds(targetValue.getSeconds())
                targetValue = tripDate
            }
        }

        if (errorCode !== 0) setErrorCode(0)
        setFields(fields.map((field: any) => {
            if (field.name === '97264' && targetName === '16538') {
                // Date : Time -> update time from date
                let tripTime: Date = field.value
                if (tripTime) {
                    targetValue.setHours(tripTime.getHours())
                    targetValue.setMinutes(tripTime.getMinutes())
                    targetValue.setSeconds(tripTime.getSeconds())
                }

                return {...field, value: targetValue ? targetValue : ''}
            }
            
            if (field.name !== targetName) return field
            return {...field, value: targetValue ? targetValue : ''}
        }))
        // setFields(fields.map((field: any) => {
        //     if (field.name !== targetName) return field
        //     return {...field, value: targetValue ? targetValue : ''}
        // }))

        // autocomplete
        if (targetName === '71130') {
          if (targetCustomEvent) {
            handleToolTipClose(false)
          } else {
            Autocomplete(targetName, targetValue, e)
          }
        }
    }

    function Autocomplete(targetName: string, targetValue: any, event: any) {
        clearTimeout(timer)
      
        const newTimer: any = setTimeout(() => {
      
          if (targetName === '71130') {
            setAutoCompleteData([])

            RetrieveTaggedItems(targetValue, 'clients', function(items: any) {

                if (!targetValue) {
                    handleToolTipClose(false)
                } else {
             
                    if (!isToolTipOpen) {
                        if (items && items.length > 0) {
                            handleToolTipOpen('form-autocomplete', event)
                        }
                    } 
                }
          
                setAutoCompleteData(items)
            })
          }
        }, 300)
      
        setTimer(newTimer)
    }

    async function RetrieveTaggedItems(targetValue: any, category: string, callback: any) {
        const taggedIndexData = await GetTaggedIndex(category, targetValue, companyUID!, dbURL).catch((err) => console.log('tagged index error: ', err)); 
        callback(taggedIndexData)
    }

    function deleteButtonPressed(e: any) {
        e.preventDefault();
        setIsDeleteButtonDisabled(true)
        
        if (isShowingConfirmDeleteButton) { 
            const itemUIDIndex = fields.findIndex(((obj: any) => obj.name == 'uid'));
            const itemUID = fields[itemUIDIndex].value

            if (itemUID) {
                onDelete(itemUID)
            }
        } else {
            setIsShowingConfirmDeleteButton(true)
            setIsDeleteButtonDisabled(false)
        }
    }

    
    return (
        <div className='w-full'>
            <form onSubmit={ (e) => onSubmit(e, setIsSubmitButtonDisabled) }>
                {
                    fields.map((field: any, index: number) => (
                        <Input key={ index } name={ field.name } title={ field.title } frameType={ field.frameType } type={ field.type } inputValue={ field.value } placeholder={ field.placeholder } onChange={ inputChanged } autoCompleteData={ autoCompleteData } options={ options } field={ field } allDrivers={ allDrivers } allClients={ allClients } tripHistory={ tripHistory } allowAddressSuggestion={ field.name === '67300' ? true : false } errorCode={ errorCode } hideRequiredAsterisk={ field['hideRequiredAsterisk'] && field.hideRequiredAsterisk } required={ field.isRequired }/>
                    ))
                }

                <div className='mt-6'>
                    { (errorMessage) && <p role='alert' className='mb-3 rounded-[var(--radius-button)] bg-status-danger-soft px-3 py-2 text-sm text-ink-900'>{ errorMessage }</p> }
                    <Input name='' frameType='submit' type='submit' inputValue={ submitButtonTitle } isDisabled={ isSubmitButtonDisabled }/>
                </div>
            </form>

            {
              (name === 'edit') &&
                <div className='mt-3 flex items-center justify-center gap-2'>
                    <button
                        type='button'
                        onClick={ (e) => deleteButtonPressed(e) }
                        disabled={ isDeleteButtonDisabled }
                        className={ cn(
                            'h-10 rounded-[var(--radius-button)] px-4 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-status-danger disabled:opacity-60',
                            isShowingConfirmDeleteButton ? 'bg-status-danger text-white hover:bg-status-danger/90' : 'text-ink-500 hover:bg-status-danger-soft hover:text-status-danger'
                        ) }>
                        { isShowingConfirmDeleteButton ? 'Yes, delete' : 'Delete' }
                    </button>
                    {
                        isShowingConfirmDeleteButton &&
                            <button type='button' onClick={ () => setIsShowingConfirmDeleteButton(false) } className='h-10 rounded-[var(--radius-button)] px-4 text-sm font-medium text-ink-700 hover:bg-surface-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600'>
                                Keep it
                            </button>
                    }
                </div>
            }
        </div>
    )
}


export default Form;