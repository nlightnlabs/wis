import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser, setIsAuthenticated } from '../redux/slices/authSlice';
import { setCurrentPage } from '../redux/slices/navSlice';
import * as oomnielabsApi from '../apis/oomnielabs'

const NewUser = () => {

    const dispatch = useDispatch();    
    const mode = useSelector((state) => state.environment.mode);

    const [authenticationError, setAuthenticationError] = useState(false)
    const [passwordMatchError,setPasswordMatchError] = useState(false)

    const [formData, setFormData] = useState({
      username: "",
      pwd: "",
      confirm_pwd:""
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
      console.log(formData)

      const userIsValidated = await oomnielabsApi.authenticateUser(formData)
      console.log(userIsValidated)

      if(userIsValidated){
        let user = await oomnielabsApi.getUserInfo(formData.username)
        dispatch(setUser(user))
        dispatch(setIsAuthenticated(true))
        dispatch(setCurrentPage("apps"))
        navigate('/apps');
      }else{
        setAuthenticationError(true)
      }
    }


  return (
    <div className="flex flex-col w-[300px] fade-in">

        <div className={`flex flex-col mb-3 body-mode-${mode} w-full`}>
            <input 
              name="email"
              className={`input-mode-${mode} w-full`} 
              placeholder="Username" 
              value = {formData.email} 
              type="email"
              onChange={(e)=>handleInputChange(e)}>
            </input>
        </div>

        <div className={`flex flex-col mb-3 body-mode-${mode} w-full`}>
            <input 
              name="username"
              className={`input-mode-${mode} w-full`} 
              placeholder="Username" 
              value = {formData.username} 
              onChange={(e)=>handleInputChange(e)}>
            </input>
        </div>

        <div className={`flex flex-col mb-3 body-mode-${mode}`}>
          <input
            name="pwd"
            className={`input-mode-${mode} w-full`} 
            placeholder="Password" 
            value = {formData.password} 
            type="password"
            onChange={(e)=>handleInputChange(e)}>
            </input>
        </div>


        <div className={`flex flex-col mb-3 body-mode-${mode}`}>
          <input
            name="confirm_pwd"
            className={`input-mode-${mode} w-full`} 
            placeholder="Confirm Password" 
            value = {formData.password} 
            type="password"
            onChange={(e)=>handleInputChange(e)}>
            </input>
            {passwordMatchError && <p className="text-red-500">"Password doesn't match"</p>}
        </div>

        <div className={`button-mode-${mode}`} onClick={()=>handleSubmit()}>Sign In</div>
        {authenticationError && 
          <div>
            <p className="text-red-500">User exists</p> 
            <p
              className="text-gray-500 cursor-pointer" 
              onClick={(e)=>navigate("/signin")}>Click her to sign in</p>
          </div>

        }
    </div>
  )
}

export default NewUser
