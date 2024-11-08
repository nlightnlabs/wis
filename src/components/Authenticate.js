import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser, setIsAuthenticated } from '../redux/slices/authSlice';
import { setCurrentPage } from '../redux/slices/navSlice';
import * as nlightnlabsApi from '../apis/nlightnlabs'
import MultiInput from './MultiInput';

const Authenticate = () => {

    const dispatch = useDispatch();    
    const mode = useSelector((state) => state.environment.mode);

    const [authenticationError, setAuthenticationError] = useState(false)

    const [formData, setFormData] = useState({
      username: "",
      pwd: ""
    })

    const handleInputChange = (e)=>{
      let {name, value} = e.target
      if(name=="username"){
        value = value.toString().toLowerCase()
      }

      let new_data = {[name]: value}
      let updatedFormData = {...formData,...new_data}
      setFormData(updatedFormData)
  }
    

    const navigate = useNavigate();
    
    const handleSubmit = async ()=>{

      const userIsValidated = await nlightnlabsApi.authenticateUser(formData)

      if(userIsValidated){
       
        let user = await nlightnlabsApi.getUserInfo(formData.username)
     
        dispatch(setUser(user))
        dispatch(setIsAuthenticated(true))
        dispatch(setCurrentPage("event_staffing"))
        navigate('/event_staffing');
      }else{
        setAuthenticationError(true)
      }
    }


  return (
    <div className="flex flex-col w-[300px] fade-in">
        <div className={`flex flex-col mb-3 body-mode-${mode} w-full`}>
            <MultiInput 
              id="username"
              name="username"
              label="Username"
              className={`input-mode-${mode} w-full mb-3`} 
              placeholder="Username" 
              value = ""
              onChange={(e)=>handleInputChange(e)}
              style={{ outline: "none" }}
              />
        
        </div>

        <div className={`flex flex-col mb-3 body-mode-${mode}`}>
          <MultiInput
            id="pwd"
            name="pwd"
            label="Password"
            className={`input-mode-${mode} w-full mb-3`} 
            placeholder="Password" 
            value = "" 
            type="password"
            onChange={(e)=>handleInputChange(e)}
            style={{ outline: "none" }}
            />
        </div>

        <div className="flex justify-center">
          <button className={`button-mode-${mode}`} onClick={()=>handleSubmit()}>
            Sign In
          </button>
        </div>
          {authenticationError && <p className="text-red-500">Invalid Login</p>}
        
    </div>
  )
}

export default Authenticate
