"use client"

import { FC } from 'react';
import Image from 'next/image';
import Confetti from 'react-confetti';
import LargeHeading from '@/components/ui/LargeHeading';
import Paragraph from '@/components/ui/Paragraph';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/Utils';



interface Props {
    handleClose: any
}

const Welcome_Container: React.FC<Props> = ({ handleClose }) => {  
    function actionButtonPressed() {
        handleClose()
    }


    return (
        <div style={{ width: '100%', height: '44vh', overflow: 'scroll' }}>
            <Confetti width={ 1000 } numberOfPieces={ 2000 } recycle={ false } />
            <div style={{ width: '90%', margin: '0 auto', position: 'relative' }}>
                <div className='flex justify-center'>
                    <Image className='ml-2 w-[120px] h-[120px]' src="/images/Team2.png" alt="team icon" width={120} height={120}/>
                </div>
            
                <div className='flex flex-row items-center w-full justify-center'>
                    <LargeHeading size='sm' className='py-6'>
                        Welcome to <span className='text-[#26C796]'>Zenpath!</span>
                    </LargeHeading>
                    <Image className='ml-2 w-[35px] h-[35px]' src="/images/WavingHand.png" alt="waving hand icon" width={35} height={35}/>
                </div>
    
                <div style={{ width: '100%', marginTop: '10px' }}>
                    <Paragraph size='sm' className='m-0'>
                        You can now use Zenpath to schedule and dispatch your fleet.
                    </Paragraph>
                    <Paragraph size='sm' className='m-0'>
                        Explore our guide or jump right into scheduling your trips
                    </Paragraph>
                    <div className='flex justify-center py-6'>
                        <Button variant='custom' onClick={ (e) => actionButtonPressed() } className={cn('w-fit bg-white border-[1px] hover:bg-slate-100 border-slate-600 hover:shadow-lg', 'className')}>
                            Ill explore on my own
                        </Button>
                        <Button variant='custom' onClick={ (e) => actionButtonPressed() } className={cn('w-fit ml-[12px] bg-[#26C796] hover:bg-[#26C796]/80 text-white hover:shadow-lg', 'className')}>
                            Start the guide
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Welcome_Container