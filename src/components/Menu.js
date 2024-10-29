import React, {useState, useEffect, useContext, useRef, createRef} from "react"
import Svg from "./Svg.js"
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-mode-quartz.css"; // Optional mode applied to the grid

import { useSelector, useDispatch } from 'react-redux'
import { setCurrentPage, setPageList } from '../redux/slices/navSlice'


const Menu = (props) =>{

    const menuItems = props.menuItems || []
    const colormode = props.colormode.toLowerCase() || "white"
        
    const dispatch = useDispatch()

    const [isExpanded, setExpanded] = useState(false)
    const [sections, setSections] = useState([])
    const [hoveredItem, setHoveredItem] = useState("none");

    const colormodes = [
        {id: 1, name: "black", menuColor: "linear-gradient(180deg,black, gray)", iconColor: "white", labelColor: "white", hoverColor: "lightgray", iconHoverColor: "gray", labelHoverColor: "gray"},
        {id: 2, name: "white", menuColor: "white", iconColor: "rgb(200,200,200)", labelColor: "rgb(200,200,200)", hoverColor: "rgb(200,200,200)", iconHoverColor: "gray", labelHoverColor: "gray"},
        {id: 3, name: "nlightn labs", menuColor: "linear-gradient(180deg,rgb(0,100,225),rgb(0,200,225))", iconColor: "white", labelColor: "white", hoverColor: "rgba(255,255,255,0.25)", iconHoverColor: "white", labelHoverColor: "white"},
        {id: 4, name: "records depot", menuColor: "linear-gradient(180deg,rgb(150,100,75),rgb(200,200,225))", iconColor: "white", labelColor: "white", hoverColor: "rgba(255,255,255,0.25)", iconHoverColor: "white", labelHoverColor: "white"}
    ]

    const getSections = (menuItems)=>{
        const menuSets = new Set()
        menuItems.map((item)=>{
            menuSets.add(item.section)
        })
        const menuList = Array.from(menuSets)
        setSections(menuList)
    }

    // Function to dynamically create refs based on the names or IDs
    const menuItemRefs = useRef({});
    const menuItemIconRefs = useRef({});
    const menuItemLabelRefs = useRef({});

    const createRefs = async (menuItems) => {
        let refList = {};
        menuItems.forEach((item) => {
            refList[item.name] = createRef();
        });
        menuItemRefs.current = refList;
    };

    const [menuColor, setMenuColor] = useState("white")
    const [iconColor, setIconColor] = useState("lightgray")
    const [labelColor, setLabelColor] = useState("white")
    const [hoverColor, setHoverColor] = useState("lightgray")
    const [iconHoverColor, setIconHoverColor] = useState("gray")
    const [labelHoverColor, setLabelHoverColor] = useState("gray")

    const getmodeColors = ()=>{
        console.log("colormode",colormode)
        setMenuColor(colormodes.find(i=>i.name===colormode).menuColor)
        setIconColor(colormodes.find(i=>i.name===colormode).iconColor)
        setLabelColor(colormodes.find(i=>i.name===colormode).labelColor)
        setHoverColor(colormodes.find(i=>i.name===colormode).hoverColor)
        setIconHoverColor(colormodes.find(i=>i.name===colormode).iconHoverColor)
        setLabelHoverColor(colormodes.find(i=>i.name===colormode).labelHoverColor)
    }

    useEffect(()=>{
        getSections(menuItems)
        createRefs(menuItems)
        getmodeColors()
    },[menuItems])

    const MenuStyle = {
        position: "absolute",
        height: "100%",
        width: isExpanded? "250px" : "50px",
        backgroundImage: menuColor,
        transition: "0.3s",
        color: labelColor,
        right: 0
    }

    const MenuSectionStyle = {
        width: "100%",
        marginBottom: "20px",
    }


    const MenuItemStyle = {
        width: "100%",
        height: "100%",
        padding: "5px",
        cursor: "pointer",
        marginBottom: "5px",
        transition: "0.2s"
    }

    const MenuItemLabelStyle = {
        display: "flex-box",
        alignItems: 'center',
        transition: "0.2s",
        color: labelColor
    }

    const MenuIconStyle = {
        height: "50px",
        width: "50px",
        opacity: "1",
        color: iconColor,
        cursor: "pointer",
        transition: "0.2s"
    }

    const hover = (e,itemName)=>{
        setHoveredItem(e.type ==="mouseover" ? itemName : "none")
    }



  return (
    <div className="d-flex flex-column" 
            style={{...MenuStyle,
                ...{["opacity"]: isExpanded && 0.75}}
            }>
            <div 
                onClick={(e)=>setExpanded(!isExpanded)}
                style={{...MenuIconStyle,
                ...{["transform"]: isExpanded && "scaleX(-1)"}
                }}
                className="d-flex justify-content-center"
            >
                <Svg 
                    iconName="AngleArrowIcon"
                    fillColor={iconColor}
                    fillOpacity="1"
                />
            </div>

        <div>
           {sections.map((section,index)=>(
                <div key={index} className="d-flex flex-column w-100" 
                    style={{...MenuSectionStyle,...{["borderTop"]: section >1 && `1px solid ${labelColor}`}}}>
                    
                    {menuItems.map((item,index)=>(
                        item.section === section &&
                        <div 
                            ref = {menuItemRefs[index]}
                            title={item.label}
                            id={`menu_item_${item.name}`}
                            className={`d-flex align-items-center ${!isExpanded ? "justify-content-center" : "justify-content-start"}`}
                            style={{...MenuItemStyle,
                                ...{["backgroundColor"]:hoveredItem ===item.name ? hoverColor: null},
                                ...{["color"]:hoveredItem ===item.name? hoverColor: labelColor}
                            }}
                            key={item.id}
                            onClick={(e)=>dispatch(setCurrentPage(item.name))}
                            onMouseOver = {(e)=>hover(e, item.name)}
                            onMouseLeave = {(e)=>setHoveredItem(null)}
                        >
                            <Svg
                                ref={menuItemIconRefs[index]}
                                id={`${item.name}_icon`}
                                style = {MenuIconStyle}
                                name={item.icon}
                                iconName={item.icon}
                                fillColor={hoveredItem === item.name ? iconHoverColor : iconColor}
                                fillOpacity={MenuIconStyle.opacity}
                                height = "30px"
                                width = "30px"
                                hoveredItem = {hoveredItem}
                                onClick={(e, item) => dispatch(setCurrentPage(item.name))}
                            />
      
                            {isExpanded && 
                                <div 
                                    ref = {menuItemLabelRefs[index]}
                                    id={`menu_item_${item.name}_label`}
                                    name={item.name}
                                    className="d-flex ms-2"
                                    style={{...MenuItemLabelStyle,
                                        ...{["color"]:hoveredItem ===item.name? labelHoverColor: labelColor}
                                    }}
                                    onClick={(e)=>dispatch(setCurrentPage(item.name))}
                                >
                                    {item.label} 
                               </div>
                            }
                        </div>
                    ))}
                </div>
           ))}
            
        </div>
    </div>
  );
}

export default Menu;