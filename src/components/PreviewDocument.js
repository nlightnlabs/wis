import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PreviewDocument = (props) => {

  const file = props.file;
  const [fileType, setFileType]= useState(null)
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  

  const [imageLink, setImageLink] = useState(null)
  const [excelFile, setExcelFile] = useState(null)
  const [audioFileLink, setAudioFileLink] = useState(null)
  const [videoFileLink, setVideoFileLink] = useState(null)
  
  console.log("file",file)
  
  if(file.type.includes("pdf")){
    setFileType("image")
    const reader = new FileReader();
    reader.onload = async function () {
      const typedArray = new Uint8Array(file);
      const pdf = await pdfjs.getDocument(typedArray).promise;
      setNumPages(pdf.numPages);
    };
  reader.readAsArrayBuffer(file);
  }

  else if(["png",'jpg',"jpeg","bmp","svg"].includes(file.type)){
      setFileType("image")
      setImageLink(null)
  }

  else if(["xlsx, xlx, csv"].includes(file.type)){
    setFileType("tabular")
    setExcelFile(null)
  }

  else if(["mov, mpeg4, mpg4"].includes(file.type)){
    setFileType("video")
    setVideoFileLink(null)
  }

  else if(["mp3, wav"].includes(file.type)){
    setFileType("audio")
    setAudioFileLink(null)
  }

  else{
    setFileType("other")
    alert(`Can not read ${file.type} file type.`)
  }


const waitingModalStyle={
  position: "fixed", 
  top: '50%',
  left: '50%',
  translate: "-50% -50%",
  height: "300px", 
  width: "25%vw", 
  top: "30vh",
  fontSize: "24px",
  fontWeight: "bold",
  zIndex: 999,
  cursor: "grab",
}

const handlePageChange = (e)=>{
  const {name,value} = e.target
  name=="nextButton" && setPageNumber(Math.floor(pageNumber+1,numPages))
  name=="backButton" && setPageNumber(Math.ceil(pageNumber-1,1))
}

  return (
    <div className="d-flex justify-content-center w-100">

      <div className="d-flex flex-column p-3" style={{minWidth: "50%"}}>
          {fileType==="pdf" &&
              <div 
                className="d-flex flex-column p-3 rounded-3 shadow mt-3" 
                style={{maxHeight:"400px", overflowY:"auto", backgroundColor: "rgba(255,255,255,0.75"}}
              >
                <div className="d-flex justify-content-between">
                  <h5>Preview: </h5>
                  <p>
                    Page {pageNumber} of {numPages}
                  </p>
                  <form>
                    <div className="btn-group">
                      {pageNumber>1 && <button name="backButton" className="btn text-secondary" onClick={handlePageChange}>{"Back"}</button>}
                      {pageNumber<numPages && <button name="nextButton" className="btn text-secondary" onClick={handlePageChange}>{"Next"}</button>}
                    </div>
                  </form>
                </div>

                <Document file={file}>
                    <Page pageNumber={pageNumber} />
                </Document>
              
              </div>
          }

          {fileType==="tabular" &&

            <div className="d-flex p-3 align-items-center justify-content-center overflow-auto">
              Video File
            </div>

          }

          {fileType==="image" &&
            <div className="d-flex p-3 align-items-center justify-content-center overflow-auto">
              <img src={imageLink}></img>
            </div>
          }

          {fileType==="video" &&
            <div className="d-flex p-3 align-items-center justify-content-center">
              Video File
            </div>
          }

          {fileType==="audio" &&
            <div className="d-flex p-3 align-items-center justify-content-center">
              Audio File
            </div>
          }
      </div>

    </div>
  );
};

export default PreviewDocument;
