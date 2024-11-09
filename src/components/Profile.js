import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Input from './Input'
import MultiInput from './MultiInput'
import * as nlightnlabsApi from '../apis/nlightnlabs'
import { toProperCase } from '../functions/formatValue';

function Profile({formData, setFormData, updatedFormData, setUpdatedFormData, requiredFields}) {
  
  const handleInputChange = (e)=>{
    const {name,value} = e.target
    setUpdatedFormData({...updatedFormData,[name]:value})
    console.log({...updatedFormData,[name]:value})
  }

  const businessUnits = ["Sales" , "Customer Success", "Product Management", "Engineering", "Marketing", "Human Resources","Finance & Accounting", "Corporate", "Operations" , "Other"]
 
  return (
      
      <div className="flex flex-col w-full h-auto">
          {Object.entries(formData).map(([key,value],index)=>(
            <MultiInput
              key={index}
              id={key}
              name={key}
              label={toProperCase(key.replace("_"," "))}
              value={value || ""}
              list={key==="business_unit"? businessUnits: []}
              type={`${key.toLowerCase().replace("_"," ").includes("email")? "email" : "text"}`}
              onChange = {(e)=>handleInputChange(e)}
              required = {requiredFields.includes(key)}
            />
          ))}

      </div>
  );
}

export default Profile;
