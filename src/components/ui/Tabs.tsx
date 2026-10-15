import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Minus, Plus } from 'lucide-react';
import { CapitalizeFirstLetterOfEachWord } from '@/lib/format/text';



interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`trip-leg-panel-${index}`} aria-labelledby={`trip-leg-tab-${index}`} className='pt-5' {...other}>
      {value === index && children}
    </div>
  );
}

const tabsSx = {
  minHeight: 40,
  '& .MuiTabs-indicator': { backgroundColor: 'var(--color-brand-600)', height: 2 },
  '& .MuiTab-root': { minHeight: 40, minWidth: 0, px: 1.5, textTransform: 'none', fontFamily: 'inherit', fontSize: 14, fontWeight: 500, color: 'var(--color-ink-500)' },
  '& .MuiTab-root.Mui-selected': { color: 'var(--color-ink-900)', fontWeight: 600 },
}

const legButton = 'inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-button)] px-2.5 text-sm font-medium text-ink-700 transition-colors duration-200 hover:bg-surface-soft hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600'

// Tabs for the legs of a trip (Leg A, Leg B, …) in the trip form.
export default function BasicTabs(props: any) {
  const { children, tabtitles, tabIndex, setTabIndex, onPress, modalName } = props

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex({ current: newValue, previous: tabIndex.current })
  };

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between gap-2 border-b border-line'>
        <Tabs value={tabIndex.current} onChange={handleChange} aria-label="Trip legs" sx={tabsSx}>
          {
            tabtitles.map((title: any, index: number) => (
              <Tab key={ index } label={ CapitalizeFirstLetterOfEachWord(title) } id={`trip-leg-tab-${index}`} aria-controls={`trip-leg-panel-${index}`}/>
            ))
          }
        </Tabs>

        <div className='flex items-center gap-1 pb-1'>
          {
            (tabtitles.length > 1) &&
              <button type='button' onClick={ () => onPress('remove') } className={ legButton }>
                <Minus aria-hidden="true" className='h-4 w-4'/>
                Remove leg
              </button>
          }
          {
            (tabtitles.length < 4 && modalName !== 'edit') &&
              <button type='button' onClick={ () => onPress('add') } className={ legButton }>
                <Plus aria-hidden="true" className='h-4 w-4'/>
                Add leg
              </button>
          }
        </div>
      </div>

      {
        tabtitles.map((title: any, index: number) => (
          <CustomTabPanel key={ index } value={tabIndex.current} index={index}>
            { children }
          </CustomTabPanel>
        ))
      }
    </div>
  );
}
