import React, {useState, useEffect} from 'react'
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-alpine-dark.css';

import {toProperCase} from '../functions/formatValue.js'
import { UTCToLocalTime } from '../functions/time.js';
import * as nlightnApi from "../apis/nlightnlabs.js"

const Table = (props) => {

    const mode = props.mode
    const data = props.data
    const columnWidths = props.columnWidths || []
    const filterableColumns = props.filterableColumns || []
    const hiddenColumns = props.hiddenColumns || []
    const sortableColumns = props.sortableColumns || []
    const sortingOrder = props.sortingOrder || []
    const selectRows = props.selectRows
    const onCellClicked = props.onCellClicked

    const [tableData, setTableData] = useState([]);
    const [fields, setFields] = useState([])
    
    const getTableData = async ()=>{

      let selectField = {
        field: "select", 
        headerName: "", 
        cellStyle: { textAlign: 'center' },
        width: 20,
        filter: false,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        resize: false
    }

      let fieldList = [selectField]
        if(data.length>0){
            Object.keys(data[0]).map((field,index)=>{
                fieldList.push({
                  field: field, 
                  headerName: toProperCase(field.replaceAll("_"," ")), 
                  width: columnWidths.find(i=>i.columnName===field) && columnWidths.find(i=>i.columnName===field).width,
                  filter: filterableColumns.includes(field)? true : true, 
                  sortable: sortableColumns.find(i=>i.name===field) ? true: false, 
                  sort: sortableColumns.find(i=>i.name===field) &&  sortableColumns.find(i=>i.name===field).order, 
                  hide: hiddenColumns.includes(field)? true : false, 
                  suppressSizeToFit: hiddenColumns.includes(field) ? true : false,
                })
            })
            
            setFields(fieldList)
        }

        setTableData(data);
    }

   
      
  useEffect(()=>{
    getTableData()
  },[props.data])


    const handleCellClick = (e) => {
      if(typeof onCellClicked === "function"){
        onCellClicked(e.data)
      }
    }
    
    const [selectedRows, setSelectedRows] = useState([])

    const gridOptions = {
      onGridReady: (params) => {
        params.api.sizeColumnsToFit();
      },
      rowClassRules: {
        'selected-row': (params) => params.node.isSelected(),
      },

      getRowStyle: (params) => {
        if (params.node && params.node.isSelected()) {
          return { background: 'gray' }; // Change the background color to highlight the row
        }
        return null; // No style change
      },

      onSelectionChanged: (event) => {
        const selectedNodes = event.api.getSelectedNodes();
        const selectedRowData = selectedNodes.map(node => node.data);
        setSelectedRows(selectedRowData);
        console.log('Selected Rows:', selectedRowData);
      },

    };

    useEffect(()=>{
      if(typeof selectRows ==="function"){
        selectRows(selectedRows)
      }
    },[selectedRows])
  
  return (
    <div className="flex-container w-100">
        <div
            className={`ag-theme-alpine${mode==="dark" ? '-dark' : ''}`}
            style={{ height: 600 }}
        >
        {tableData && 
        <AgGridReact
            rowData={tableData}
            columnDefs={fields}
            sortingOrder={sortingOrder ? sortingOrder : null}
            onCellClicked = {(e)=>handleCellClick(e)}
            gridOptions={gridOptions} // Add gridOptions here
            rowSelection = "multiple"
            checkboxSelection = {true}
        />}
        </div>
    </div>
  )
}

export default Table