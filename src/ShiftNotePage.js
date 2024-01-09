import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
const dateComparator = (date1, date2) => {
  const [day1, month1, year1] = date1.split('/').map(Number);
  const [day2, month2, year2] = date2.split('/').map(Number);

  const dateObject1 = new Date(year1, month1 - 1, day1); // Months are 0-indexed in JavaScript Dates
  const dateObject2 = new Date(year2, month2 - 1, day2);

  return dateObject1.getTime() - dateObject2.getTime();
};


const ShiftNotePage = () => {
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0); // Track the total number of rows
  const [page, setPage] = useState(1); // Current page
  const pageSize = 10; // Number of rows per page
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState('');
  const [clientNames, setClientNames] = useState([]);


  const handleButtonClick = (id) => {
    console.log(`Button clicked for row with ID ${id}`);
    // navigate(`/reportdetail/${id}`);
    window.open(`/reportdetail/${id}`, '_blank');
  };
  
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'client', headerName: 'Client', width: 130 },
    { field: 'date', headerName: 'Date', width: 130, sortable: true, sortComparator: dateComparator },
    { field: 'support_provider', headerName: 'Support Provider', width: 120 },
    {
      field: 'action',
      headerName: 'Action',
      width: 120,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleButtonClick(params.row.id)}
        >
          View
        </Button>
      ),
    },
  ];

    const fetchClientData = async (clientName, currentPage) => {
        try {
        const response = await fetch(`http://127.0.0.1:8000/byname/shift_reports/${clientName}?page=${currentPage}&pageSize=${pageSize}`);
        const data = await response.json();
        setRows(data.results); // Assuming that the response is an array of objects representing rows
        setTotalRows(data.total); // Assuming that the response contains the total number of rows
        } catch (error) {
        console.error('Error fetching data:', error);
        }
    };

  console.log('Page',page);

  const handleAddButtonClick = () => {
    // Implement the logic for adding a new item here
    navigate('/addreport');
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    fetchClientData(selectedItem, newPage);
  };

  const handleSelectChange = (event) => {
    setSelectedItem(event.target.value);
  };

  const searchButtonClick = () => {
    // Log the selected item value to the console
    console.log('Selected Item:', selectedItem);
    fetchClientData(selectedItem, 1);
  };

  useEffect(() => {
    // Fetch client names from your FastAPI backend
    const fetchClientNames = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/client');
        const data = await response.json();
        const extractedClientNames = data.map(item => item.name);
        console.log("SSS",extractedClientNames);
        setClientNames(extractedClientNames);
      } catch (error) {
        console.error('Error fetching client names:', error);
      }
    };

    fetchClientNames();
  }, []);
  console.log(clientNames);

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="label">Client Name</InputLabel>
          <Select
            value={selectedItem}
            onChange={handleSelectChange}
            label="Client Name"
          >
            {/* <MenuItem value="Ann-Marie">Ann-Marie</MenuItem>
            <MenuItem value="item2">Item 2</MenuItem>
            <MenuItem value="item3">Item 3</MenuItem> */}
            {clientNames.map((clientName) => (
            <MenuItem key={clientName} value={clientName}>
                {clientName}
            </MenuItem>
            ))}
          </Select>
          </FormControl>
          <Button variant="contained" color="secondary" onClick={searchButtonClick}>
            Display Info
          </Button>
        </div>
        <Button variant="contained" color="primary" onClick={handleAddButtonClick}>
          +ADD new shift
        </Button>
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        page={page}
        pageSizeOptions={[10]}
        checkboxSelection
      />
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} style={{ marginTop: '10px' }}>
        <Pagination
          count={Math.ceil(totalRows / pageSize)}
          page={page}
          onChange={handlePageChange}
        />
      </Stack>
    </div>
  );
};

export default ShiftNotePage;
