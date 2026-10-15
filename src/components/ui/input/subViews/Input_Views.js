import React from 'react';
import Checkbox from '@mui/material/Checkbox';



// MARK: ----- Radio
export const Radio = ( props ) => {
    const { title, isChecked, onChange } = props

    return (
        <div className='siy0T' id='w837n'>
            <input className='B42QN' name='radioGroup' type='radio' checked={ isChecked } onChange={ () => onChange() }/>
            <p className='E3x4E'>{ title }</p>
        </div>
    )
}

// MARK: ----- Checkbox
export const Checkbox_Container = ( props ) => {
    const { title, isChecked, onChange } = props

    return (
        <div className='siy0T' id='Uzi5P'>
            <Checkbox name={ title } checked={ isChecked } onChange={ (e) => onChange(e) } color='default' sx={{ color: '#717FF6', '&.Mui-checked': { color: '#717FF6' } }}/>
            {
                title &&
                    <p className='y9ek2' style={{ marginTop: '10px' }}>{ title }</p>
            }
        </div>
    )
}