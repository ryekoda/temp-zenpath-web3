import { FC } from "react";
import Paragraph from '@/components/ui/Paragraph';
import { GetData } from '../../../old/ListItem_A';
import { CalculateSectionWidth } from '../../../old/ListHeader_A';



interface Props {
    index: any
    name: any
    item: any
    allUsers?: any
    allClients?: any
    allEmployees?: any
    showHeaders?: any
    headerTitles?: any
    onPress?: any
    itemSpecs?: any
}

const HistroyCell: FC<Props> = ({ index, name, item, allUsers, allClients, allEmployees, showHeaders, headerTitles, onPress, itemSpecs }) => {
    const data: any = GetData(name, item, headerTitles, showHeaders && headerTitles ? allUsers : allClients, allEmployees)
    // console.log('BBBDDIIII: ', item);
    
    return (
        <div className='mt-4 w-[1500px]'>
        <div className='w-full flex flex-row bg-[#F5F5F5] rounded-md py-3 shadow-md cursor-pointer hover:bg-[#F4F8FF] relative'>
            {
                headerTitles.map((header: any, secIndex: number) => (
                    <div key={ header.uid } className='flex flex-row border-r-2 border-white h-full' style={{ width: itemSpecs.length > 0 ? itemSpecs[secIndex ? secIndex : 0].width : CalculateSectionWidth(header.uid) + 'px' }}>
                        {
                            (header.uid === '71130') &&
                                <div className='h-full w-[8px] left-0 top-0 absolute' id='i8wFwf' style={{ borderTopLeftRadius: '3px', borderBottomLeftRadius: '3px' }}></div>
                        }

                        <div className='w-full flex flex-row'>
                            <div id={ header.type === 'dropDown' && (header.uid !== '71130' && header.uid !== '95242' && header.uid !== '46783' && header.uid !== '38543') ? 'C0GIK' : 'wtCO3' } style={{ width: header.uid === '71130' ? '60%' : '94%', margin: header.uid === '71130' ? '0px 0px 0px 20px' : '0 auto', backgroundColor: header.uid === '38543' ? 'tripStatus().bkColor' : '' }} onClick={ () => onPress(item, index, secIndex, true) }>
                                <div className='pt-2' style={{ display: 'flex', margin: '0 auto' }}>
                                    <div className='rergB' style={{ display: (header.type === 'phone' && data[header.uid] !== '') ? 'block' : 'none' }}>
                                        {/* <Image src="/images/usFlag.png" width={20} height={20} alt="flag icon"/> */}
                                    </div>
                                    <div className='KsAIP'>
                                        {/* <img src={ AddIcon } alt='addIcon' style={{ maxHeight: '100%' }} /> */}
                                    </div>

                                    <Paragraph className='w-full whitespace-nowrap truncate' size='sm' style={{ textAlign: header.uid === '71130' ? 'left' : 'center', color: header.uid === '38543' ? 'white' : 'black' }}>
                                        { header.uid === '38543' ? 'tripStatus().title' : data[header.type !== 'ref' ? header.uid : header.options.ref[0].value] }
                                    </Paragraph>
                                    {/* { 
                                        (header.uid === '95242' && GetLegIndex() !== 0) &&
                                            <Paragraph size='xs' className='mt-0.5 text-slate-500 absolute ml-[108px]'>
                                                { header.uid === '95242' ? `(${GetLegIndex()})` : '' }
                                            </Paragraph>
                                    } */}
                                </div>
                            </div>

                            {
                                (header.uid === '71130') &&
                                    <>
                                        <div className='w-[100px] ml-auto block overflow-hidden' onClick={ () => onPress(item, index, secIndex, true) }>
                                            <div className='mt-2.5 ml-8' style={{ display: data['comments'] ? 'block' : 'none' }} onClick={ () => console.log('comments...') }>
                                                <div className='iDAcc' style={{ display: 'none' }}></div>
                                                {/* <Image src="/images/ChatBubble.svg" width={20} height={20} alt="chat icon"/> */}
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
};


export default HistroyCell;
