import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMode } from '../redux/slices/envSlice.js';
import * as oomnielabsApi from '../apis/oomnielabs.js'

function AppList() {

  const dispatch = useDispatch();
  const [displayPanel, setDisplayPanel] = useState(false)  
  const mode = useSelector((state) => state.environment.mode);

  const apps = [
    {id: 1, name: "datacenter", label: "Data Center", link: "/datacenter", icon: `${oomnielabsApi.icons}/data_center_icon.png`, description:"Visualize and manage data center assets through 3D and 2D interactive experience"},
    {id: 2, name: "asset_iq", label: "AssetIQ", link: "/assetiq", icon: `${oomnielabsApi.icons}/insights_icon.png`, description:"Maximize business value impact of technlogy asset management through predictive analytics, forecasting, and powerful visualizations."},
    {id: 3, name: "ai_assistant", label: "AI Master Agent", link: "/test", icon: `${oomnielabsApi.icons}/AI_chat_assistant.png`, description:"Converse with an AI agent to assist you with all your asset management needs"},
    {id: 4, name: "ai_flow", label: "AI Flow", link: "/", icon: `${oomnielabsApi.icons}/ai_workflow_agent.png`, description:"Automate the wokflows end-to-end using AI workflow agents"},
  ]
 
  useEffect(() => {
    dispatch(setMode("dark"));
  }, [dispatch]);


  const handleRedirect = (url) => {
      window.location.href = url;
  };


  return (
    <div className="flex flex-col w-full fade-in h-100 overflow-hidden">
       <div className={`w-full text-center title-mode-${mode}`}>Protype Apps</div>
       <div className="flex flex-wrap w-full justify-center overflow-y-auto">
          {apps && 
            apps.map((app,index)=>(
              <div 
                key={index} 
                className={`panel-mode-${mode} h-[150px] md:h-[250px] w-[80%] md:w-[200px] m-3 rounded-md shadow-lg p-3 cursor-pointer transition duration-500 hover:scale-110`}
                onClick={(e)=>handleRedirect(app.link)}
                >
                <div className={`text-[24px] primary-color-mode-${mode}`}>{app.label}</div>
                <div className={`text-[14px] secondary-color-mode-${mode}` }>{app.description}</div>
              </div>
            ))
          }
        </div>
    </div>
  );
}

export default AppList;
