import React, { useState, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { toProperCase } from '../functions/formatValue';

const MyAgGrid = (props) => {

  const gridRef = useRef(null);
  const rowData = props.data
  const selectedRows = props.selectedRecords;  // The updated list of selected staffing records

  const formatHeader = props.formatHeader || false
  const fieldOptions = props.fieldOptions || null

  const onCellClicked = props.onCellClicked;
  const onRowSelected = props.onRowSelected;  // New prop for row selection callback
  const mode = props.mode;
  const tableFieldOptions = props.tableFieldOptions || [];
  const initialNumberOfRowsSelected = props.initialNumberOfRowsSelected || 0

  const selectField = {
        field: "select",
        headerName: "Include",
        cellStyle: { textAlign: 'center' },
        width: 50,
        filter: true,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        resizable: false,
        suppressSizeToFit: true
    }

  const columnDefs = [selectField];

    if (rowData.length > 0) {
        Object.keys(rowData[0]).forEach((field) => {
            const fieldOptions = tableFieldOptions.find(item => item.name === field)?.options;
            columnDefs.push({
                field: field,
                headerName: field,
                editable:true,
                sortable: true,
                filter:true,
                cellEditor: fieldOptions ? 'agSelectCellEditor' : 'agTextCellEditor',
                cellEditorParams: fieldOptions ? { values: fieldOptions } : null,
                minWidth: 25, 
                maxWidth: 150,
                flex: 0,
                headerClass: "ag-header-cell",
                cellStyle: { textAlign: 'center' }  // Center text in each cell
            });
        });
    }   


  const handleCellEdit = (params) => {
    console.log('Cell Edited', params.data);
    // You can add any function here to handle the edited data
  };

  const handleSelectionChange = (event) => {
    console.log("event",event)
    const source = event.source
    const updatedSelection = event.api.getSelectedNodes().map(node => node.data)
    console.log("selectedRows",selectedRows)
    console.log("updatedSelection",updatedSelection)

    if(source === "checkboxSelecteed" && updatedSelection.length > 0 && JSON.stringify(updatedSelection) !== JSON.stringify(selectedRows)){
      onRowSelected(updatedSelection)
    }
  }

  const gridOptions = {
    rowClassRules: {
        'selected-row': (params) => params.node.isSelected(),
    },
    getRowStyle: (params) => {
        if (params.node && params.node.isSelected()) {
            return { background: 'gray' };
        }
        return null;
    },
    onFirstDataRendered: (params) => {
      selectedRows && rowData.forEach((row, rowIndex) => {
        const isSelected = selectedRows.some(selectedRow => selectedRow["Employee ID"] === row["Employee ID"]);
        if (isSelected) {
          params.api.getDisplayedRowAtIndex(rowIndex).setSelected(true);
        }
      });
    },
};

const handleCellClick = (e) => {
    if (typeof onCellClicked === "function") {
        onCellClicked(e.data);
    }
};

useEffect(()=>{
  selectedRows && rowData.forEach((row, rowIndex) => {
    const isSelected = selectedRows.some(selectedRow => selectedRow["Employee ID"] === row["Employee ID"]);
    if (isSelected) {
      params.api.getDisplayedRowAtIndex(rowIndex).setSelected(true);
    }
  });
},[selectedRows])

  return (
    <div className={mode==="dark"? `ag-theme-alpine-dark`: `ag-theme-alpine`} style={{ height: 400, width: '100%'}}>
      <AgGridReact
        ref={gridRef}  // Attach gridRef to access AG Grid API
        rowData={rowData}
        columnDefs={columnDefs}
        onCellValueChanged={handleCellEdit}
        animateRows={true}
        onCellClicked={(e)=>handleCellClick(e)}
        onSelectionChanged={(e)=>handleSelectionChange(e)}
        gridOptions={gridOptions}
        rowSelection="multiple"
        checkboxSelection={true}
      />
    </div>
  );
};

export default MyAgGrid;


