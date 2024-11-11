import React, { useState, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { toProperCase } from '../functions/formatValue';

const MyAgGrid = (props) => {
  const gridRef = useRef(null);
  const [rowData, setRowData] = useState([...props.data]);
  const includeRowSelect = props.includeRowSelect || false
  const selectedRows = props.selectedRecords; // The updated list of selected staffing records
  const formatHeader = props.formatHeader || false;
  const fieldOptions = props.fieldOptions;
  const onCellClicked = props.onCellClicked || null;
  const onCellEdit = props.onCellEdit || null
  const onRowSelected = props.onRowSelected || null; // New prop for row selection callback
  const mode = props.mode
  const tableFieldOptions = props.tableFieldOptions || [];
  const initialNumberOfRowsSelected = props.initialNumberOfRowsSelected || 0;

  const hiddenColumns = props.hiddenColumns || []

  const columnDefs = [];

  if (includeRowSelect){

    const selectField = {
      field: "select",
      headerName: "Include",
      cellStyle: { textAlign: 'center' },
      width: 50,
      filter: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      resizable: false,
      suppressSizeToFit: true,
      cellStyle: { textAlign: 'center' }
    };
    
    columnDefs.push(selectField)
  }
 

  if (rowData.length > 0) {

    Object.keys(rowData[0]).forEach((field) => {
      
      if (!hiddenColumns.includes(field)){

        const fieldOptions = tableFieldOptions.find(item => item.name === field)?.options;
      
        columnDefs.push({
          field: field,
          headerName: formatHeader ? toProperCase(field.replaceAll("_"," ")) : field,
          editable: true,
          sortable: true,
          filter: true,
          cellEditor: fieldOptions  ? 'agSelectCellEditor' : 'agTextCellEditor',
          cellEditorParams: fieldOptions  ? { values: fieldOptions } : null,
          minWidth: 25,
          maxWidth: 150,
          flex: 0,
          headerClass: "ag-header-cell",
          cellStyle: { 
              textAlign: 'center', 
              color: field==="Predicted APH" && "rgb(0,150,50)",
              backgroundColor:  field==="Predicted APH" &&  "rgba(0,225,100,0.25)",
          },
        });
      }
    });
  }


  const handleSelectionChange = (event) => {
    const source = event.source
    console.log(source)
    const updatedSelection = event.api.getSelectedNodes().map(node => node.data);
    if (source ==="checkboxSelected" && JSON.stringify(updatedSelection) !== JSON.stringify(selectedRows)) {
      onRowSelected(updatedSelection);
    }
  };

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

  useEffect(() => {
    if (gridRef.current && gridRef.current.api && selectedRows) {
      gridRef.current.api.forEachNode((node) => {
        const isSelected = selectedRows.some(selectedRow => selectedRow["Employee ID"] === node.data["Employee ID"]);
        node.setSelected(isSelected);
      });
    }
  }, [selectedRows, rowData]);


  const handleCellEdit = (params) => {

    const clonedData = JSON.parse(JSON.stringify(rowData));

    const updatedData = clonedData.map(row => 
      row === params.data ? { ...row, [params.colDef.field]: params.newValue } : row
    );
    setRowData(updatedData);  // Update state with new data
    // onCellEdit && onCellEdit(params); // Optional callback
  };
  
  

  return (
    <div className={mode === "dark" ? `ag-theme-alpine-dark` : `ag-theme-alpine`} style={{ height: "100%", width: '100%' }}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        animateRows={true}
        onCellClicked={handleCellClick}
        onSelectionChanged={handleSelectionChange}
        onCellValueChanged={handleCellEdit}
        gridOptions={gridOptions}
        rowSelection="multiple"
        checkboxSelection={true}
      />
    </div>
  );
};

export default MyAgGrid;



