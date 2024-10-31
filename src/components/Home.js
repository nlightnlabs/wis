import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import MultiInput from './MultiInput';
import Input from './Input';
import * as nlightnApi from "../apis/nlightnlabs"
import Table from './Table'
import fieldsToExclude from './fields_to_exclude.json';


const Home = () => {

  const mode = useSelector(state=>state.environment.mode)

  let defaultEventDate = new Date();
  defaultEventDate.setDate(defaultEventDate.getDate() + 7);  // Add 7 days
  defaultEventDate = defaultEventDate.toISOString().split('T')[0];

  const defaultTime = "6:00 AM"

  const [ formData, setFormData] = useState({
    customer_name:"",
    district: "",
    inventory_count:"",
    max_loi:"",
    number_of_people:"",
    event_date: defaultEventDate,
    event_time:defaultTime,
  })

  const [staffData, setStaffData] = useState([])
  const [customers, setCustomers] = useState([])
  const [districts, setDistricts] = useState([])
  const [roles, setRoles] = useState([])
  const [performanceRatings, setPerformanceRatings] = useState([])
  const [showStaff, setShowStaff] = useState([])
  const [staffing, setStaffing] = useState([])


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
    let districts = Array.from(district_set)
    setDistricts(districts)
  }


  const getStaffData = async ()=>{

    const response = await nlightnApi.getTable("staff_data")
    let staffData = response.data
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
    getCustomersAnDistricts()
    getStaffData()
  },[])


  const handleInputChange = (e)=>{
    const {name, value} = e.target
    setFormData({...formData,[name]:value})
  }

  const handleSubmit = async (e)=>{
    console.log(formData)

    const query = `
    SELECT 
    person_id AS "Employee ID",
    most_common_role AS "Role",
    round(median_aph_on_total_hours,0) AS "Median APH",
    most_common_performance_rating AS "Performance Rating",
    most_common_pay_basis AS "Pay Basis", 
    round(median_wage_rate,2) AS "Wage Rate",
    date_of_hire AS "Date of Hire",
    date_of_birth AS "Date of Birth",
    most_common_employee_postal_code AS "Postal Code"
    FROM 
        staff_data
    WHERE 
        most_common_district = '${formData.district}'
    ORDER BY 
        median_aph_on_total_hours DESC
    LIMIT ${formData.number_of_people};
    `
  
    let staffingRecommendation = await nlightnApi.getData(query);
    
    const event_date = new Date(formData.event_date);

    // Calculate tenure
    staffingRecommendation = staffingRecommendation.map(item => {
        const dateOfHire = new Date(item["Date of Hire"]);
        const tenureInMilliseconds = event_date - dateOfHire;
        const tenureInYears = tenureInMilliseconds / (1000 * 60 * 60 * 24 * 365.25); // Convert to years (approximate)

        // Update each item with the tenure
        return { ...item, tenure: Math.floor(tenureInYears) };
    });

    // Calculate age
    staffingRecommendation = staffingRecommendation.map(item => {
      const dateOfBirth = new Date(item["Date of Birth"]);
      const ageInMilliseconds = event_date - dateOfBirth;
      const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25); // Convert to years (approximate)

      // Update each item with the tenure
      return { ...item, age: Math.floor(ageInYears) };
  });

    // Remove unwanted properties
    staffingRecommendation = staffingRecommendation.map(({ "Date of Birth": _, "Date of Hire": __, ...rest }) => rest);


    setStaffing(staffingRecommendation)
  } 

  const handleReset = (e)=>{

    setStaffing([])
    
    setFormData({
      customer_name:"",
      district: "",
      inventory_count:"",
      max_loi:"",
      number_of_people:"",
      event_date: defaultEventDate,
      event_time:defaultTime,
    })
  }

  const handleCellClick = (e)=>{
    console.log(e.data)
  } 

  return (
    <div className="flex flex-col w-full h-[100vh] items-center">
      
      <h1 className={`primary-color-mode-${mode} text-[32px]`}>Event Staffing Optimizer</h1>

      <div className={`flex w-[90%] justify-center mt-5 overflow-y-auto`}>

        <div 
          className={`flex flex-col panel-mode-${mode} h-[500px] m-2 rounded-md p-5 transition duration-500`}
          style={{ width: staffing.length > 0 ? "25%" : "50%" }}
          >

        {customers.length>0 &&
          <MultiInput
              id="customer_name"
              name="customer_name"
              label="Customer"
              value={formData.customer_name}
              list={customers}
              onChange={(e)=>handleInputChange(e)}
              required={true}
          />
        }

          {districts.length>0 &&
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
              id="inventory_count"
              name="inventory_count"
              label="Inventory Count"
              value={formData.inventory_count}
              onChange={(e)=>handleInputChange(e)}
              required={true}
          />

          <MultiInput
              id="max_loi"
              name="max_loi"
              label="Maximum Allowable LOI"
              value={formData.max_loi}
              onChange={(e)=>handleInputChange(e)}
              required={true}
          />


          <MultiInput
              id="number_of_people"
              name="number_of_people"
              label="Number of people"
              value={formData.number_of_people}
              onChange={(e)=>handleInputChange(e)}
          />

          <MultiInput
              id="event_date"
              name="event_date"
              label="Event Day"
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
          <p className="text-[12px] text-red-500">*Indicates required input</p>

          <div className={`flex w-full justify-end`}>
              <button className={`button-mode-secondary-${mode} m-1`} onClick={(e)=>handleReset()}>Reset</button>
              <button className={`button-mode-${mode} m-1`} onClick={(e)=>handleSubmit()}>Submit</button>
          </div>
        </div>

      {staffing.length>0 &&
        <div className={`flex w-[75%] m-5 fade-in border-mode-${mode} rounded-md shadow-mode-${mode}`}>
          <Table 
            data = {staffing}
            hiddenColumns = {fieldsToExclude}
            sortingOrder = {["median_aph"]}
            onCellClicked = {(e)=>handleCellClick(e)}
            mode = {mode}
          />
        </div>
      }
      </div>
    </div>
  )
}

export default Home
