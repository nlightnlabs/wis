import React,{useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPage, setPageList, setMenuItems } from '../redux/slices/navSlice';
import { toProperCase} from '../functions/formatValue';

const Navbar = () => {

const dispatch = useDispatch();
const mode = useSelector(state => state.environment.mode);
const currentPage = useSelector(state => state.navigation.currentPage);
const navigateTo = useNavigate()

useEffect(()=>{
    console.log(currentPage)
    navigateTo(`/${currentPage}`)
},[currentPage])

const handlePageChange = (pageName)=>{
  navigateTo(pageName)
}

  return (
    <div className="flex w-full justify-center">

         <div className={`flex h-[50px] w-[90%] items-center justify-between text-[16px]]
          bg-mode-${mode} primary-text-${mode} p-3
          transition duration-500 mb-3`}>

            <div className={`title-mode-${mode}`}>
              {toProperCase(currentPage.replaceAll("_"," "))}
            </div>
          
          <div className="flex justify-between">

            <div 
              className={`button-mode-secondary-${mode} w-[75px] ms-1 m-1`}
              onClick = {(e)=>dispatch(setCurrentPage("event_staffing"))}
            >Event Staffing</div>

            <div 
              className={`button-mode-secondary-${mode} w-[75px] ms-1 m-1`}
              onClick = {(e)=>dispatch(setCurrentPage("store_trends"))}
            >Store Trends</div>

          </div>
        </div>
    </div>
  )
}

export default Navbar
