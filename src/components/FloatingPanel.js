import React, {useRef, useState, useEffect} from "react"
import { toProperCase } from "../functions/formatValue";
import Svg from "./Svg"

const FloatingPanel = (props) => {
    const { children, title, height, width, headerColor, headerTextColor, backgroundColor, border, rounded, shadow, displayPanel, theme} = props;
    
    const panelRef = React.useRef();
    const allowDrag = true

    const [position, setPosition] = React.useState({ x: 0.5*window.innerWidth, y: 0.5*window.innerHeight });
    const [isDragging, setIsDragging] = React.useState(false);
    const [offset, setOffset] = React.useState({ x: 0, y: 0 });

  
    const containerStyle = {
      position: "fixed",
      height: height,
      width: width,
      maxHeight: "80vh",
      maxWidth: "60vw",
      transform: "translate(-50%, -50%)",
      cursor: "move",
      zIndex: 99999,
      overflow: "hidden",
      backgroundColor: backgroundColor || "white",
      border: props.border || "1px solid gray",
      borderRadius: props.rounded || "10px"
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
    };
  
    const handleMouseMove = (e) => {
      if (!isDragging || !allowDrag) return;
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      });
    };

    const HeaderStyle={
      backgroundColor:"rgb(235,235,235)", 
      height:"50px", 
      overflow:"hidden",
      borderBottom: "2px solid gray",
      backgroundColor: headerColor || "rgb(0,100,225)"
    }

    const TitleStyle = {
      fontSize:"20px", 
      color: headerTextColor || "white", 
      fontWeight: "bold",
    }

    const BodyStyle = {
        height: "95%", 
        width: "100%", 
        overflowY:"auto", 
        overflowX: "hidden",
    }
  

  
    return (
      <div
        ref={panelRef}
        className={`flex flex-col panel-theme-${theme} shadow border border-3 rounded-3`}
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
        <div className="flex justify-between items-center" style={HeaderStyle}>
          
          <div className="flex ms-2 items-center justify-start" style={TitleStyle}>
            {title && toProperCase(title.replaceAll("_"," "))}
          </div>

          <div 
            title = "Close Panel"
            className="flex items-center me-2" 
            style={{height: "30px", width:"30px", pointer:"cursor"}}
            onClick={(e)=>displayPanel(false)}>
            <Svg iconName={"CloseIcon"} fillColor="rgb(200,200,200)"/>
          </div>

        </div>

        <div className="flex h-[100%] flex-wrap p-3">
          {children}
        </div>
        
      </div>
    );
  };

  export default FloatingPanel