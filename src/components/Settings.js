import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Profile from './Profile'
import Account from './Account'
import * as nlightnApi from '../apis/nlightnlabs'
import FloatingPanel from './FloatingPanel';
import * as styleFunctions from '../functions/styleFunctions'
import {toProperCase} from '../functions/formatValue'
import {setUser} from '../redux/slices/authSlice'


const Settings = () => {

  const dispatch = useDispatch()

  const mode = useSelector(state => state.environment.mode)
  const user = useSelector(state=>state.authentication.user)

  const [profileFormData, setProfileFormData] = useState(null)
  const [accountFormData, setAccountFormData] = useState(null)
  
  const [updatedProfileFormData, setUpdatedProfileFormData] = useState({})
  const [updatedAccountFormData, setUpdatedAccountFormData] = useState({})

  const [userNameExistsError, setUserNameExistsError] = useState(false)
  const [emailExistsError, setEmailExistsError] = useState(false)
  const [passwordMatchError, setPasswordMatchError] = useState(false)

  const [message, setMessage] = useState(null)
  const [showMessage, setShowMessage] = useState(false)

  const requiredFields = [
    "first_name",
    "last_name",
    "email",
    "username",
    "pwd"
  ]

  const errors = []

  useEffect(() => {

    let userData = {...user}
    let keysToRemove = ["id","record_created", "access", "pwd", "username", "photo_url", "full_name", "user_type"]
    keysToRemove.forEach(item=>delete userData[item])
    setProfileFormData(userData)

    const newobject = {username: user.username, pwd: ""}
    setAccountFormData(newobject)
  
  }, [user]);
  
  
  const handleSubmit = async ()=>{

    let updatedFormData = {...updatedProfileFormData,...updatedAccountFormData}

    const updatedFields = Object.keys(updatedFormData)
    let userNameLookUpResponse = null

    // Check if there are any updates
    if(Object.values(updatedFormData).length > 0){

      // check required fields are provided
      requiredFields.forEach(item=>{
        if(updatedFields.includes(item)){
          if(updatedFormData[item].length ==0){
            errors.push(`${toProperCase(item.replace("_"," ")).replace("pwd","Password")} is required`)
          }
        }
      })

      // check if username is taken
      if(updatedFields.includes("username")){
        userNameLookUpResponse = await nlightnApi.getRecord("users","username",updatedFormData.username)
  
        if(userNameLookUpResponse && userNameLookUpResponse.id != user.id){
          errors.push("Username is taken")
        }
      }
    
      if(updatedFields.includes("email")){

        // check if email is taken
        userNameLookUpResponse = await nlightnApi.getRecord("users","email",updatedFormData.email)

        if(userNameLookUpResponse && userNameLookUpResponse.id != user.id){
          errors.push("Email is taken")
        }

        // Custom email validation function
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(updatedFormData.email)) {
            errors.push("Please enter a valid email address")
          }
        };


      if(updatedFields.includes("pwd")){
         // check if passwords match
        if(updatedFormData.pwd && updatedFormData.confirm_pwd && updatedFormData.pwd != updatedFormData.confirm_pwd){
          setPasswordMatchError(true)
          errors.push("Passwords don't match")
        }else{
          setPasswordMatchError(false)
          delete updatedFormData["confirm_pwd"] 
        }
      }
     
      if(errors.length == 0){
        const updateResponse = await nlightnApi.updateRecord("users","id",user.id,updatedFormData)
        const updates = []
        Object.entries(updatedFormData).forEach(([key,value],i)=>{
          updates.push(`${toProperCase(key.replace("_"," "))}: ${value}`)
        })
        setMessage({
          status: "success",
          message: "Record Updated Sucessfully",
          data: updates
        })
        const updatedUser = await nlightnApi.getRecord("users","id",user.id)
        dispatch(setUser(updatedUser))
      }else{
        setMessage({
          status: "error",
          message: "Error: Please Review the following",
          data: errors
        })
      }
    }else{
      setMessage({
        status: "error",
        message: "Nohthing to update",
        data: []
      })
    }
    setShowMessage(true)
  }

  return (
    <div className={`flex flex-col w-full overflow-hidden items-center fade-in transition duration-500 h-100 body-mode-${mode} bg-mode-${mode}`}>
      
      <div className="flex flex-col items-center w-[50%] h-auto">

        <div className="flex w-full justify-end mt-5">
          <button 
              className={`button-mode-${mode}`}
              onClick={() => handleSubmit()}
          >Submit</button>
        </div>

        <div className="flex justify-between w-full overflow-y-auto">

         {profileFormData &&
          <div className={`panel-mode-${mode} rounded-md p-5 w-2/3 m-2`}>
            <h1 className="mb-3">My Profile</h1>
            <Profile 
              formData = {profileFormData} 
              setFormData={setProfileFormData} 
              updatedFormData={updatedProfileFormData} 
              setUpdatedFormData={setUpdatedProfileFormData}
              passwordMatchError = {passwordMatchError}
              requiredFields = {requiredFields}
              />
          </div>
          }

          {accountFormData &&
            <div className={`panel-mode-${mode} rounded-md p-5 w-1/3 m-2 h-auto overflow-hidden`}>
              <h1 className="mb-3">My Account</h1>
              <Account 
                formData = {accountFormData} 
                setFormData={setAccountFormData} 
                updatedFormData={updatedAccountFormData} 
                setUpdatedFormData={setUpdatedAccountFormData}
                userNameExistsError={userNameExistsError}
                requiredFields = {requiredFields}
              />
            </div>
          }

        </div>
      </div>

      {showMessage && message &&
        <FloatingPanel 
          title = {message.message}
          width = "400px"
          height = "300px"
          headerColor = {styleFunctions.getSyleProp(`strip-mode-${mode}`,"backgroundColor")}
          headerTextColor = {message.status==="error"? "red" : "green"}
          backgroundColor = {styleFunctions.getSyleProp(`bg-mode-${mode}`,"background-color")}
          displayPanel = {setShowMessage}
        >
          <ul>
            {message.data.map((item,i)=>(
              <li key={i} className={message.status==="error" ? "text-red-500": "text-gray-500"}>{item}</li>
            ))}
          </ul>
        </FloatingPanel>
      }
    </div>
  );

}

export default Settings
