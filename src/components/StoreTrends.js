import React, {useState, useEffect, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import MultiInput from './MultiInput';
import Input from './Input';
import * as nlightnlabsApi from "../apis/nlightnlabs"
import Table from './Table'
import fieldsToExclude from './fields_to_exclude.json';
import {formatValue, getValue} from '../functions/formatValue'
import { 
  setSelectedStaffing,
  setStaffData, 
  setShowStaff, 
  setTotalCost, 
  setEstimatedLOI,
  setOverallAPH,
  setAverageAPH,
  setTotalNumberOfPeople,
  setLOIPasses,
  setProfit,
  setRevenue
} from '../redux/slices/appDataSlice'
import * as styleFunctions from '../functions/styleFunctions'


const StoreTrends = () => {

    const dispatch = useDispatch()
    const mode = useSelector(state=>state.environment.mode)
    
    const [storeData, setStoreData] = useState([])

    const getStoreData = async ()=>{

        const response = await nlightnlabsApi.getTable("store_trends")
        console.log(response.data)
        setStoreData(response.data)

    }

    useEffect(()=>{
        getStoreData()
    },[])

    const handleCellClick = (e)=>{
        
    }


    const fieldsToExclude = ["id", "record_created"]
    const sortingOrder = []
    const selectedStores = []
    const tableFieldOptions = []
  
    return (
    
    <div className="flex flex-col items-center justify-center text-center w-full h-[100%]">

        { storeData.length>0 ?
        <div className="flex flex-col w-[90%] h-[100%] p-3">

            <div className={`flex w-full h-[50%] shadow-md rounded-md border-mode-${mode} rounded-md shadow-mode-${mode} transition duration-500`}>
                
            </div>

            <div className={`flex w-full h-[50%] shadow-md rounded-md border-mode-${mode} rounded-md shadow-mode-${mode} mt-5 transition duration-500`}>
                
                
                <Table
                    data = {storeData}
                    hiddenColumns = {fieldsToExclude}
                    sortingOrder = {sortingOrder}
                    onCellClicked = {(e)=>handleCellClick(e)}
                    includeRowSelect = {false}
                    formatHeader = {true}
                    mode = {mode}
                />
            
            </div>

        </div>
        :
        <div className="flex w-full text-[24px] justify-center items-top text-gray-500">
            Loading...
        </div>

        }
        

    </div>
  )
}

export default StoreTrends