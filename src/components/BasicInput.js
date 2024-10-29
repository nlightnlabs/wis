import React from 'react'

const BasicInput = ({ name, label, initialValue, onChange }) => {

    const [value, setValue] = useState(initialValue)
    
    const handleChange = (e) => {
        setValue(e.target.value)
        onChange(e); 
    };
    
    const inputStyle={
        color:"blue"
    }
    
    return (
        <div className="form-floating m-3">
        <input style={inputStyle} name={name} className="form-control" type="text" placeholder={label} value={value} onChange={handleChange} />
        <label className="form-label" htmlFor={name}>{label}</label>
        </div>
    );
    };
      
export default BasicInput




export const BasicTableInput = ({name, initialData, onChange}) => {

    const [data, setData] = useState(initialData)
    const fields = Object.keys(data[0])

  return (
    <div>
        <table>
            <thead>
                {fields.map((field, colIndex)=>(
                    <th key={colIndex}>{field}</th>
                ))}
            </thead>
            <tbody>
                {data.map((rowData,rowIndex)=>{
                    <tr>
                        {
                            Object.entries(rowData).map(([key,value],colIndex)=>(
                                <td key={`R${rowIndex}C${colIndex}`}>
                                    <input key={`R${rowIndex}C${colIndex}`} className="form-control">{value}</input>
                                </td>
                            )
                        )}
                    </tr>
                })}
            </tbody>
        </table>
    </div>
  )
}

