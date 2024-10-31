import React, {useRef, useState, useEffect} from "react"
import { toProperCase } from "../functions/formatValue";
import Svg from "./Svg"

const FloatingPanel = (props) => {
    const { children, title, height, width, headerColor, headerTextColor, backgroundColor, border, rounded, shadow, displayPanel, color, theme} = props;
    
    console.log(backgroundColor)

    const panelRef = React.useRef();
    const allowDrag = true

    const [position, setPosition] = React.useState({ x: 0.5*window.innerWidth, y: 0.5*window.innerHeight });
    const [isDragging, setIsDragging] = React.useState(false);
    const [offset, setOffset] = React.useState({ x: 0, y: 0 });

  
    const containerStyle = {
      position: "fixed",
      display: "flex",
      flexDirection: "column",
      height: height,
      width: width,
      maxHeight: "80vh",
      maxWidth: "60vw",
      transform: "translate(-50%, -50%)",
      cursor: "move",
      zIndex: 99999,
      overflow: "hidden",
      color: color || "black",
      backgroundColor: backgroundColor || "rgb(235,235,235)",
      border: border || "2px solid rgb(200,200,200)",
      borderRadius: rounded || "10px",
      boxShadow: shadow || "5px 5px 15px rgba(200,200,200,0.5)"
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
      height:"50px", 
      overflow:"hidden",
      borderBottom: "1px solid rgb(200,200,200)",
    }

    const TitleStyle = {
      fontSize:"20px", 
      fontWeight: "bold",
    }

    const BodyStyle = {
        display: "flex",
        height: "100%", 
        width: "100%", 
        overflowY:"auto", 
        overflowX: "hidden",
        padding: "10px"
    }
  
    return (
      <div
        ref={panelRef}
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
            onClick={(e)=>displayPanel(false)}
          >
            <Svg iconName="CloseIcon" fillColor="rgb(200,200,200)"/>
          </div>

        </div>

        <div style={BodyStyle}>
          {children}
        </div>
        
      </div>
    );
  };

  export default FloatingPanel