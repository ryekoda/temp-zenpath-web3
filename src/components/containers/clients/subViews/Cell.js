import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
// import usFlag from '../../../assets/images/usFlag.png';
// import ChatBubbleIcon from '../../../assets/images/ChatBubble.svg';
// import UserIcon from '../../../assets/images/User.svg';
// import AddIcon from '../../../assets/images/Add.svg';
import Paragraph from '@/components/ui/Paragraph';
import { CapitalizeFirstLetter } from '@/lib/GlobalFunctions';
import { CalculateSectionWidth } from '../../../old/ListHeader_A';
import { GetData } from '../../../old/ListItem_A';



export const Cell = ( props ) => {
    const { index, name, item, allUsers, allClients, allEmployees, showHeaders, headerTitles, onPress, itemSpecs } = props
    const data = GetData(name, item, headerTitles, showHeaders && headerTitles ? allUsers : allClients, allEmployees)
    const [{isDragging}, drag] = useDrag(() => ({ type: "Cell", collect: monitor => ({ isDragging: !!monitor.isDragging(), }), }))


    return (
        <div className='mt-4'>
            <div className='w-full flex flex-row bg-[#F5F5F5] rounded-md py-3 shadow-md cursor-pointer hover:bg-[#F4F8FF] relative' ref={ drag } style={{ opacity: isDragging ? 0.5 : 1, cursor: 'pointer', borderRadius: '3px' }} >
                {
                    headerTitles.map((header, secIndex) => (
                        <div key={ header.uid } className='flex flex-row border-r-2 border-white h-full' style={{ width: itemSpecs.length > 0 ? itemSpecs[secIndex ? secIndex : 0].width : CalculateSectionWidth(header.uid) + 'px' }}>
                            {
                                (header.uid === '10990') &&
                                    <div className='bg-[#18B5BF] h-full w-[8px] left-0 top-0 absolute' id='i8wFwf' style={{ borderTopLeftRadius: '3px', borderBottomLeftRadius: '3px' }}></div>
                            }

                            <div className='w-full flex flex-row'>

                                <div id={ header.type === 'dropDown' ? 'C0GIK' : 'wtCO3' } style={{ width: header.uid === '10990' ? '60%' : '94%', margin: header.uid === '10990' ? '0px 0px 0px 20px' : '0 auto' }} onClick={ () => onPress(item, index, secIndex, true) }>
                                    <div className='pt-2' style={{ display: 'flex', margin: '0 auto' }}>
                                        <div className='rergB' style={{ display: (header.type === 'phone' && data[header.uid] !== '') ? 'block' : 'none' }}>
                                            {/* <img src={usFlag} alt='usaflag' style={{ maxHeight: '100%' }} /> */}
                                        </div>
                                        <div className='KsAIP'>
                                            {/* <img src={ AddIcon } alt='addIcon' style={{ maxHeight: '100%' }} /> */}
                                        </div>

                                        <Paragraph className='w-full whitespace-nowrap truncate' size='sm' style={{ textAlign: header.uid === '10990' ? 'left' : 'center', color: header.uid === '38543' ? 'white' : 'black' }}>
                                            { data[header.type !== 'ref' ? header.uid : header.options.ref[0].value] }
                                        </Paragraph>
                                    </div>
                                </div>

                                {
                                    (header.uid === '10990') &&
                                        <>
                                            <div className='N2dsk' style={{ width: '100px', display: 'block', marginLeft: 'auto', overflow: 'hidden' }} onClick={ () => onPress(item, index, secIndex, true) }>
                                                <div style={{ display: data['comments'] ? 'block' : 'none' }} onClick={ () => console.log('comments...') }>
                                                    <div className='iDAcc' style={{ display: 'none' }}></div>
                                                    <div style={{ width: '20px', height: '20px', margin: '0 auto', marginTop: '16px' }}>
                                                        {/* <img src={ ChatBubbleIcon } alt='chatBubble' style={{ maxHeight: '100%', filter: 'brightness(0) invert(0.4)' }} /> */}
                                                    </div>
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