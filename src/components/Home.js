import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import Input from './Input';
import * as nlightnApi from "../apis/nlightnlabs"
// import Table from './Table'

const Home = () => {

  const mode = useSelector(state=>state.environment.mode)

  const [ formData, setFormData] = useState({
    account:"",
    store:"",
    district: "",
    inventory_count:"",
    max_loi:"",
    number_of_people:"",
    event_date:"",
    event_time:"",
  })

  const [staffData, setStaffData] = useState([])
  const [roles, setRoles] = useState([])
  const [performanceRatings, setPerformanceRatings] = useState([])
  const [showStaff, setShowStaff] = useState([])

  
  
  const getStaffData = async ()=>{
    const response = await nlightnApi.getTable("staff_data")
    let staffData = response.data
    console.log(staffData)
    setStaffData(staffData)

    let role_set = new Set()
    staffData.map(item=>{
        role_set.add(item.most_common_job_role)
    })
    let roles = Array.from(role_set)
    setRoles(roles)

    let performance_ratings_set = new Set()
    staffData.map(item=>{
        performance_ratings_set.add(item.most_common_performance_rating)
    })
    let performance_ratings = Array.from(performance_ratings_set)
    setPerformanceRatings(performance_ratings)

  }

  useEffect(()=>{
    getStaffData()
  },[])


  const handleInputChange = (e)=>{
    const {name, value} = e
    setFormData({...formData,[name]:value})
  }

  const handleSubmit = (e)=>{
    const staffing = staffData.filter(item=>item.most_common_district === formData.district)
    
  } 

  const handleReset = (e)=>{
    
  }

  return (
    <div className="flex flex-col w-full h-[100vh] items-center">
      <h1 className={`primary-color-mode-${mode} text-[32px]`}>Event Staffing Optimizer</h1>
      <div className={`flex flex-col panel-mode-${mode} w-1/2 h-[500px] mt-5 rounded-md p-5`}>

      <Input
            id="account"
            name="account"
            label="Account"
            value={formData.account}
            onChange={(e)=>handleInputChange(e)}
            required={true}
        />

        <Input
            id="store"
            name="store"
            label="Store"
            value={formData.store}
            onChange={(e)=>handleInputChange(e)}
            required={true}
        />

        <Input
            id="district"
            name="district"
            label="District"
            value={formData.district}
            onChange={(e)=>handleInputChange(e)}
            required={true}
        />

        <Input
            id="inventory_count"
            name="inventory_count"
            label="Inventory Count"
            value={formData.inventory_count}
            onChange={(e)=>handleInputChange(e)}
            required={true}
        />

        <Input
            id="max_loi"
            name="max_loi"
            label="Maximum Allowable LOI"
            value={formData.inventory_count}
            onChange={(e)=>handleInputChange(e)}
            required={true}
        />


        <Input
            id="number_of_people"
            name="number_of_people"
            label="Number of people"
            value={formData.number_of_people}
            onChange={(e)=>handleInputChange(e)}
        />

        <Input
            id="event_date"
            name="event_date"
            label="Event Day"
            value={formData.event_date}
            onChange={(e)=>handleInputChange(e)}
        />

        <Input
            id="event_time"
            name="event_time"
            label="Event Time"
            value={formData.event_time}
            onChange={(e)=>handleInputChange(e)}
        />

        <div className={`flex w-full justify-end`}>
            <button className={`button-mode-${mode} m-1`} onClick={(e)=>handleReset()}>Reset</button>
            <button className={`button-mode-${mode} m-1`} onClick={(e)=>handleSubmit()}>Submit</button>
        </div>
      </div>

      <div>
        {/* <Table mode={mode}/> */}
      </div>
    </div>
  )
}

export default Home
