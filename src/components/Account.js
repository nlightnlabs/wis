import React, { useState, useEffect } from 'react';
import Input from './Input'


const Account = ({formData, setFormData, updatedFormData, setUpdatedFormData, userNameExistsError, requiredFields}) => {

    const [passwordMatchError,setPasswordMatchError] = useState(false)
    const [passwordMatches,setPasswordMatches] = useState(passwordMatchError)

    const handleInputChange = async (e)=>{
      let {name, value} = e
    
      if(name=="username"){
        value = value.toString().toLowerCase()
      }

      if(name=="confirm_pwd" && value !==updatedFormData.pwd && updatedFormData.pwd.length>0){
        setPasswordMatchError(true)
        setPasswordMatches(false)
      }else if(name=="confirm_pwd" && updatedFormData.pwd.length>0 && value ===updatedFormData.pwd){
        setPasswordMatchError(false)
        setPasswordMatches(true)
      }else{
        setPasswordMatchError(false)
        setPasswordMatches(false)
      }

      setUpdatedFormData({...updatedFormData,...{[name]: value}})
  }
  

  return (
    <div className="flex flex-col w-full h-auto fade-in">

          <Input
            id="username"
            name="username"
            label="Username"
            value={formData.username}
            onChange = {(e)=>handleInputChange(e)}
            required = {requiredFields.includes("username")}
          />
          {userNameExistsError && 
            <p className="text-red-500 fade-in text-[12px]">User exists.  Please enter another username</p> 
          }

          <Input
            id="pwd"
            name="pwd"
            label="Password"
            type="password"
            value=""
            onChange = {(e)=>handleInputChange(e)}
          />

          <Input
            id="confirm_pwd"
            name="confirm_pwd"
            label="Confirm Password"
            type="password"
            value=""
            onChange = {(e)=>handleInputChange(e)}
          />

          {passwordMatchError && <p className="text-red-500 text-center text-[12px]">Password doesn't match</p>}
          {passwordMatches && <p className="text-green-500 text-center text-[12px]">Password matches</p>}

        
    </div>
  )
}

export default Account
