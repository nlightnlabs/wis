import axios from "axios";
import * as formatValue from '../functions/formatValue.js'

export const baseURL = process.env.NODE_ENV==="production" ? "https://nlightnlabs.net/nlightn" : "http://localhost:3001"
// export const baseURL = "https://nlightnlabs.net"
console.log("environment:", process.env.NODE_ENV)
console.log("baseURL:", baseURL)

const dbName = "wis"

export const serverConnection = axios.create({
  baseURL,
})
const pythonURL = "http://localhost:8001"
export const pythonConnection = axios.create({
  baseURL: pythonURL
})
console.log("pythonURL:", pythonURL)


export const images = "https://nlightnlabs01.s3.us-west-1.amazonaws.com/wis/graphics/images"
export const icons = "https://nlightnlabs01.s3.us-west-1.amazonaws.com/wis/graphics/images"


//General Query
export const getData = async (query)=>{
  try{
    const result = await serverConnection.post("/nlightn/db/query",{query, dbName})
    console.log(result)
    const data = await result.data
    console.log(result)
    return (data)
  }catch(error){
    console.log(error)
  }
}


//Get Table
export const getTable = async (tableName)=>{

    try{
      const result = await serverConnection.get(`/nlightn/db/table/${tableName}/${dbName}`)
    
      const {data,dataTypes} = await result.data
      return ({data,dataTypes})
    }catch(error){
      console.log(error)
    }
  }

  //Get List
  export const getList = async (tableName,fieldName)=>{

    try{
      const result = await serverConnection.get(`/nlightn/db/list/${tableName}/${fieldName}`)
      const data = await result.data
      return (data)
    }catch(error){
      // console.log(error)
    }
  }


// Get  Conditional List
  export const getConditionalList = async (tableName,fieldName,conditionalField, condition)=>{
   
    try{
      const result = await serverConnection.get(`/nlightn/db/subList/${tableName}/${fieldName}/${conditionalField}/${condition}`)
      const data = await result.data
      return (data)
    }catch(error){
      console.log(error)
    }
  }


//Get Record
export const getRecord = async (tableName,conditionalField, condition)=>{

  try{
    const result = await serverConnection.post("/nlightn/db/getRecord",{tableName,conditionalField, condition})
    // console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    // console.log(error)
  }
}

//Get Records
export const getRecords = async (tableName, conditionalField, condition)=>{

  try{
    const result = await serverConnection.post("/nlightn/db/getRecords",{tableName,conditionalField, condition})
    //console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    //console.log(error)
  }
}

//Look up a single value
export const getValue = async (tableName,lookupField, conditionalField,conditionalValue)=>{
  
  try{
    const result = await serverConnection.get(`/nlightn/db/value/${tableName}/${lookupField}/${conditionalField}/${conditionalValue}`)
    //console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    //console.log(error)
  }
}


//Create New Record
export const addRecord = async (tableName, formData)=>{
  if(tableName.length > 0 && Object.entries(formData).length>0){
    try{
      const result = await serverConnection.post("/nlightn/db/addRecord",{tableName, formData})
      console.log(result)
      const data = await result.data
      return (data)
    }catch(error){
      console.log(error)
    }
  }else{
    alert("Please provide information for the new record")
  }
}

//Update Record
export const updateRecord = async (tableName,idField,recordId,formData)=>{
  
    try{
      const result = await serverConnection.post("/nlightn/db/updateRecord",{tableName,idField,recordId,formData})
      console.log(result)
      const data = await result.data
      return (data)
    }catch(error){
      console.log(error)
    }
}

//Delete Record
export const deleteRecord = async (tableName,idField,recordId)=>{

  const params = {
    tableName,
    idField,
    recordId
}
  try{
    const result = await serverConnection.post("/nlightn/db/deleteRecord",{params})
    //console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    //console.log(error)
  }
}

