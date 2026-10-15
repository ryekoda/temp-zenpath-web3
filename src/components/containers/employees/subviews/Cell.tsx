import { FC, useState, useEffect } from 'react';
import Image from 'next/image';
import { useDrag } from 'react-dnd';
import Paragraph from '@/components/ui/Paragraph';
import { CapitalizeFirstLetter } from '@/lib/GlobalFunctions';

import { CalculateSectionWidth } from '../../../old/ListHeader_A';
import { GetData } from '../../../old/ListItem_A';



interface Props {
    index: number
    name: string
    item: any
    allUsers: any
    allClients: any
    allEmployees: any
    showHeaders: any
    headerTitles: any
    GetOnlineStatus: any
    itemSpecs: any
    onPress: any
    activityData: any
}

const Cell: FC<Props> = ({ index, name, item, allUsers, allClients, allEmployees, showHeaders, headerTitles, GetOnlineStatus, itemSpecs, onPress, activityData }) => {
    const data: any = GetData(name, item, headerTitles, showHeaders && headerTitles ? allUsers : allClients, allEmployees)
    const [{isDragging}, drag] = useDrag(() => ({ type: "Cell", collect: monitor => ({ isDragging: !!monitor.isDragging(), }), }))
    const [isOnline, setIsOnline] = useState()


    // useEffect(() => {
    //     if (data['userUID']) {
    //         const userUID = data['userUID']
    //         GetOnlineStatus(userUID, function(isUserOnline) {
    //             setIsOnline(isUserOnline)
    //         })
    //     }
    //   }, [])

    const tripStatus = () => {
        let activityValue = ''

        if (activityData) activityValue = activityData.info.value

        const statusInfo = {
            value: activityValue,
            title: activityValue ? CapitalizeFirstLetter(activityValue) : data['46783'] ? 'Wating for driver...' : 'Wating for driver...' ,
            bkColor: activityValue === 'complete' ? '#18B5BF' : activityValue === 'cancelled' ? 'black' : 'gray'
        }
        return statusInfo
    }


    return (
        <div className='mt-4'>
            <div className='w-full flex flex-row bg-[#F5F5F5] rounded-md py-3 shadow-md cursor-pointer hover:bg-[#F4F8FF] relative' ref={ drag } style={{ opacity: isDragging ? 0.5 : 1, cursor: 'pointer', borderRadius: '3px' }} >
                {
                    headerTitles.map((header: any, secIndex: any) => (
                        <div key={ header.uid } className='flex flex-row border-r-2 border-white h-full' style={{ width: itemSpecs.length > 0 ? itemSpecs[secIndex ? secIndex : 0].width : CalculateSectionWidth(header.uid) + 'px' }}>
                            {
                                (header.uid === '34057') &&
                                    <div className='bg-[#717FF6] h-full w-[8px] left-0 top-0 absolute' id='i8wFwf' style={{ borderTopLeftRadius: '3px', borderBottomLeftRadius: '3px' }}></div>
                            }

                            <div className='w-full flex flex-row'>
                                <div id={ header.type === 'dropDown' ? 'C0GIK' : 'wtCO3' } style={{ width: header.uid === '34057' ? '60%' : '94%', margin: header.uid === '34057' ? '0px 0px 0px 20px' : '0 auto' }} onClick={ (e) => onPress(e, 'edit', item, index, secIndex, true) }>
                                    <div className='pt-2' style={{ display: 'flex', margin: '0 auto' }}>
                                        <div className='rergB' style={{ display: (header.type === 'phone' && data[header.uid] !== '') ? 'block' : 'none' }}>
                                            <Image src="/images/usFlag.png" alt="USA flag icon" width={16} height={16}/>
                                        </div>
                                        {/* <div className='KsAIP'>
                                            <Image src="/images/Add.svg" alt="add icon" width={16} height={16}/>
                                        </div> */}

                                        <Paragraph className='w-full whitespace-nowrap truncate' size='sm' style={{ textAlign: header.uid === '34057' ? 'left' : 'center', color: header.uid === '38543' ? 'white' : 'black' }}>
                                            { header.uid === '38543' ? tripStatus().title : data[header.type !== 'ref' ? header.uid : header.options.ref[0].value] }
                                        </Paragraph>
                                    </div>
                                </div>

                                {
                                    (data['userUID'] && header.uid === '34057') &&
                                        <div className='flex flex-row'>
                                            <div id={ isOnline ? 'L0uKE' : 'xMIvq' } style={{ borderRadius: '50px', width: '8px', height: '8px' }}></div>
                                            <Paragraph className='w-full whitespace-nowrap truncate ml-[34px] mt-2.5' size='sm'>
                                                { isOnline ? 'Online' : 'Offline' }
                                            </Paragraph>
                                        </div>
                                }


                                {
                                    (header.uid === '34057') &&
                                        <>
                                            <div className='w-[100px] ml-auto block overflow-hidden' onClick={ (e) => onPress(e, 'edit', item, index, secIndex, true) }>
                                                <div style={{ display: data['comments'] ? 'block' : 'none' }} onClick={ () => console.log('comments...') }>
                                                    <div className='iDAcc' style={{ display: 'none' }}></div>
                                                    <div style={{ width: '20px', height: '20px', margin: '0 auto', marginTop: '14px' }}>
                                                        <Image src="/images/ChatBubble.svg" width={20} height={20} alt="chat icon"/>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='PbHWU' onClick={ (e) => onPress(e, 'linkAccount', item, index, secIndex, false) } >
                                                <div className='eDw4y'>
                                                    <Image src="/images/Add.svg" alt="add icon" width={16} height={16}/>
                                                </div>
                                                <div style={{ width: '26px', height: '26px', margin: '0 auto', marginTop: '8px' }}>
                                                    {
                                                        (data['userUID']) ?
                                                        <div style={{ width: '26px', height: '26px', backgroundColor: '#D93F67', borderRadius: '50%', overflow: 'hidden' }}>
                                                            <p style={{ margin: '0px', color: 'white', fontSize: '12px', fontWeight: 'bold', width: '100%', textAlign: 'center', marginTop: '5px' }}>{ CapitalizeFirstLetter(item.fName ? item.fName.charAt(0) : '') }{ CapitalizeFirstLetter(item.lName ? item.lName.charAt(0) : '') }</p>
                                                        </div>
                                                    :
                                                        <Image src="/images/User.svg" alt="add icon" width={16} height={16}/>
                                                    }
                                                </div>
                                            </div>
                                        </>
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}


export default Cell;