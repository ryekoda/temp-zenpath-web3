import React, { useRef, useMemo } from 'react'; // 🔑 Added useMemo
import { useDrag } from 'react-dnd';
import Paragraph from '@/components/ui/Paragraph';
// import { GetData } from '../../../old/ListItem_A';
// import { CalculateSectionWidth } from '../../../old/ListHeader_A';

import { GetData } from '@/lib/data/getData';
import { CalculateSectionWidth } from '@/lib/data/fields';



export const Cell = ({ index, name, item, allUsers, allClients, allEmployees, showHeaders, headerTitles }) => {
    
    // 🔑 FIX: Memoize the data lookup payload so it stands completely still!
    const data = useMemo(() => {
        if (!item || !headerTitles) return {};
        
        const userDataSource = showHeaders && headerTitles ? allUsers : allClients;
        return GetData(name, item, headerTitles, userDataSource, allEmployees);
    }, [item, headerTitles, allUsers, allClients, allEmployees, showHeaders]); // Only re-runs if the explicit row data changes!

    // Drag and drop attachment configuration hook
    const [{ isDragging }, drag] = useDrag(() => ({ 
        type: "Cell", 
        collect: monitor => ({ isDragging: !!monitor.isDragging() }) 
    }), []); // Added dependency array to stop drag hook recreation loops

    // Fallback logic check for trip status field values
    const tripStatus = () => {
        return { title: data['38543'] || '' };
    };

    return (
        <div className='mt-4 print:mt-0'>
            <div 
                className='w-full flex flex-row bg-[#F5F5F5] rounded-md py-3 shadow-md cursor-pointer hover:bg-[#F4F8FF] relative print:shadow-none print:py-0' 
                ref={ drag } 
                style={{ opacity: isDragging ? 0.5 : 1, borderRadius: '3px' }}
            >
                {
                    headerTitles && headerTitles.map((header, i) => {
                        // Safely pull value targets depending on header type profiles
                        const dataKey = header.type !== 'ref' ? header.uid : header.options?.ref?.[0]?.value;
                        const cellValue = data[dataKey] || '';

                        return (
                            <div 
                                key={ header.uid || i } 
                                className='flex flex-row border-r-2 border-white h-full relative' 
                                style={{ width: CalculateSectionWidth(header.uid) }}
                            >
                                {
                                    (header.uid === '55410') &&
                                        <div className='bg-[#FCBC05] h-full w-[8px] left-0 top-0 absolute' style={{ borderTopLeftRadius: '3px', borderBottomLeftRadius: '3px' }}></div>
                                }

                                <div className='w-full flex flex-row'>
                                    <div style={{ width: header.uid === '55410' ? '60%' : '94%', margin: header.uid === '55410' ? '0px 0px 0px 20px' : '0 auto' }}>
                                        <div className='pt-2' style={{ display: 'flex', margin: '0 auto' }}>
                                            {
                                                header.uid !== '94583' ?
                                                    <Paragraph 
                                                        className='w-full whitespace-nowrap truncate' 
                                                        size='sm' 
                                                        style={{ 
                                                            textAlign: header.uid === '55410' ? 'left' : 'center', 
                                                            color: header.uid === '38543' ? 'white' : 'black' 
                                                        }}
                                                    >
                                                        { header.uid === '38543' ? tripStatus().title : cellValue }
                                                    </Paragraph>
                                                :
                                                    <div className='w-full h-[20px]'></div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};