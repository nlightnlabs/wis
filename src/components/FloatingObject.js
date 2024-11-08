import React, {useRef, useState, useEffect} from "react"

const FloatingObject = (props) => {
    const { children, left, top, height, width, display, objectData, updateParent } = props;
    
    const objectRef = React.useRef();
    const allowDrag = true

    const [position, setPosition] = React.useState({ x:left , y: top });
    const [isDragging, setIsDragging] = React.useState(false);
    const [offset, setOffset] = React.useState({ x: 0, y: 0 });


    const containerStyle = {
      position: "absolute",
      cursor: "move",
      zIndex: 999,
      height: height,
      width: width
    };
  
    const handleMouseDown = (e) => {
      if (!allowDrag) return;
      setIsDragging(true);
      setOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    };

    const handleMouseUp = (e) => {
        setIsDragging(false)
        updateParent({...objectData,
          ...{["x"]:position.x},
          ...{["y"]:position.y}
        })
    };
  
    const handleMouseMove = (e) => {
      if (!isDragging || !allowDrag) return;
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      });
    };

  
    return (
      <div
        ref={objectRef}
        className="d-flex flex-column"
        style={{
          ...containerStyle,
          left: position.x + "px",
          top: position.y + "px",
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onDoubleClick={handleMouseUp}
      >
        <div className="d-flex flex-wrap">
          {children}
        </div>
      </div>
    );
  };

  export default FloatingObject