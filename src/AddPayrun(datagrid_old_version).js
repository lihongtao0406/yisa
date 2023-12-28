import React, { useState } from 'react';
import { DataGrid, GridToolbar, GridPagination } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const dateComparator = (date1, date2) => {
  const [day1, month1, year1] = date1.split('/').map(Number);
  const [day2, month2, year2] = date2.split('/').map(Number);

  const dateObject1 = new Date(year1, month1 - 1, day1); // Months are 0-indexed in JavaScript Dates
  const dateObject2 = new Date(year2, month2 - 1, day2);

  return dateObject1.getTime() - dateObject2.getTime();
};

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'client', headerName: 'Client', width: 130 },
  { field: 'employee', headerName: 'Employee', width: 130 },
  { field: 'date', headerName: 'Date', width: 120, sortable: true, sortComparator: dateComparator },
  { field: 'hours', headerName: 'Hours', width: 120 },
  { field: 'travel_time', headerName: 'Travel Time', width: 120 },
  { field: 'travel_km', headerName: 'Travel KM', width: 120 },
];

const AddPayrun = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rows, setRows] = useState([]);
  const formatDateForBackend = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleSearchButtonClick = async () => {
    console.log(startDate);
    try {
      // Fetch data from the backend API based on search criteria
      const formattedStartDate = formatDateForBackend(startDate);
      const formattedEndDate = formatDateForBackend(endDate);
      const response = await fetch(`http://127.0.0.1:8000/invoices?start_date=${formattedStartDate}&end_date=${formattedEndDate}&client=${employeeName}`);
      const data = await response.json();
      setRows(data); // Assuming that the response is an array of objects representing rows
      console.log(startDate);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginLeft:'10px' }}>
        <h2>Create a new payrun</h2>
      </div>    
      <div style={{ display: 'flex', justifyContent: 'start', margin: '10px' }}>
        <div>
          <TextField
            label="Employee Name"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
          />
          &nbsp;&nbsp;&nbsp;
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            tyle={{ marginBottom: '16px' }}
          />
          &nbsp;&nbsp;&nbsp;
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            style={{ marginBottom: '16px' }}
          />
          &nbsp;&nbsp;&nbsp;
        </div>
        <div style={{ margin: '10px' }}>
          <Button variant="contained" color="success" onClick={handleSearchButtonClick}>
            Search
          </Button>
        </div>
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[10]}
        checkboxSelection
        components={{
          Toolbar: (props) => (
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }}>
              <GridToolbar {...props} />
            </div>
          ),
          Pagination: (props) => <GridPagination {...props} />,
        }}
      />
    </div>
  );
};

export default AddPayrun;
