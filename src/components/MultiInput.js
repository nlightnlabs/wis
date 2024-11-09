import React, {useState, useEffect, useRef} from 'react'
import { useSelector } from 'react-redux';
import * as styleFunctions from '../functions/styleFunctions'
import * as formatValue from '../functions/formatValue'

const MultiInput = (props) => {

const updateParent  = props.onChange
const list = props.list || []
const [options, setOptions] = useState([])
const mode = useSelector(state=>state.environment.mode)

const id = props.id || ""
const name = props.name || ""
const label = props.label || ""
const type = props.type || "text"

const [value, setValue] = useState(props.value || "")
const [showDropdown, setShowDropdown] = useState(false)

const classNameMain = props.classNameMain || `input-maincontainer-mode-${mode}`
const classNameInput = props.classNameInput || `input-input-mode-${mode}`
const classNameLabel = props.classNameLabel || `input-label-mode-${mode}`
const classNameDropdown = props.classNameDropdown || `input-dropdown-mode-${mode}`
const classNameOption = props.classNameOption || `input-option-mode-${mode}`

const required = props.required || false
const disabled = props.disabled || false
const readonly = props.readonly || false
const abbreviate = props.abbreviate || false

const dropdownRef = useRef()
const [containerHeight, setContainerHeight] = useState(null)


useEffect(()=>{
    setValue(props.value)
},[props.value])

useEffect(()=>{
if (props.list && props.list.length>0){
    setOptions(props.list)
    }
},[])


const [inputData, setInputData] = useState({})
const inputRef = useRef(null)
const labelRef = useRef(null);
const [inputProps, setInputProps] = useState({ 
    width: props.width || "100%", 
    height: props.labelFontSize + props.valueFontSize + 15 || 50, 
    top: 0, 
    left: 0,
    padding: 5
});

const [mainContainerStyle, setMainContainerStyle] = useState({})
const [labelStyle, setLabelStyle] = useState({});
const [inputFontStyle, setInputFontStyle] = useState({
    textAlign: "left",
});

useEffect(() => {

  if (inputRef.current) {
    const { width, height, top, left } = inputRef.current.getBoundingClientRect();
    setInputProps({ width, height, top, left });
  }


}, []); 


const handleInputClick = ()=>{
    if(list.length>0){
        setOptions(list)
        setShowDropdown(true)
    }
    // changeLabelFontSize()
    const labelFontSizeNum = parseFloat(styleFunctions.getFontSize(classNameLabel));
    setLabelStyle({
        fontSize: `${labelFontSizeNum * 0.75}px`,       // Shrink by 50%
        transform: `translateY(-${labelFontSizeNum-5}px)`, // Move up by input font size
        transition: 'font-size 0.3s ease, transform 0.3s ease' // Smooth transition
      });
}


const handleLeave = (e)=>{
    setShowDropdown(false)
}

const changeLabelFontSize = (value) =>{

    const labelFontSizeNum = parseFloat(styleFunctions.getFontSize(classNameLabel));

    if(value){
        setLabelStyle({
        fontSize: `${labelFontSizeNum * 0.75}px`,       // Shrink by 50%
        transform: `translateY(-${labelFontSizeNum-5}px)`, // Move up by input font size
        transition: 'font-size 0.3s ease, transform 0.3s ease' // Smooth transition
      });
    }

    else{
        setLabelStyle({
                fontSize: `${labelFontSizeNum}px`,       // Shrink by 50%
                transform: `translateY(0)`, // Move up by input font size
                transition: 'font-size 0.3s ease, transform 0.3s ease' // Smooth transition
            });
        }
}

useEffect(()=>{
    changeLabelFontSize(value)
},[value])

const handleInputChange = (e)=>{
   
    let {name, value} = e.target
    setValue(value)

    let filteredOptions = []
    if (value.length > 0) {
        filteredOptions = options.filter(item=>
            item && String(item).toLowerCase().includes(value.toLowerCase())
        );
        setOptions(filteredOptions)
    } else {
        setOptions(list)
    }
    
    setInputData({...inputData,"name": name, "value":value})
    if(typeof(updateParent) === "function"){
        updateParent(e)
    }      
}

const handleOptionClick = (item)=>{
    console.log(item)
    setValue(item)

    const e = {
        target: {
            name: name,
            value: item
        }
    }
    setShowDropdown(false)
    handleInputChange(e)
}



  return (
    <div 
        className={`${classNameMain}`} 
        style={mainContainerStyle}
        >

        {
            <div
                ref = {labelRef}
                id={`label_${id}`}
                htmlFor={`input_${id}`}
                className={`${classNameLabel}`}
                style={labelStyle}
            >
            {`${label}`} <span style={{color: "red"}}>{`${required ? "*" : ""}`}</span>
            </div>
        }
        
        <input 
            ref={inputRef} 
            className={classNameInput}
            style={inputFontStyle}
            id ={`input_${id}`}
            name={name}
            value = {formatValue.formatInput(value, type)}
            type={type==="password"? "password": "text"}
            onChange = {(e)=>handleInputChange(e)}
            onClick = {(e)=>handleInputClick()}
            readOnly = {readonly}
            disabled = {disabled}
            autoComplete="off" 
            >
        </input>

        {showDropdown && options.length>0 &&
            <div id="dropdown" ref={dropdownRef} className={classNameDropdown}  style={{height:"200px", top: inputProps.height}} onMouseLeave={()=>handleLeave()}>
                {options.map((item,index)=>(
                    <div 
                        key={index} 
                        className={`${classNameOption} fade-in`}
                        onClick={(e)=>handleOptionClick(item)}
                        >
                        {item}
                    </div>
                ))}
            </div>
        }
    </div>
  )
}

export default MultiInput