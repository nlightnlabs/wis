import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { toProperCase } from '../functions/formatValue.js';

const Table = (props) => {
    const data = props.data || [];
    const columnWidths = props.columnWidths || [];
    const filterableColumns = props.filterableColumns || [];
    const hiddenColumns = props.hiddenColumns || [];
    const sortableColumns = props.sortableColumns || [];
    const sortingOrder = props.sortingOrder || [];
    const selectRows = props.selectRows;
    const onCellClicked = props.onCellClicked;
    const mode = props.mode;

    const [tableData, setTableData] = useState([]);
    const [fields, setFields] = useState([]);

    const getTableData = async () => {
        let selectField = {
            field: "select",
            headerName: "",
            cellStyle: { textAlign: 'center' },
            width: 20,
            filter: false,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            resizable: false,
            suppressSizeToFit: true,
        };

        let fieldList = [selectField];
        if (data.length > 0) {
            Object.keys(data[0]).map((field) => {
                fieldList.push({
                    field: field,
                    headerName: toProperCase(field.replaceAll("_", " ")),
                    width: columnWidths.find(i => i.columnName === field) && columnWidths.find(i => i.columnName === field).width,
                    filter: filterableColumns.includes(field) ? true : true,
                    sortable: sortableColumns.find(i => i.name === field) ? true : false,
                    sort: sortableColumns.find(i => i.name === field) && sortableColumns.find(i => i.name === field).order,
                    hide: hiddenColumns.includes(field) ? true : false,
                    suppressSizeToFit: hiddenColumns.includes(field) ? true : false,
                    minWidth: 100, // Minimum width for the column to prevent too narrow columns
                    editable: true,
                    cellEditor: 'agSelectCellEditor', // Example of using a select dropdown
                    cellEditorParams: {
                    values: ['Option 1', 'Option 2', 'Option 3'], // Dropdown options
                    },
                    // flex: 1
                    // flex: hiddenColumns.includes(field) ? undefined : 1,
                    // headerClass: "header-cell-wrap"
                });
            });

            setFields(fieldList);
        }

        setTableData(data);
    };

    useEffect(() => {
        getTableData();
    }, [props.data]);

    const handleCellClick = (e) => {
        if (typeof onCellClicked === "function") {
            onCellClicked(e.data);
        }
    };

    const [selectedRows, setSelectedRows] = useState([]);

    const gridOptions = {
        onGridReady: (params) => {
            // params.api.sizeColumnsToFit();
            params.api.autoSizeAllColumns(); // Auto size columns to fit content
        },
        rowClassRules: {
            'selected-row': (params) => params.node.isSelected(),
        },
        getRowStyle: (params) => {
            if (params.node && params.node.isSelected()) {
                return { background: 'gray' };
            }
            return null;
        },
        onSelectionChanged: (event) => {
            const selectedNodes = event.api.getSelectedNodes();
            const selectedRowData = selectedNodes.map(node => node.data);
            setSelectedRows(selectedRowData);
            console.log('Selected Rows:', selectedRowData);
        },
    };

    useEffect(() => {
        if (typeof selectRows === "function") {
            selectRows(selectedRows);
        }
    }, [selectedRows]);

    return (
        <div className="flex-container w-full h-100">
            <div
                className={`ag-theme-alpine${mode === "dark" ? '-dark' : ''}`}
                style={{ height: 450 }}
            >
                {tableData &&
                    <AgGridReact
                        rowData={tableData}
                        columnDefs={fields}
                        sortingOrder={sortingOrder ? sortingOrder : null}
                        onCellClicked={(e) => handleCellClick(e)}
                        // gridOptions={gridOptions}
                        rowSelection="multiple"
                        checkboxSelection={true}
                    />
                }
            </div>
        </div>
    );
};

export default Table;
