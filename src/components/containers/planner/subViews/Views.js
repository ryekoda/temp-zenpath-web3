"use client"
import { FC, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import LargeHeading from '@/components/ui/LargeHeading';
import Paragraph from '@/components/ui/Paragraph';
import Form from '@/components/ui/Form';
import { CapitalizeFirstLetterOfEachWord } from '@/lib/Utils';

import { ErrorMessage } from '../Actions';
import { CalculateSectionWidth } from '../../../old/ListHeader_A';
import '../../../old/ListItem.css';



export function MapFormInnerView( props ) {
    const { modalName, activityField, fields, selectedTripInfo, modalOptions, tripHistory, drivers, autoCompleteData, inputChanged, isToolTipOpen, currentTooltip, errorCode, saveEntry, deleteEntry } = props


    return (
        <div>
            {
                (modalName === 'edit' && activityField['info'] && activityField['info'].value) &&
                    <div style={{ padding: '10px 0px 10px 0px' }}>
                        <h5 style={{ margin: '12px 0px 10px 0px', color: 'gray', textAlign: 'center' }}>Status</h5>
                        <p style={{ fontSize: '20px', margin: '0px', textAlign: 'center' }}>{ CapitalizeFirstLetterOfEachWord(activityField['info'].value) }</p>
                    </div>
            }

            <div style={{ display: 'flex' }}>
                <div style={{ width: '50%', margin: '0 auto', paddingBottom: '150px' }}>
                    <LargeHeading size='sm' className='pb-4'>
                        { modalName === 'create' ? 'Create Trip' : 'Edit Trip' }
                    </LargeHeading>
                    <Form name={ modalName } fields={ fields } selectedData={ selectedTripInfo } options={ modalOptions } tripHistory={ tripHistory } allDrivers={ drivers } autoCompleteData={ autoCompleteData } onInputChange={ inputChanged } isToolTipOpen={ isToolTipOpen } currentTooltip={ currentTooltip } errorMessage={ ErrorMessage(errorCode).message } submitButtonTitle='Save' onSubmit={ saveEntry } onDelete={ deleteEntry }/>

                {/* {
                    (modalName === 'edit') &&
                        <FormOptionsView modalName={ modalName } popperTrigger={ popperTrigger } setCurrentTooltip={ setCurrentTooltip } isToolTipOpen={ isToolTipOpen } setIsToolTipOpen={ setIsToolTipOpen }/>
                } */}
                </div>
            </div>
        </div>
    )
}