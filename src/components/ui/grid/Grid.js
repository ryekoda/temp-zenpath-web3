import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
// import CheckmarkIcon from '/images/LogoIcon.png'
// import Image from '../image/Image';

import { calculateCellPadding } from './Grid_A';
import './Grid.css'



function GridView({ name, items, spacing, onClick, selectedItem, setSelectedItem, allFieldsData, setAllFieldsData }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={ spacing }>
        {
          items.map(item => (
            <Grid item xs={ item.size } key={ item.uid } className='rWPUP' onClick={ () => onClick(item, setSelectedItem, allFieldsData, setAllFieldsData) } >
              <div className='NcknZ'>
                <div className={ selectedItem && selectedItem.uid === item.uid ? 'zrDFO active' : 'zrDFO' }>
                  <div style={{ width: '15px', margin: '0 auto', marginTop: item.size === 3 ? '12px' : '8px' }}>
                    {/* <Image className={ 'mGPvl' } img={ CheckmarkIcon } alt={ 'checkmark icon' } width={ '15px' } height={ '15px' } /> */}
                  </div>
                </div>
                <div className='p5ho3' style={{ backgroundColor: item.color, backgroundImage: `url(` + item.image + `)`, padding: calculateCellPadding(name, item, items) }}></div>
              </div>
            </Grid>
          ))
        }
      </Grid>
    </Box>
  );
}



export default GridView;
