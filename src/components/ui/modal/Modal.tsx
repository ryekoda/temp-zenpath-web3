import * as React from 'react';
import Image from 'next/image';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LargeHeading from '@/components/ui/LargeHeading';
import { CapitalizeFirstLetterOfEachWord } from '@/lib/Utils';



interface nameProps {
    children?: React.ReactNode;
    isOpen: boolean
    handleOpen: any
    handleClose: any
    title: string
}

const CustomModal: React.FC<nameProps> = ({ children, isOpen, handleOpen, handleClose, title }) => {
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: '5px'
    };

    return (
      <Modal aria-labelledby="transition-modal-title" aria-describedby="transition-modal-description" open={isOpen} onClose={handleClose} closeAfterTransition slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { timeout: 500, }, }}>
        <Fade in={isOpen}>
          <Box sx={style}>
            <div className='w-full flex justify-between items-center pb-4'>
                <div></div>

                <LargeHeading size='sm' className='three-d dark:text-black pb-2'>
                  {CapitalizeFirstLetterOfEachWord(title)}
                </LargeHeading>

                <div onClick={ handleClose }>
                    <Image className='pt-4 pb-4 hover:cursor-pointer' src="/images/close.png" alt="close icon" width={18} height={18}/>
                </div>
            </div>
            <Divider/>

            <div className='pt-4'>
                {children}
            </div>
          </Box>
        </Fade>
      </Modal>
    )
};


export default CustomModal;
