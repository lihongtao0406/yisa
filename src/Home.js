import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { BACKEND_URL } from "./utils/common";

const dateComparator = (date1, date2) => {
  const [day1, month1, year1] = date1.split('/').map(Number);
  const [day2, month2, year2] = date2.split('/').map(Number);

  const dateObject1 = new Date(year1, month1 - 1, day1); // Months are 0-indexed in JavaScript Dates
  const dateObject2 = new Date(year2, month2 - 1, day2);

  return dateObject1.getTime() - dateObject2.getTime();
};


const Home = () => {
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0); // Track the total number of rows
  const [page, setPage] = useState(1); // Current page
  const pageSize = 30; // Number of rows per page
  const navigate = useNavigate();


  const handleButtonClick = (id) => {
    console.log(`Button clicked for row with ID ${id}`);
    navigate(`/reportdetail/${id}`);
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

  useEffect(() => {
    // Fetch data from the backend API based on the current page
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/page/shift_reports/?page=${page}&pageSize=${pageSize}`);
        const data = await response.json();
        setRows(data.results); // Assuming that the response is an array of objects representing rows
        setTotalRows(data.total); // Assuming that the response contains the total number of rows
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [page, pageSize]);

  console.log(page);

  const handleAddButtonClick = () => {
    // Implement the logic for adding a new item here
    navigate('/addreport');
  };

  const handlePageChange = (event, newPage) => {
    console.log("123");
    setPage(newPage);
  };

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}>
        <Button variant="contained" color="primary" onClick={handleAddButtonClick}>
          +ADD new shift
        </Button>
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        page={page}
        //autoPageSize
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

export default Home;
