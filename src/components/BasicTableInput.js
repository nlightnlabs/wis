import React, {useState, useEffect} from 'react'


export const BasicTableInput = ({name, initialData, onChange}) => {
   
    const [data, setData] = useState([])
    const [fields, setFields] = useState([])

    const getData = ()=>{
        setData(initialData)
        setFields(Object.keys(initialData[0]))
    }
    useEffect(()=>{
        getData()
    },[])
    
    const handleChange = (e)=>{
        const {name,value} = e.target
    }
  
    return (
    <div>
        <table className="table table-striped w-100">
            <thead>
                <tr>
                    {fields.map((field, colIndex)=>(
                        <th className="text-center" key={colIndex}>{field}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((rowData,rowIndex)=>(
                    <tr>
                        {
                            Object.entries(rowData).map(([key,val],colIndex)=>(
                                <td key={`R$${rowIndex}C${colIndex}`}>
                                    <input className="form-control" onChange={(e)=>handleChange(e)} value={val}></input>
                                </td>
                            ))
                        }
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    )
    }
  
export default BasicTableInput