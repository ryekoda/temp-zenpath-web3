"use client"
import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { usePopper } from 'react-popper';
import { InnerToolTipContainer } from '@/components/old/ToolTip_Containers';
import { HeaderTitles } from '@/lib/GlobalFunctions';



const Tooltip = ({ children, name, currentUser, company, companySettings, profiles, trigger, position, isOpen, onItemPress, handleClose, autoCompleteData, data }) => {
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const [checkboxes, setCheckboxes] = useState([]);
  const { styles, attributes } = usePopper(trigger, popperElement, {
    placement: position,
    modifiers: [
      { 
        name: "arrow", options: { element: arrowElement } 
      },
      {
        name: "offset",
        options: {
          offset: [0, 10]
        }
      }
    ]
  });


  useEffect(() => {
    if (companySettings && name === 'visibleHeaders') {
      var items = []

      for (let i = 0; i < HeaderTitles(companySettings, false).length; i++) {
        const header = HeaderTitles(companySettings, false)[i]

        if (header.title !== 'name' && header.title !== 'client') {
          items.push(header)
        }
      }

      setCheckboxes(items)
    }
  }, [ companySettings, name ]);


  return (
    <div className='w-screen h-screen bg-transparent top-0 left-0 z-[9000] absolute' style={{ visibility: isOpen ? 'visible' : 'hidden' }}>
      <div className='w-full h-full bg-transparent' onClick={ () => handleClose() }></div>
      <TipWrapper ref={ setPopperElement } style={ styles.popper } { ...attributes.popper }>
        {
          (name === 'boardSettings') ?
            <InnerToolTipContainer name={ name } currentUser={ currentUser } company={ company } onPress={ onItemPress }/>
          : (name === 'filterProfiles') ?
            <InnerToolTipContainer name={ name } currentUser={ currentUser } company={ company } profiles={ profiles } onPress={ onItemPress }/>
          : (name === 'visibleHeaders') ?
            <InnerToolTipContainer name={ name } currentUser={ currentUser } company={ company } checkboxes={ checkboxes } setCheckboxes={ setCheckboxes } onPress={ onItemPress }/>
          : (name === 'form-autocomplete') ?
            <InnerToolTipContainer name={ name } data={ autoCompleteData } currentUser={ currentUser } company={ company } onPress={ onItemPress }/>
          : (name === 'listHeaderOptions') ?
            <InnerToolTipContainer name={ name } data={ data } currentUser={ currentUser } company={ company } onPress={ onItemPress }/>
          : (name === 'addListColumn') ?
            <InnerToolTipContainer name={ name } data={ data } currentUser={ currentUser } company={ company } onPress={ onItemPress }/>
          : (name === 'billingOptions') ?
            <InnerToolTipContainer name={ name } data={ data } currentUser={ currentUser } company={ company } onPress={ onItemPress }/>
          :
            <>
              { children }
            </>
        }

        <TooltipArrow ref={ setArrowElement } style={ styles.arrow } />
      </TipWrapper>
    </div>
  )
}




const TooltipArrow = styled.div`
  width: 0.6rem;
  height: 0.6rem;
  &::before {
    content: "";
    background: white;
    width: 0.6rem;
    height: 0.6rem;
    transform: translate(-50%, -50%) rotate(45deg);
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const TipWrapper = styled.div`
  background: white;
  border-radius: 0.6rem;
  padding: 0.8rem;
  z-index: 9999;
  box-shadow: 3px 3px 10px 1px rgba(51, 102, 255, 0.3);

  &[data-popper-placement^="right"] {
    ${TooltipArrow} {
      left: 0px;
    }
  }

  &[data-popper-placement^="left"] {
    ${TooltipArrow} {
      right: 0px;
    }
  }

  &[data-popper-placement^="top"] {
    ${TooltipArrow} {
      bottom: 0px;
    }
  }

  &[data-popper-placement^="bottom"] {
    ${TooltipArrow} {
      top: 0px;
    }
  }
`;



export default Tooltip