import React, { useState, useEffect } from 'react';
import Authenticate from './Authenticate.js';


function SignIn() {
 
  return (
      
      <div className="flex flex-col w-full items-center mt-[75px] h-[3000px] fade-in">

          <div className="flex flex-col w-full items-center">
          <img
            className="flex transition duration-500"
            style={{ width: "200px" }}
            src="https://oomnielabs.s3.us-west-2.amazonaws.com/graphics/images/Octopus+in+lab+coat.png"
            alt="Octopus"
          />
          <div className={`flex text-[50px] w-full justify-center text-center transition  duration-500`}>Oomnie Labs</div>
          
          <Authenticate />
        
        </div>    
      </div>
  );
}

export default SignIn;
