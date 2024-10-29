import React, {useState, useEffect, useRef} from 'react'

const Input = (props) => {

const updateParent  = props.onChange
const list = props.list || []
const [options, setOptions] = useState([])

useEffect(()=>{
console.log(list)
if (list && list.length>0){
    setOptions(list)
}
},[props])


const [inputData, setInputData] = useState({})
const inputRef = useRef(null)
const [container, setContainer] = useState({ 
    width: props.width || "100%", 
    height: props.labelFontSize + props.valueFontSize + 15 || 50, 
    top: 0, 
    left: 0,
    padding: 5
});

useEffect(() => {
console.log(`${props.borderThickness || "1"}px ${props.borderStyle || "solid"} ${props.borderColor || "rgba(200,200,200,1)"}`)
  if (inputRef.current) {
    const { width, height, top, left } = inputRef.current.getBoundingClientRect();
    setContainer({ width, height, top, left });
  }
}, []); 

const id = props.id || ""
const name = props.name || ""
const label = props.label || ""
const type = props.type || "text"


const [value, setValue] = useState(props.value)
const [showDropdown, setShowDropdown] = useState(false)


const mainContainer = {
    position: "relative",
    display: "flex",
    height: container.height,
    width: container.width,
    backgroundColor: "rgba(0,0,0,0)",
    border: `${props.borderThickness || "1"}px ${props.borderStyle || "solid"} ${props.borderColor || "rgba(200,200,200,1)"}`,
    borderRadius: props.borderRadius || 5,
    boxShadow: props.shadow || "5px 5px 15px rgba(0,0,0,0)",
    marginTop: props.marginTop || 0,
    marginBottom: props.marginBottom || 5,
    marginLeft: props.marginLeft || 0,
    marginRight: props.marginRight || 0,
    padding: container.padding,
    // overflow: "hidden"
}


const valueStyle = {
    position: "absolute",
    top: 0,
    left: 5,
    color: props.valueColor || "black",
    backgroundColor: props.valueBackground || "rgba(200,200,200,0)",
    borderRadius: props.labelRadius || 0,
    height: props.valueHeight || "100%",
    width: props.valueWidth - container.padding || "100%",
    paddingTop: props.valueTopPadding || 10,  // Adjust to push text down
    paddingBottom: props.valueBottomPadding || 0,
    marginTop: props.valueTopMargin || 0,
    marginBottom: props.valueBottomMargin || 0,
    marginLeft: props.valueLeftMargin || 0,
    marginRight: props.valueRightMargin || 0,
    outline: "none",
    boxSizing: "border-box",
    lineHeight: "1.5",   // Set line height to control vertical alignment
    fontSize: props.valueFontSize || 14     // Set font size for alignment consistency
};


const [labelStyle, setLabelStyle] = useState({
    position: "absolute",
    display: "flex",
    left: 5,    
    color: props.labelColor || "gray",
    fontSize: props.labelFontSize || 14,
    backgroundColor: props.labelBackground || "rgba(0,0,0,0)",
    borderRadius: props.labelRadius || 0,
    width: props.width || "100%",
    height: container.height,
    topPadding: props.labelTopPadding || 0,
    bottomPadding: props.labelBottomPadding || 0,
    leftPadding: props.labelLeftPadding || 0,
    rightPadding: props.labelRightPadding || 0,
    topMargin: props.labelTopMargin || 0,
    bottomMargin: props.labelBottomMargin || 0,
    leftMargin: props.labelLeftMargin || 0,
    rightMargin: props.labelRightMargin || 0,
    transformOrigin: "top left",
    transform: "scale(1)",
    transition: "all 500ms ease",
    alignItems: props.value.length == 0 ? "center" : "flex-top"
})

const dropdownStyle = {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    zIndex: 9999,
    top: container.height,
    left: inputRef.left,
    color: props.dropdownColor || "rgba(200,200,200,0.5)",
    backgroundColor: props.dropdownBackgroundColor || "rgba(200,200,200,0.5)",
    border: props.dropdownBorder || "3px solid rgba(200,200,200,0.5)",
    borderRadius: props.dropdownRadius || 5,
    boxShadow: props.dropdownShadow || "5px 5px 10px rgba(200,200,200,0.5)",
    height: props.dropdownHeight || "200px",
    width: props.dropdownWidth || "100%",
    borderRadius: "5px",
    overflowY: "auto",
    transition: "all 500ms ease" // applies transition to all properties
}


const optionStyle = {
    display: "flex",
    flexAlign: "center",
    color: props.optionColor || "rgb(0,0,0,1)",
    backgroundColor: props.optionBackgroundColor || "rgba(0,0,0,0)",
    borderRadius: props.optionRadius || 0,
    paddingTop: props.optionTopPadding || 5,
    paggingBottom: props.optionBottomPadding || 5,
    paddingLeft: props.optionLeftPadding || 5,
    paddingRight: props.optionRightPadding || 5,
    marginTop: props.optionTopMargin || 0,
    marginBottom: props.optionBottomMargin || 0,
    martingLeft: props.optionLeftMargin || 0,
    marginRight: props.optionRightMargin || 0,
    cursor: "pointer",
    alignItems: "center",
    transition: "all 200ms ease"
}

const handleInputClick = ()=>{
    
    if (options && options.length > 0) {
        setShowDropdown(true)
    }
}

const handleInputFocus = (e) => {
    
    if (e.type === "focus" || value.length > 0) {
        setLabelStyle((prevStyle) => ({
            ...prevStyle,
            transform: "scale(0.75) translateY(-20%)", // Adjust translateY for "flex-start" effect
        }));
    } else {
        setLabelStyle((prevStyle) => ({
            ...prevStyle,
            transform: "scale(1) translateY(0)",
        }));
    }
};

const handleLeave = (e)=>{
    setShowDropdown(false)
}


const handleInputChange = (e)=>{
    let {name, value} = e.target
    setValue(value)

    if (value.length > 0) {
        setLabelStyle((prevStyle) => ({
            ...prevStyle,
            transform: "scale(0.75) translateY(-20%)", // Adjust translateY for "flex-start" effect
        }));
    } else {
        setLabelStyle((prevStyle) => ({
            ...prevStyle,
            transform: "scale(1) translateY(0)",
        }));
    }

    let filteredOptions = []
    if (value.length > 0){
        filteredOptions = options.filter(items =>items.includes(value))
    }else{
        filteredOptions = props.list
    }
    
    setOptions(filteredOptions)

    setInputData({...inputData,"name": name, "value":value})
    if(typeof(updateParent) === "function"){
        console.log({...inputData,"name": name, "value":value})
        updateParent({...inputData,"name": name, "value":value})
    }

}

const handleOptionClick = (item)=>{
    setValue(item)

    const e = {
        target: {
            name: name,
            value: item
        }
    }
    
    handleInputChange(e)
}

const onMouseOver = (e)=>{    
    e.target.style.backgroundColor = "rgb(200,200,200)"
    e.target.style.fontWeight = "bold"
}

const onMouseLeave = (e)=>{    
    e.target.style.backgroundColor = optionStyle.backgroundColor
    e.target.style.fontWeight = "normal"
}


  return (
    <div style={mainContainer} ref={inputRef} onMouseLeave={()=>handleLeave()}>

        {
            <div
                id="label"
                htmlFor="input"
                style={labelStyle}
            >
            {label}
            </div>
        }
        
        <input 
            style={valueStyle}
            id = "input"
            name={name}
            value = {value}
            type = {type}
            onFocus={(e)=>handleInputFocus(e)}
            onBlur={(e)=>handleInputFocus(e)}
            onChange = {(e)=>handleInputChange(e)}
            onClick = {(e)=>handleInputClick()}
            >
        </input>
        
       
        
        {showDropdown && options.length>0 &&
            <div id="dropdown" style={dropdownStyle} className="fade-in">
                {options.map((item,index)=>(
                    <div 
                        key={index} 
                        style={optionStyle} 
                        onClick={(e)=>handleOptionClick(item)}
                        onMouseOver={(e)=>onMouseOver(e)}
                        onMouseLeave={(e)=>onMouseLeave(e)}
                        >
                        {item}
                    </div>
                ))}
            </div>
        }
</div>
  )
}

export default Input
