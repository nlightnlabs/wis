import React, {useState, useRef, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMode } from '../redux/slices/envSlice.js';
import { setIsAuthenticated } from '../redux/slices/authSlice';
import { clearAllStorage } from '../redux/store';
import { Navigate, useNavigate } from 'react-router-dom';
import Svg from './Svg.js'
import Input from './Input.js';

const Header = () => {

  const dispatch = useDispatch();
  const mode = useSelector((state) => state.environment.mode);
  const user = useSelector((state) => state.authentication.user);
  const isAuthenticated = useSelector((state) => state.authentication.isAuthenticated);
  const [showBrightnessOptions, setShowBrightnessOptions] = useState(false);
  const [brightnessIconProps, setBrightnessIconProps] = useState({ top: 0, left: 0, height: 0 });

  const navigateTo = useNavigate()
  
  const handleSignOut = ()=>{
    dispatch(clearAllStorage())
    dispatch(setIsAuthenticated(false))
    navigateTo("/")
  }

  const modes = [
    {id: 1, name:"dark", label: "Dark"},
    {id: 1, name:"light", label: "Light"},
  ]

  const brightnessRef = useRef()
  useEffect(() => {
    if (brightnessRef.current) {
      const iconPosition = brightnessRef.current.getBoundingClientRect();
      setBrightnessIconProps(iconPosition);
    }
  }, [showBrightnessOptions]);


  return (

    <div className={`flex w-100 h-[75px] justify-between items-center border-b-[1px] border-b-gray-300 bg-mode-${mode} transition duration-500 fade-in z-50`}>

      <div className="flex w-full md:w-1/2 ms-3 align-items-center">
      <img 
          src={`https://nlightnlabs01.s3.us-west-1.amazonaws.com/wis/graphics/images/wis_logo_${mode}.png`} 
          alt="Logo" 
          className="h-[50px] w-40px fade-in transition duration-500" />
      </div>

      <div 
      className={`flex relative right-0 justify-end items-center me-5`}>
        
        <div className="ms-2 me-2" onClick={()=>navigateTo("/home")} title="Apps Home Page">
          <Svg 
            iconName = "HomeIcon"
            height = "30px"
            width = "30px"
            fillColor = {`rgb(200,200,200)`}
            cursor="pointer"
            />
        </div>

        <div className="ms-2 me-2" onClick={()=>navigateTo("/settings")} title="Settings">
          <Svg 
            iconName = "SettingsIcon"
            height = "30px"
            width = "30px"
            fillColor = {`rgb(200,200,200)`}
            cursor="pointer"
            />
        </div>

        <div 
          ref={brightnessRef}
          className="flex ms-2 me-2 border-1 border-red-500 items-end z-50" 
          onClick={(e)=>setShowBrightnessOptions(!showBrightnessOptions)} title="Dark/Light Mode"
          >
          <Svg 
            iconName = "BrightnessIcon"
            height = "30px"
            width = "30px"
            fillColor = {`rgb(200,200,200)`}
            cursor="pointer"
          />
          </div>
        
          <div className={`flex flex-col justify-center items-center h-100 body-mode-${mode} me-5 ms-5`}>
            <div>{user.first_name}</div>
            <div className={`text-[12px] cursor-pointer p-1 secondary-color-mode-${mode} hover:bg-[rgb(200,200,200)] hover:text-gray-600 ps-1 pe-1 rounded-md`} onClick={(e)=>handleSignOut()}>Sign Out</div>
          </div>

      </div>

      {showBrightnessOptions &&            
              <div 
                className={`flex flex-col panel-mode-${mode} w-[100px] h-[auto] p-2 transition duration-500 rounded-md`} 
                style={{position: "absolute", top: `${brightnessIconProps.top+brightnessIconProps.height}px`, left: `${brightnessIconProps.left - 50}px`, zIndex:9999}}
                onMouseLeave={(e)=>setShowBrightnessOptions(false)}
                >
              {
                modes.map((item, index)=>(
                  <div 
                    key={index} 
                    className={`input-option-mode-${mode} p-3`}
                    onClick={(e)=>dispatch(setMode(item.name))}
                    >
                    {item.label}
                  </div>
                ))
              }
            </div>
        }

    </div>
  );
};

export default Header;