import React, {useState, useEffect, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import MultiInput from './MultiInput';
import Input from './Input';
import * as nlightnApi from "../apis/nlightnlabs"
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


const EventStaffing = () => {

  const dispatch = useDispatch()
  const mode = useSelector(state=>state.environment.mode)
  const totalCost = useSelector(state=>state.appData.totalCost)
  const estimatedLOI = useSelector(state=>state.appData.estimatedLOI)
  const overallAPH = useSelector(state=>state.appData.overallAPH)
  const averageAPH = useSelector(state=>state.appData.averageAPH)
  const totalNumberOfPeople = useSelector(state=>state.appData.totalNumberOfPeople)
  const loiPasses = useSelector(state=>state.appData.loiPasses)
  const profit = useSelector(state=>state.appData.profit)
  const revenue = useSelector(state=>state.appData.revenue)


  const staffData = useSelector(state=>state.appData.staffData)
  const selectedStaffing = useSelector(state=>state.appData.selectedStaffing)

  const [customers, setCustomers] = useState([])
  const [districts, setDistricts] = useState([])
  const [roles, setRoles] = useState([])
  const [performanceRatings, setPerformanceRatings] = useState([])

  let defaultEventDate = new Date();
  defaultEventDate.setDate(defaultEventDate.getDate() + 7);  // Add 7 days
  defaultEventDate = defaultEventDate.toISOString().split('T')[0];

  const defaultTime = "6:00 AM"
  const initialFormData = {
      customer_name: "HAPPY FOOD MART",
      event_date: defaultEventDate,
      event_time:defaultTime,
      revenue: "5000",
      inventory_count: "200000",
      district: "155",
      back_room_pct: "0.00",
      allowable_loi: 4,
      location: "27127",
      number_of_people: "5",
      distribution_method: "Relative Person APH"
  }

  const [ formData, setFormData] = useState(initialFormData)


  const getCustomersAnDistricts = async()=>{
    const response = await nlightnApi.getTable("customers")
    let customerData = response.data

    let customer_set = new Set()
    customerData.map(item=>{
      customer_set.add(item.customer)
    })
    let customers = Array.from(customer_set)
    setCustomers(customers)

    let district_set = new Set()
    customerData.map(item=>{
      district_set.add(item.district)
    })
    let districts = ["All"]
    districts = [...districts,...Array.from(district_set)]
    setDistricts(districts)
  }


  const getStaffData = async ()=>{

    const response = await nlightnApi.getTable("staff_data")
    console.log(response)
    let rawStaffData = response.data

    let role_set = new Set()
    rawStaffData.map(item=>{
        role_set.add(item.most_common_role)
    })
    let roles = Array.from(role_set)
    setRoles(roles)

    let performance_ratings_set = new Set()
    rawStaffData.map(item=>{
        performance_ratings_set.add(item.most_common_performance_rating)
    })
    let performance_ratings = Array.from(performance_ratings_set)
    setPerformanceRatings(performance_ratings)

  }

  useEffect(()=>{
    getCustomersAnDistricts()
    getStaffData()
  },[])


  const handleInputChange = (e)=>{
    const {name, value} = e.target
    console.log({...formData,[name]:value})
    setFormData({...formData,[name]:value})
  }

  const handleCellClick = (e)=>{
    console.log(e.data)
  } 


  const parseTime = (timeStr) => {
    // Check if time is in '6:00 AM' or '6:00 PM' format
    const time = /(\d{1,2}):(\d{2})\s*(AM|PM)/.exec(timeStr);
    if (time) {
      const hours = (time[3] === 'AM' && time[1] === '12') ? 0 : (time[3] === 'PM' && time[1] !== '12') ? parseInt(time[1]) + 12 : parseInt(time[1]);
      const minutes = parseInt(time[2]);
      return new Date(1970, 0, 1, hours, minutes); // Create a date object at 1970-01-01 with parsed hours and minutes
    }
    return null; // Return null if parsing fails
  }

  const checkForm = ()=>{
    const missingInputs = []
    Object.entries(formData).forEach(([key,value],index)=>{
      console.log(key,value)
      if (value ==="" || value ===null){
        missingInputs.push(key)
      }})
      return missingInputs      
  }

  const handleSubmit = async (e) => {

    console.log(formData);
    const missingInputs = checkForm()
    console.log(missingInputs)

    if(missingInputs.length == 0){

      const parameters = {
        customer_name: (formData.customer_name).toString(),
        event_date: new Date(formData.event_date),  
        event_time: parseTime(formData.event_time), 
        revenue: parseFloat(formData.revenue),
        inventory_count: parseFloat(formData.inventory_count),
        district: (formData.district).toString(),
        back_room_pct: parseFloat(formData.back_room_pct),
        allowable_loi: parseFloat(formData.allowable_loi),
        location: (formData.location).toString(),
        number_of_people: parseFloat(formData.number_of_people),
        distribution_method: (formData.distribution_method).toString()
      };
  
      console.log(parameters)
    
      // Run python app to prepare staffing data
      const response = await nlightnApi.pythonApp("staffing_optimizer", "process_staff_data", parameters);
      // console.log(response);
  
      // Update UI state
      setStaffData(response.staff_data)
      setSelectedStaffing(response.selected_staffing)
  
      dispatch(setStaffData(response.staff_data))
      dispatch(setSelectedStaffing(response.selected_staffing))
      dispatch(setTotalCost(response.summary.total_cost))
      dispatch(setEstimatedLOI(response.summary.estimated_LOI))
      dispatch(setLOIPasses(response.summary.loi_passes))
      dispatch(setOverallAPH(response.summary.overall_APH))
      dispatch(setAverageAPH(response.summary.average_APH))
      dispatch(setTotalNumberOfPeople(response.summary.number_of_people))
      dispatch(setRevenue(response.summary.revenue))
      dispatch(setProfit(response.summary.profit))
    }else{
      alert(`Please provide values for ${missingInputs}`)
    }

  };
  

  const handleRowSelect = (userUpdatedRecords) => {
    // console.log("userUpdatedRecords",userUpdatedRecords)
    if (JSON.stringify(userUpdatedRecords) !== JSON.stringify(selectedStaffing) && userUpdatedRecords.length>0 ) {
      console.log(userUpdatedRecords)
      analyze(userUpdatedRecords);
    }
  }; 


  const handleReset = ()=>{
    dispatch(setSelectedStaffing([]))
    dispatch(setStaffData([]))
    dispatch(setTotalCost(0))
    dispatch(setEstimatedLOI(0))
    dispatch(setOverallAPH(0))
    dispatch(setAverageAPH(0))
    dispatch(setTotalNumberOfPeople(0))
    dispatch(setLOIPasses(true))
    dispatch(setRevenue(0))
    dispatch(setProfit(0))
    setFormData(initialFormData)
    
  }


  const analyze = async(selectedRecords)=>{
    
    // console.log(selectedRecords)

    if(staffData && selectedRecords && selectedRecords.length>0){

      const parameters = {
        customer_name: (formData.customer_name).toString(),
        event_date: new Date(formData.event_date),  
        event_time: parseTime(formData.event_time), 
        revenue: parseFloat(formData.revenue),
        inventory_count: parseFloat(formData.inventory_count),
        district: (formData.district).toString(),
        back_room_pct: parseFloat(formData.back_room_pct),
        allowable_loi: parseFloat(formData.allowable_loi),
        location: (formData.location).toString(),
        number_of_people: parseFloat(formData.number_of_people),
        distribution_method: (formData.distribution_method).toString(),
        staff_data: staffData,
        selected_staffing: selectedRecords
      };
  
      // Run python app
      const response = await nlightnApi.pythonApp("staffing_optimizer","run_analysis",parameters);
      console.log(response)
  
      // Update UI state
      dispatch(setStaffData(response.staff_data))
      dispatch(setSelectedStaffing(response.selected_staffing))
      dispatch(setTotalCost(response.summary.total_cost))
      dispatch(setEstimatedLOI(response.summary.estimated_LOI))
      dispatch(setLOIPasses(response.summary.loi_passes))
      dispatch(setOverallAPH(response.summary.overall_APH))
      dispatch(setAverageAPH(response.summary.average_APH))
      dispatch(setTotalNumberOfPeople(response.summary.number_of_people))
      dispatch(setRevenue(response.summary.revenue))
      dispatch(setProfit(response.summary.profit))
    }
    
  }


  const tableFieldOptions = [
    {name: "Role", options: roles},
    {name: "Performance Rating", options: performanceRatings},
    {name: "Predicted APH", sortOrder: 'desc'},
  ]

  const [updatedRows, setUpdatedRows] = useState([]);
  
  const handleCellEdit = (params) => {
    console.log("updatedRow", params.data)
  };

  


  return (
    <div className={`flex flex-col w-full items-center body-mode-${mode} overflow-y-auto h-[1000px]`}>

      <div className={`flex w-[90%] h-auto justify-center mt-5`}>

        <div 
          className={`flex flex-col panel-mode-${mode} h-auto me-3 rounded-md p-5 transition duration-500`}
          style = {{width: `${staffData.length>0 ? "300px" : "400px"}`}}
          >

            <MultiInput
                id="customer_name"
                name="customer_name"
                label="Customer"
                value={formData.customer_name}
                list={customers.length>0 && customers}
                onChange={(e)=>handleInputChange(e)}
                required={true}
            />

            <MultiInput
                id="event_date"
                name="event_date"
                label="Event Date"
                type="date"
                value={formData.event_date}
                onChange={(e)=>handleInputChange(e)}
            />

            <MultiInput
                id="event_time"
                name="event_time"
                label="Event Time"
                type="time"
                value={formData.event_time}
                onChange={(e)=>handleInputChange(e)}
            />


            <MultiInput
                id="revenue"
                name="revenue"
                label="Expected Revenue"
                value={formData.revenue}
                onChange={(e)=>handleInputChange(e)}
                required={true}
            />

            <MultiInput
                id="location"
                name="location"
                label="Address or Zip Code of Event Site"
                value={formData.location}
                onChange={(e)=>handleInputChange(e)}
                required={true}
            />

            <MultiInput
                id="inventory_count"
                name="inventory_count"
                label="Inventory Count"
                value={formData.inventory_count}
                onChange={(e)=>handleInputChange(e)}
                required={true}
            />

            <MultiInput
                id="back_room_pct"
                name="back_room_pct"
                label="Back Room Percent"
                value={formData.back_room_pct}
                onChange={(e)=>handleInputChange(e)}
                required={true}
            />

            <MultiInput
                id="allowable_loi"
                name="allowable_loi"
                label="Max Allowable LOI"
                value={formData.allowable_loi}
                onChange={(e)=>handleInputChange(e)}
                required={true}
            />

            {districts.length> 0 &&
              <MultiInput
                id="district"
                name="district"
                label="District"
                value={formData.district}
                list={districts}
                onChange={(e)=>handleInputChange(e)}
                required={true}
              />
            }

              <MultiInput
                  id="number_of_people"
                  name="number_of_people"
                  label="Number of people"
                  value={formData.number_of_people}
                  onChange={(e)=>handleInputChange(e)}
              />

              <MultiInput
                  id="distribution_method"
                  name="distribution_method"
                  label="Piece Distribution By"
                  value={formData.distribution_method}
                  onChange={(e)=>handleInputChange(e)}
                  list={["Relative Person APH" , "Evenly Across People"]}
              />

    
            <p className="text-[12px] text-red-500">*Indicates required input</p>

            <div className={`flex w-full justify-end`}>
                <button className={`button-mode-secondary-${mode} m-1`} onClick={(e)=>handleReset()}>Reset</button>
                <button className={`button-mode-${mode} m-1`} onClick={(e)=>handleSubmit()}>Submit</button>
            </div>
        </div>

        {staffData.length>0 &&
          <div className={`flex flex-col w-[75%] fade-in`}>

            <div className={`flex w-full h-auto p-2 panel-mode-${mode} rounded-md shadow-md mb-5 items-center justify-between`}>

              <div className="flex justify-between">

                <div className={`flex flex-col p-1 ms-2 me-2 fade-in transition duration-500 items-center justify-center`}>
                  <label className={`text-[20px] font-bold text-center`}>{totalNumberOfPeople && formatValue(totalNumberOfPeople ?totalNumberOfPeople :0 , "quantity", "", 2, true)}</label>
                  <label className={`text-[12px] text-center`}>Total People</label>
                </div>

                  <div className={`flex flex-col p-1 ms-2 me-2 fade-in transition duration-500 items-center justify-center`}>
                    <label className={`text-[20px] text-center font-bold`}>{formatValue(overallAPH ? overallAPH : 0, "quantity", "", 2, true)}</label>
                    <label className={`text-[12px] text-center text-gray-500`}>Overall APH</label>
                  </div>

                  <div className={`flex flex-col p-1 ms-2 me-2 fade-in transition duration-500 items-center justify-center`}>
                    <label className={`text-[20px] text-center font-bold`}>{formatValue(averageAPH ? averageAPH : 0, "quantity", "", 0, false)}</label>
                    <label className={`text-[12px] text-center text-gray-500`}>Average APH</label>
                  </div>


                    <div className={`flex flex-col p-1 ms-2 me-2 fade-in transition duration-500 items-center justify-center`}>
                      <label className={`text-[20px] text-center font-bold`}>{formatValue(totalCost ? totalCost : 0, "currency", "$", 2, true)}</label>
                      <label className={`text-[12px] text-center text-gray-500`}>Total Cost</label>
                    </div>

                    <div className={`flex flex-col p-1 ms-2 me-2 fade-in transition duration-500 items-center justify-center`}>
                      <label className={`text-[20px] text-center font-bold`}>{formatValue(revenue ? revenue : 0, "currency", "$", 2, true)}</label>
                      <label className={`text-[12px] text-center text-gray-500`}>Revenue</label>
                    </div>
                  
              </div>

              <div className="flex border-[1px] rounded-md">
                <div className={`flex flex-col p-1 ms-2 me-2 fade-in transition duration-500 items-center justify-center`}>
                  <label className={`text-[20px] text-center font-bold ${loiPasses ? "text-green-500" : "text-red-500"}`}>{ formatValue(estimatedLOI ? estimatedLOI :0, "quantity", "", 2, true)} hours</label>
                  <label className={`text-[12px] text-center text-gray-500`}>Estimated LOI</label>
                </div>
              
                <div className={`flex flex-col p-1 ms-2 me-2 fade-in transition duration-500 items-center justify-center`}>
                  <label className={`text-[20px] font-bold text-center ${profit > 0 ? "text-green-500" : "text-red-500"}`}>{formatValue(profit ? profit : 0, "currency", "$", 2, true)}</label>
                  <label className={`text-[12px] text-center text-gray-500`}>Profit</label>
                </div>

                <div className="flex justify-end mt-1 p-3">
                  <button 
                    className={staffData.length>0 ? `button-mode-${mode}` : "bg-yellow-500 text-white p-1"}
                    onClick = {()=>analyze(selectedStaffing)}
                    >
                      Optimize
                  </button>
                </div> 

              </div>

            </div>

            <div className={`flex flex-col h-[100%] min-h-[250px] w-full shadow-md rounded-md border-mode-${mode} rounded-md shadow-mode-${mode} transition duration-500`}>
              {staffData && selectedStaffing &&
                <Table
                  data = {staffData}
                  includeRowSelect = {true}
                  hiddenColumns = {fieldsToExclude}
                  fieldOptions = {tableFieldOptions}
                  onCellClicked = {(e)=>handleCellClick(e)}
                  onCellEdit = {(params)=>handleCellEdit(params)}
                  onRowSelected = {(selectedRows)=>handleRowSelect(selectedRows)}
                  mode = {mode}
                  tableFieldOptions = {tableFieldOptions}
                  selectedRows = {selectedStaffing}
                />
              } 
            </div>

          </div>
        }

      </div>
      
    </div>
  )
}

export default EventStaffing
