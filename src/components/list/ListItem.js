import React from 'react';
// import Divider from '../divider/Divider';
import { useDrag } from 'react-dnd'
// import usFlag from '../../assets/images/usFlag.png';
// import ChatBubbleIcon from '../../assets/images/ChatBubble.svg';
// import UserIcon from '../../assets/images/User.svg';
// import AddIcon from '../../assets/images/Add.svg';
// import Popover from '../popover/Popover';
import { CapitalizeFirstLetter } from '@/lib/format/text';
// import Tooltip from '../../components/tooltip/Tooltip';

// import { GetData } from './ListItem_A';
import { ListColumnWidth } from '@/lib/tables/columns';
import { GetData } from '@/lib/data/getData';
import '@/components/list/ListItem.css';



const ListItem = ({ index, name, item, allUsers, allClients, allEmployees, showHeaders, headerTitles, companyInfo, onTap, editButtonPressed, openPopover, extraData, currentActiveControlItem, setCurrentActiveControlItem, onPress, innerRefs }) => {
  const data = GetData(showHeaders && headerTitles ? name : 'history', item, headerTitles, showHeaders && headerTitles ? allUsers : allClients, allEmployees)
  const [{isDragging}, drag] = useDrag(() => ({ type: "Cell", collect: monitor => ({ isDragging: !!monitor.isDragging(), }), }))
  // const [isCellSelected, setIsCellSelected] = useState(false)
  // const [newWidth, setNewWidth] = useState({})
  // const refContainer = useRef('');



  function cellPressed() {
    const selectedData = data
    // setCurrentActiveControlItem(currentActiveControlItem === selectedData.id ? null : selectedData.id)
    onPress(index, selectedData)
  }
  
  // <div className="DofYU" ref={ drag } style={{ opacity: isDragging ? 0.5 : 1, cursor: 'pointer', overflow: 'hidden', borderRadius: '3px' }} onClick={ onTap ? () => onTap(item) : () => editButtonPressed(item) }>
  const SectionCell = () => {
    return (
      <div className="XtTbM">
        <div className="DofYU" ref={ drag } style={{ opacity: isDragging ? 0.5 : 1, cursor: 'pointer', borderRadius: '3px' }} >
          {
            headerTitles.map(header => (
              <div key={ name !== 'reports' || header.type !== 'ref' ? header.uid : header.options.ref[0].value } className={ 'w2giB' } id={ 'DRYuc' } style={{ position: 'relative', width: ListColumnWidth(header.uid) }}>
                {
                  (header.uid === '34057' || header.uid === '10990' || header.uid === '71130' || header.uid === '55410') &&
                   <div className='i8wFw' style={{ width: '8px', height: '100%', backgroundColor: name === 'employees' ? '#717FF6' : name === 'clients' ? '#18B5BF' : name === 'trips' ? '#D93F67' : '#FCBC05', position: 'absolute', left: '0', borderTopLeftRadius: '3px', borderBottomLeftRadius: '3px' }}></div>
                }

                <div style={{ width: '60%', margin: header.uid === '34057' || header.uid === '10990' ? '0px 0px 0px 20px' : '0 auto' }} onClick={ onTap ? () => onTap(item) : () => editButtonPressed(item) }>
                  <div style={{ display: 'flex', margin: '0 auto' }}>
                    <div className='rergB' style={{ display: name !== 'reports' || header.type !== 'ref' ? header.type === 'phone' && data[header.uid] !== '' ? 'block' : 'none' : header.options.ref[0].type === 'phone' && data[header.options.ref[0].value] !== '' ? 'block' : 'none' }}><img src={usFlag} alt='usaflag' style={{ maxHeight: '100%' }} /></div>
                    <p className='zycX0' style={{ width: '100%', textAlign: header.uid === '34057' || header.uid === '10990' || header.uid === '71130' || header.uid === '55410' ? 'left' : 'center' }}>{ data[name !== 'reports' || header.type !== 'ref' ? header.uid : header.options.ref[0].value] }</p>
                  </div>
                </div>

                <div style={{ width: '100px', display: (header.uid === '34057' || header.uid === '10990') && data['comments'] ? 'block' : 'none', marginLeft: 'auto', overflow: 'hidden' }} onClick={ () => console.log('comments...') }>
                  <div className='iDAcc' style={{ display: 'none' }}></div>
                  <div style={{ width: '20px', height: '20px', margin: '0 auto', marginTop: '16px' }}>
                    <img src={ ChatBubbleIcon } alt='chatBubble' style={{ maxHeight: '100%', filter: 'brightness(0) invert(0.4)' }} />
                  </div>
                </div>

                <div className='PbHWU' style={{ display: header.uid === '34057' ? 'block' : 'none' }} onClick={ () => cellPressed() }>

                    <div className='eDw4y'>
                      <img src={ AddIcon } alt='addIcon' style={{ maxHeight: '100%' }} />
                    </div>

                    <div style={{ width: '26px', height: '26px', margin: '0 auto', marginTop: '14px' }}>
                        {
                          data['userUID'] ?
                            <div style={{ width: '26px', height: '26px', backgroundColor: '#D93F67', borderRadius: '50%', overflow: 'hidden' }}>
                              <p style={{ margin: '0px', color: 'white', fontSize: '12px', fontWeight: 'bold', width: '100%', textAlign: 'center', marginTop: '5px' }}>{ CapitalizeFirstLetter(item.fName ? item.fName.charAt(0) : '') }{ CapitalizeFirstLetter(item.lName ? item.lName.charAt(0) : '') }</p>
                            </div>
                          :
                            <img src={ UserIcon } alt='userIcon' style={{ maxHeight: '100%', filter: 'brightness(0) invert(0.6)' }} />
                        }
                    </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    )
  }

  const HistoryCell = () => {
    return (
      <div>
        <div style={{ display: 'flex' }}>
          <p className='AmV4t' id='' style={{ margin: '0px', width: '90%' }}>{ data['16538'] }</p>
          <p className='AmV4t' id=''>{ data['95242'] }</p>
        </div>
        <div>
          <p className='dvhR4' id='e7L1P' name='name'>{ data['71130'] ? data['71130'] : data['46783'] }</p>
          <p className='dvhR4' id='rqOwT'>{ data['97264'] }</p>
          <p className='dvhR4' id='YaKzn' style={{ margin: '0px' }}>{ data['32168'] ? data['32168'] : '' }</p>
        </div>

        {/* <Divider width={ '100%' } height={ '1px' } color={ 'lightGray' } /> */}
      </div>
    )
  }


  return (
    <div key={ item.id }>
      {
        showHeaders && headerTitles ?
          <>
            <SectionCell />
          </>
        :
          <>
            <HistoryCell />
          </>
      }
  </div>
  )
}



export default ListItem
{/* <div key={ item.id } ref={ ref => { if (ref) innerRefs.current[index] = ref } }> */}