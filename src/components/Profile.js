import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Input from './Input'
import { toProperCase } from '../functions/formatValue';

function Profile({formData, setFormData, updatedFormData, setUpdatedFormData, requiredFields}) {
  
  const handleInputChange = (e)=>{
    const {name,value} = e
    setUpdatedFormData({...updatedFormData,[name]:value})

  }
 
  return (
      
      <div className="flex flex-col w-full h-100">
        <form noValidate>
          {Object.entries(formData).map(([key,value],index)=>(
            <Input
              key={index}
              id={key}
              name={key}
              label={toProperCase(key.replace("_"," "))}
              value={value}
              type={`${key.toLowerCase().replace("_"," ").includes("email")? "email" : "text"}`}
              onChange = {(e)=>handleInputChange(e)}
              required = {requiredFields.includes(key)}
            />
          ))}
        </form>

      </div>
  );
}

export default Profile;
