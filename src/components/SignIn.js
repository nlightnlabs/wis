import React, { useState, useEffect } from 'react';
import Authenticate from './Authenticate.js';
import { useSelector } from 'react-redux';


function SignIn() {

  const mode = useSelector(state=>state.environment.mode)
  
  console.log("sign in page")

  return (
      
      <div className="flex flex-col w-full items-center mt-[75px] h-[3000px] fade-in">

          <div className="flex flex-col w-full items-center">
          <img
            className="flex transition duration-500"
            style={{ width: "200px" }}
            src={`https://nlightnlabs01.s3.us-west-1.amazonaws.com/wis/graphics/images/wis_logo_${mode}.png`}
            alt="WIS"
          />
          <div className={`flex text-[32px] primary-color-mode-${mode} w-full justify-center text-center transition  duration-500 mb-5`}>Scheduling Optimizer</div>
          
          <Authenticate />

          <div className="flex flex-col w-full items-center mt-[100px]">
            <div className={`secondary-color-mode-${mode} text-[12px]`}>Powered by</div>
            <img 
              src="https://nlightnlabs01.s3.us-west-1.amazonaws.com/images/nlightn_labs_logo.png" alt="nlightn labs logo"
              className="flex w-[150px]"
              />
          </div>
        
        </div>    
      </div>
  );
}

export default SignIn;
