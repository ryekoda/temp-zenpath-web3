import { FC, Fragment } from "react";
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';



interface Props {
    children: any
    isOpen: boolean
    setIsOpen: any
    direction: string
}

const Drawer: FC<Props> = ({ children, isOpen, setIsOpen, direction }) => {
    const toggleDrawer = (isOpen: boolean) => (event: any) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
    
        setIsOpen(isOpen)
    };

    return (
        <Fragment>
            <MuiDrawer anchor="right" open={ isOpen } onClose={ toggleDrawer(false) }>
                <Box sx={{ width: direction === 'top' || direction === 'bottom' ? 'auto' : 250 }} role="presentation" onClick={ toggleDrawer(false) } onKeyDown={ toggleDrawer(false) }>
                    { children }
                </Box>
            </MuiDrawer>
        </Fragment>
    )
};


export default Drawer;