//Authenticate User
export const authenticateUser = async (params)=>{
  
  try{
    const submitLoggin = await serverConnection.post("/nlightn/db/authenticateUser",{...params,dbName})
    
    const userValidated = submitLoggin.data
    return userValidated
  }catch(error){
      console.log(error)
  }
}

//Get User Info
export const getUserInfo = async (username)=>{
  
  try{
    const getUserQuery = await serverConnection.post("/nlightn/db/userRecord",{username, dbName})
    const getUserQueryResonse = await getUserQuery.data;
    return getUserQueryResonse
  }catch(error){
    console.log(error)
  }
}

//Reset User Password
export const addUser = async (params)=>{

  try{
    const result = await serverConnection.post("/nlightn/db/addUser",{params})
    //console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    //console.log(error)
  }
}


//Reset User Password
export const resetPassword = async (req)=>{

  const params = {
    tableName: req.tableName,
    idField: req.idField,
    recordId: req.recordId,
    formData: req.formData
  }

  try{
    const result = await serverConnection.post("/nlightn/db/updateRecord",{params})
    //console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    //console.log(error)
  }
}


//Send Email
export const sendEmail = async (req, res)=>{
    
  const params = {
      to: req.to,
      subject: req.subject,
      message: req.message,
      htmlPage: req.htmlPage
  }

  //console.log(params)
  try{
    const result = await serverConnection.post("/sendEmail",{params})
    // console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    // console.log(error)
  }
}

//Ask GPT
export const askGPT = async (prompt)=>{

  console.log(prompt)

  try{
    const response = await serverConnection.post("/openai/gpt/ask",{prompt})
    return (response.data)
  }catch(error){
    // console.log(error)
  }
}


//openai/gpt/ classify
export const gptClassify = async (text, list)=>{

  console.log("text",text)
  console.log("list",list)

  try{
    const response = await serverConnection.post("/openai/gpt/classify",{text, list})
    console.log(response.data)
    return (response.data)
  }catch(error){
    // console.log(error)
  }
}

//Generate Image
export const generateImage = async (prompt)=>{

  try{
    const result = await serverConnection.post("/openai/dalle/image",{prompt})
    // console.log(result)
    return (result.data[0].url)
  }catch(error){
    // console.log(error)
  }
}

//Scan Document
export const scanInvoice = async (documentText, record)=>{
  
  const prompt = `The following is an invoice received from a supplier: ${documentText}. Fill in the values in this javascript object: ${JSON.stringify(record)} based on the information in the invoice. Leave a value blank if it can not be determined based on the invoice document received. Return response as javascript object. Be sure to return a properly structured json object with closed brackets and array sub elements if needed.`

  try{
    const result = await serverConnection.post("/openai/gpt/ask",{prompt})
    return (JSON.parse(result.data))
  }catch(error){
    // console.log(error)
  }
}

export const runPython = async (pythonAppName,args)=>{
  const params = {
    pythonAppName,
    args
  }
  try{
    const result = await serverConnection.post("/openai/runPython",{params})
    console.log(JSON.parse(result.data))
    return (JSON.parse(result.data))

  }catch(error){
    // console.log(error)
  }
}

//Get list of all tables in database:
export const getAllTables = async()=>{
  const query= `SELECT table_name FROM information_schema.tables where table_schema = 'public';`
  try{
    const result = await serverConnection.post("/nlightn/db/query",{query})
    console.log(JSON.parse(result.data))
    return (JSON.parse(result.data))
  }catch(error){
    console.log(error)
  }
  
}

// show columsn
export const getColumnData = async(tableName)=>{

  const query= `SELECT column_name as name, data_type FROM information_schema.COLUMNS where TABLE_NAME = N'${tableName}';`
  try{
    const result = await serverConnection.post("/nlightn/db/query",{query})
    const data = result.data

    let fieldList = [] 
      data.map(item=>{
        fieldList.push(item.name)
      })
    return ({data: data, fieldList:fieldList})
  }catch(error){
    console.log(error)
  }
}

