import { FC } from "react";
import Paragraph from '@/components/ui/Paragraph';
import { CapitalizeFirstLetterOfEachWord } from '@/lib/GlobalFunctions';

import { GenerateAutoCompleteValue } from '../Actions';



interface Props {
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

const DropDown: FC<Props> = ({ name, type, value, autoCompleteData, options, onChange, errorCode, errorMessage, isRequired }) => {
    return (
        <div>
            {
                (type === 0) ?
                    <div className='relative'>
                        <input className='dark:bg-white w-full p-3 border-solid border border-slate-400 rounded-md' name={ name } value={ GenerateAutoCompleteValue(value, autoCompleteData).title } onChange={ (e) => onChange(e) } autoComplete="off" spellCheck={ false } required={ isRequired } />
                        <Paragraph size='xs' className="text-red-600" style={{ display: errorCode === 1 ? 'block' : 'none' }}>
                            { errorMessage }
                        </Paragraph> 
                    </div>
                :
                    <select className='dark:bg-white w-full p-3 border-solid border border-slate-400 rounded-md hover:cursor-pointer' name={ name } value={ value } onChange={ (e) => onChange(e) } >
                        <option value=''></option>

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
