import { FC } from "react";
import { CapitalizeFirstLetterOfEachWord } from '@/lib/format/text';
import { fieldClassName, selectClassName } from '../fieldStyles';

import { GenerateAutoCompleteValue } from '../Actions';



interface Props {
    id?: string
    name: string
    type: number
    value: any
    autoCompleteData: any
    options: any
    onChange: any
    errorCode: any
    errorMessage: any
    isRequired: boolean
}

const DropDown: FC<Props> = ({ id, name, type, value, autoCompleteData, options, onChange, errorCode, errorMessage, isRequired }) => {
    return (
        <div>
            {
                (type === 0) ?
                    <div className='relative'>
                        <input id={ id } className={ fieldClassName } name={ name } value={ GenerateAutoCompleteValue(value, autoCompleteData).title } onChange={ (e) => onChange(e) } autoComplete="off" spellCheck={ false } required={ isRequired } placeholder='Start typing a client’s name' aria-invalid={ errorCode === 1 }/>
                        { errorCode === 1 && <p role='alert' className='mt-1.5 text-sm text-status-danger'>{ errorMessage }</p> }
                    </div>
                :
                    <select id={ id } className={ selectClassName } name={ name } value={ value } onChange={ (e) => onChange(e) } >
                        <option value=''>Select…</option>

                        {
                            options.map((item: any) => (
                                <option key={ item['value'] ? item['value'] : item } value={ item['value'] ? item['value'] : item }>{ item['title'] ? CapitalizeFirstLetterOfEachWord(item.title) : CapitalizeFirstLetterOfEachWord(item) }</option>
                            ))
                        }
                    </select>
            }
        </div>
    )
};


export default DropDown;