export const updateActivityLog = async(app, recordId, userEmail, description)=>{
  
  const formData = {
    "app":app,
    "record_id":recordId,
    "user":userEmail,
    "description":description
  }
  
  const tableName = "activities"

  try{
    const result = await serverConnection.post("/nlightn/db/addRecord",{tableName, formData})
    // console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    // console.log(error)
  }
}


export const convertAudioToText = async (audioBlob) => {

  console.log('audioBlob:', audioBlob); // Log audioBlob to check its content

// Create a new FormData object
const formData = new FormData();
// Append data to the formData object
formData.append('file', audioBlob, 'audio.wav');

  try {
    const response = await serverConnection.post('/openai/whisper', formData)
    return response.data.text
  } catch (error) {
    console.error('Error sending data to backend:', error);
  }
 
};




//Upload files to AWS S3
export const uploadFiles = async (folder, attachments)=>{

  console.log("folder", folder)
  console.log("attachments",attachments)
  
  let updatedAttachments = []

  try {
      await Promise.all(attachments.map(async (file) => {

        const filePath = `secure_file_transfer/${folder}/${file.name}` 
        
          const getUrl = await serverConnection.post(`/aws/getS3FolderUrl`, {filePath: filePath});
          const url = await getUrl.data;
          const fileUrl = await url.split("?")[0];

          await fetch(url, {
              method: "PUT",
              headers: {
                  "Content-Type": file.type,
              },
              body: file.data
          });

          let updatedFile = {...file, ...{["url"]: fileUrl}};
          delete updatedFile.data
          updatedAttachments.push(updatedFile)
      }));

      return updatedAttachments

     } catch (error) {
        console.error("Error uploading file:", error);
    }

}


export const getFiles = async (folderPath)=>{

  const params = {
    bucketName: "nlightnlabs01",
    path: folderPath
  }

  try {
      const response = await serverConnection.post(`/aws/getFiles`, params);
      const data = await response.data;
      let files = []
      data.forEach(item => {
        const key = item.file.Key
        const fileName = key.split('/').pop(); // Get the file name
        const fileType = fileName.split('.').pop(); // Get the file type
        if (fileName.length>0){
            files.push({
            name: fileName, 
            type: fileType, 
            size: formatValue.formatFileSize(item.file.Size), 
            last_modified: formatValue.UTCToLocalDateTime(item.file.LastModified), 
            owner: item.file.Owner.DisplayName, 
            url: item.url.split("?")[0],
            key: key, 
            file_data: item.file_data,
            meta_data: item.meta_data
          })
        }
      });

      return files
  } catch (error) {
      console.error("Error uploading file:", error);
  }
}



export const deleteFiles = async (files)=>{

  let status = "OK"
  try{
    await Promise.all(files.map(async (item) => {
      const params = {
        Bucket: "nlightnlabs01",
        Key: item.key,
      }
        const response = await serverConnection.post('/aws/deleteFile', params);
        if(response.statusText !="OK"){
          status = response.statusText
        }
    }));
    return status
  }catch(error){
    console.error("Error deleting file:", error);
    return error
  }
   
}


export const pythonApp = async (app_name, main_function, parameters) => {
  console.log(app_name,main_function,parameters)

  try {
      const response = await pythonConnection.post('/runApp', { app_name, main_function, parameters });
      // console.log("Response Type:", typeof response.data);  // Should be "object" for JSON
      // console.log("Response Data:", response.data);  // Check structure

      // const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
      console.log(response.data)
      return response.data;
      
  } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
  }
};


export const pythonGetData = async (query) =>{
  const response = await pythonConnection.post('/db/query', { query, dbName })
  console.log(response.data)

  const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;

  return data
}


export const pythonGetTableData = async (tableName) =>{
  
  const response = await pythonConnection.post('/db/table', { tableName, dbName })
  console.log(response.data)

  const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;

  return data
}
