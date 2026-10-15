import { useState, useEffect } from 'react';



export default function useDrag(isResizing, setIsResizing, setLastDownX, index, width, itemSpecs, setItemSpecs, setNewWidth) {
    const [dragging, setDragging] = useState(false);
    let startPosition = 0
  
    useEffect(() => {
      if (!dragging) return;
  
      if (!isResizing) return;
  
      function handleMouseMove(e) {
        // if (dragging) console.log("I'm Dragging");
  
        if (!isResizing) return;
        if (startPosition === 0) startPosition = document.body.offsetWidth - e.clientX
  
        const position = document.body.offsetWidth - e.clientX
        // itemWidth - (document.body.offsetWidth - e.clientX)
  
        // let offsetRight = document.body.offsetWidth - (e.clientX - document.body.offsetLeft);
        let offsetRight = width - (position - startPosition)
        let minWidth = 50;
        let maxWidth = 820;
        if (offsetRight > minWidth && offsetRight < maxWidth) {
          let updatedSpecs = []
          for (let i = 0; i < itemSpecs.length; i++) {
            const itemSpec = itemSpecs[i]
            if (index) {
              if (i === index) {
                itemSpec.width = offsetRight
              }
            } else {
              if (i === 0) {
                itemSpec.width = offsetRight
              }
            }
  
            updatedSpecs.push(itemSpec)
          }
  
          setItemSpecs(updatedSpecs)
          // setNewWidth({ width: offsetRight })
        }
      }
  
      function handleMouseUp(e) {
        e.stopPropagation();
        e.preventDefault();
        setDragging(false);
        setIsResizing(false)
      }
  
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
  
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }, [dragging]);
    
    function handleMouseDown(e) {
      e.stopPropagation();
      e.preventDefault();
      setIsResizing(true)
      setLastDownX(e.clientX)
      setDragging(true);
    };
  
    const bindTrigger = {
      onMouseDown: handleMouseDown,
    }
  
    return [bindTrigger];
  }