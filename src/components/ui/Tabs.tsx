import React from 'react';
import Image from 'next/image';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/Utils';



interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs(props: any) {
    const { children, tabtitles, tabIndex, setTabIndex, onPress, modalName } = props


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex({ current: newValue, previous: tabIndex.current })
    // setCurrentIndex(newValue)
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <div className='flex felx-row justify-between'>
          <div className='flex felx-row'>
            <Tabs value={tabIndex.current} onChange={handleChange} aria-label="basic tabs example">
                {
                    tabtitles.map((title: any, index: number) => (
                        <Tab key={ index } label={ title } {...a11yProps(index)} />
                    ))
                }
            </Tabs>
            {
              (tabtitles.length > 1) &&
                <Button variant='ghost' onClick={ () => onPress('remove') } className={cn('w-fit', 'className', 'mt-1')}>
                    <Image src="/images/Minus.png" alt="minus icon" width={20} height={20}/>
                </Button>
            }

          </div>

          {
            (tabtitles.length < 4 && modalName !== 'edit') &&
              <Button variant='ghost' onClick={ () => onPress('add') } className={cn('w-fit', 'className', 'mt-1')}>
                  <Image src="/images/Add.svg" alt="add icon" width={20} height={20}/>
              </Button>
          }
        </div>
      </Box>
            {
                tabtitles.map((title: any, index: number) => (
                    <CustomTabPanel key={ index } value={tabIndex.current} index={index}>
                        { children }
                    </CustomTabPanel>
                ))
            }
    </Box>
  );
}