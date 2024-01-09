import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Checkbox } from '@mui/material';


// const columns = [
//   { field: 'id', headerName: 'ID', width: 70 },
//   { field: 'client', headerName: 'Client', width: 130 },
//   { field: 'employee', headerName: 'Employee', width: 130 },
//   { field: 'date', headerName: 'Date', width: 120, sortable: true, sortComparator: dateComparator },
//   { field: 'hours', headerName: 'Hours', width: 120 },
//   { field: 'travel_time', headerName: 'Travel Time', width: 120 },
//   { field: 'travel_km', headerName: 'Travel KM', width: 120 },
// ];

const AddPayrun = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rows, setRows] = useState([]);
  const formatDateForBackend = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const [selectionModel, setSelectionModel] = React.useState([]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelections = rows.map((row) => row.id);
      setSelectionModel(newSelections);
    } else {
      setSelectionModel([]);
    }
  };

  const handleCheckboxClick = (event, id) => {
    const selectedIndex = selectionModel.indexOf(id);
    let newSelections = [];

    if (selectedIndex === -1) {
      newSelections = [...selectionModel, id];
    } else {
      newSelections = [...selectionModel.slice(0, selectedIndex), ...selectionModel.slice(selectedIndex + 1)];
    }

    setSelectionModel(newSelections);
  };

  const handlePrintSelectedRows = async () => {
    // Print selected rows to the console
    const selectedRows = selectionModel.map((rowId) => rows.find((row) => row.id === rowId));
    console.log('Selected Rows:', selectedRows);

    // Example: Access data of the first selected row
    if (selectedRows.length > 0) {
      const firstSelectedRowData = selectedRows[0];
      console.log('Data of the first selected row:', firstSelectedRowData);
    }

    // Calculate the sum of hours, travel time, and travel km for rows with the same date
    const dateToSumMap = selectedRows.reduce((acc, row) => {
        const { date, hours, travel_time, travel_km, remittance } = row;
        acc[date] = acc[date] || { total_hours: 0, total_km: 0, total_remittance: 0};
        acc[date].total_hours += hours + travel_time;
        acc[date].total_km += travel_km;
        acc[date].total_remittance += remittance
        return acc;
    }, {});

    const recordsArray = Object.entries(dateToSumMap).map(([date, { total_hours, total_km, total_remittance }]) => ({
        employee: employeeName,  // Replace with actual employee name or retrieve it from your state
        date,
        total_hours: total_hours,
        total_km: total_km,
        total_remittance: total_remittance,
      }));
  
    console.log('Sum of hours, travel time, and travel km by date:', dateToSumMap);
    console.log('AESSS', recordsArray);

    const userConfirmed = window.confirm("Are you sure you want to submit the form?");
    
    if (userConfirmed) {
        try {
            // Prepare the list of records for the API request
            const dataToSend = { records: recordsArray };
            console.log('dddd', dataToSend);
            // Send the data to the backend API
            const response = await fetch('http://127.0.0.1:8000/store_payrun_data', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(dataToSend),
            });
        
            if (response.ok) {
              console.log('Payrun data stored successfully');
              window.alert('Payrun created successfully!');
              // Optionally, you can update the UI or perform other actions after successful storage
            } else {
              console.error('Error storing invoice data:', response.statusText);
            }
          } catch (error) {
            console.error('Error:', error);
          }

    } else {
        console.log('Form submission canceled.');
    }

  };

  const handleSearchButtonClick = async () => {

    if (employeeName.trim() === '') {
      // Handle the case when the value is empty
      console.log('Employee name is required!');
      window.alert('Employee name is required!');
      return;
    }
    console.log(startDate);
    try {
      // Fetch data from the backend API based on search criteria
      const formattedStartDate = startDate ? formatDateForBackend(startDate) : '';
      const formattedEndDate = endDate ? formatDateForBackend(endDate) : '';
      const response = await fetch(`http://127.0.0.1:8000/invoices/employee?start_date=${formattedStartDate}&end_date=${formattedEndDate}&employee=${employeeName.trim()}`);
      const data = await response.json();
      setRows(data); // Assuming that the response is an array of objects representing rows
      console.log(data);
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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                        indeterminate={selectionModel.length > 0 && selectionModel.length < rows.length}
                        checked={selectionModel.length === rows.length}
                        onChange={handleSelectAllClick}
                        />
                    </TableCell>
                    <TableCell align="center">ID</TableCell>
                    <TableCell align="center">Client</TableCell>
                    <TableCell align="center">Employee</TableCell>
                    <TableCell align="center">Date</TableCell>
                    <TableCell align="center">Hours</TableCell>
                    <TableCell align="center">Travel Time</TableCell>
                    <TableCell align="center">Travel KM</TableCell>
                    <TableCell align="center">Remittance Price</TableCell>
                    <TableCell align="center">Shift Report ID</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => (
                    <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell padding="checkbox">
                            <Checkbox
                                checked={selectionModel.indexOf(row.id) !== -1}
                                onChange={(event) => handleCheckboxClick(event, row.id)}
                            />
                        </TableCell>
                        <TableCell   align="center">
                            {row.id}
                        </TableCell>
                        <TableCell  align="center">
                            {row.client}
                        </TableCell>
                        <TableCell align="center">{row.employee}</TableCell>
                        <TableCell align="center">{row.date}</TableCell>
                        <TableCell align="center">{row.hours}</TableCell>
                        <TableCell align="center">{row.travel_time}</TableCell>
                        <TableCell align="center">{row.travel_km}</TableCell>
                        <TableCell align="center">{row.remittance}</TableCell>
                        <TableCell align="center">{row.shiftreport_id}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={handlePrintSelectedRows} variant="contained" color="primary" style={{marginTop:'30px',width:'200px'}}>Generate a Payrun</Button>
    </div>
  );
};

export default AddPayrun;
