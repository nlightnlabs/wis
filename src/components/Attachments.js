import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState, useRef} from 'react'
import * as iconsApi from "../apis/icons"

const Attachments = (props) => {

    const id=props.id
    const name=props.name
    const label=props.label
    const onChange = props.onChange
    const [attachments, setAttachments] = useState([])
    const readonly= props.readonly
    const disabled= props.disabled
    const required = props.required
    const multiple = props.multiple

    const inputProps = {
      readOnly: readonly || false,
      disabled: disabled || false,
      required: required || false,
    }

  
    useEffect(() => {
      console.log(props.name)
      if (props.currentAttachments !== null && props.currentAttachments !== "") {
          if (typeof props.currentAttachments === "string") {
              setAttachments(JSON.parse(props.currentAttachments));
          } else if (Array.isArray(props.currentAttachments)) {
              setAttachments(props.currentAttachments);
          } else {
              setAttachments([]);
          }
      } else {
          setAttachments([]);
      }
  }, [props.currentAttachments]);


    const handleChange = async (e)=>{ 

      let fileData=[]
      console.log(e.target.files)
        
        if(e.target.files.length >0){
            e.target.className="form-control text-primary"
          }else{
            e.target.className="form-control text-body-tertiary"
          }  

        const fileList = Array.from(e.target.files)
        
        await Promise.all(
          fileList.map(item=>{
            let name = item.name
            let type = item.type
            let size = item.size
            let category = type.slice(0,type.search("/"))
            let extension = type.slice(type.search("/")+1)
            let att = {name: name, type: type, size: size, url: "", category:category, extension:extension, data: item}
            fileData.push(att)
          })
        )
        setAttachments(fileData)

        if(typeof onChange =="function"){
            let target = {
              ...props,
              fileData: fileData,
            }
            onChange(target)
          }
    }

const IconStyle = {
    height: "20px",
    width: "20px",
    cursor:"pointer"
}

const tableStyle = {
    transition: "0.3s",
    fontSize: "12px"
}



  return (
    <div className="form-group">

            <input
                id={id}
                name={name}
                type="file"
                onChange={(e) => handleChange(e)}
                className="form-control"
                {...inputProps}
                multiple
            ></input>

            {attachments && Array.isArray(attachments) && attachments.length > 0 && (
                <div className="d-flex flex-column mt-1 p-2 text-primary border border-1 rounded-3">
                    <div className="d-flex justify-content-end w-100">
                        <button style={{fontSize:"12px"}} 
                        className="btn btn-outline-danger" 
                        onClick = {(e)=>setAttachments([])}
                        >Clear All</button>
                    </div>
                
                    <table className="table table-striped table-borderless p-0 mt-1" style={tableStyle}>
                        <thead className="position-sticky top-0">
                            <tr className="position-sticky top-0 bg-light">
                                <th scope="col" className="p-1">
                                    File Name
                                </th>
                                <th scope="col" className="p-1">
                                    Type
                                </th>
                                <th scope="col" className="p-1">
                                    Size
                                </th>
                                <th scope="col" className="p-1">
                                    Category
                                </th>
                                <th scope="col" className="p-1">
                                    Extension
                                </th>
                                <th scope="col" className="p-1"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {attachments.map((item, attIndex) => (
                                <tr key={attIndex}>
                                    <td className="p-1" style={{ padding: 0, color: "blue", fontWeight: "bold" }}>
                                        {item.url.length > 1 ? (
                                            <a href={item.url}>{item.name}</a>
                                        ) : (
                                            item.name
                                        )}
                                    </td>
                                    <td className="p-1" style={{ padding: 0 }}>
                                        {item.type}
                                    </td>
                                    <td className="p-1" style={{ padding: 0 }}>
                                        {Math.round(Number(item.size) / 1000, 1)} KB
                                    </td>
                                    <td className="p-1" style={{ padding: 0 }}>
                                        {item.category}
                                    </td>
                                    <td className="p-1" style={{ padding: 0 }}>
                                        {item.extension}
                                    </td>
                                    <td className="p-1" style={{ padding: 0 }}>
                                        <img style={IconStyle} src={`${iconsApi.generalIcons}/trash_icon.png`} 
                                        onClick={(e)=>setAttachments(attachments.filter(i=>attachments.indexOf(i) !=attIndex))} 
                                    ></img>
                                    </td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
            
                </div>
            )}
        </div>
    );
};


export default Attachments