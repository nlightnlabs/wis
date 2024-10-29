import React,{useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPage, setPageList, setMenuItems } from '../redux/slices/navSlice';


const Navbar = () => {

const dispatch = useDispatch();
const mode = useSelector(state => state.environment.mode);
const currentPage = useSelector(state => state.navigation.currentPage);
const navigateTo = useNavigate()

useEffect(()=>{
    console.log(currentPage)
    navigateTo(`/${currentPage}`)
},[currentPage])

  return (
    <div>
         <div className={`flex h-[50px] w-full items-center ps-[50px text-[16px]]
          bg-mode-${mode} primary-text-${mode}
          transition duration-500 mb-3`}>
           
          <div 
            className={`button-mode-${mode} w-[75px]`}
            onClick = {(e)=>dispatch(setCurrentPage("room"))}
          >Home</div>

          <div 
            className={`button-mode-${mode} w-[75px]`}
            onClick = {(e)=>dispatch(setCurrentPage("mapview"))}
          >Map</div>

          <div 
           className={`button-mode-${mode} w-[75px]`}
          onClick = {(e)=>dispatch(setCurrentPage("insights"))}
          >Insights</div>
        </div>
    </div>
  )
}

export default Navbar
