import React, { useState } from "react";
import { DataGrid, GridToolbar, GridPagination } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "./utils/common";

const dateComparator = (date1, date2) => {
  const [day1, month1, year1] = date1.split("/").map(Number);
  const [day2, month2, year2] = date2.split("/").map(Number);

  const dateObject1 = new Date(year1, month1 - 1, day1); // Months are 0-indexed in JavaScript Dates
  const dateObject2 = new Date(year2, month2 - 1, day2);

  return dateObject1.getTime() - dateObject2.getTime();
};

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "employee", headerName: "Employee", width: 130 },
  {
    field: "date",
    headerName: "Date",
    width: 120,
    sortable: true,
    sortComparator: dateComparator,
  },
  { field: "total_hours", headerName: "Total Hours", width: 120 },
  { field: "total_km", headerName: "Total KM", width: 120 },
  { field: "total_remittance", headerName: "Total Remittance", width: 120 },
];

const Payrun = () => {
  const navigate = useNavigate();
  const [employeeName, setEmployeetName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rows, setRows] = useState([]);
  const formatDateForBackend = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleAddButtonClick = () => {
    // Implement the logic for adding a new item here
    navigate("/addpayrun");
  };

  const handleSearchButtonClick = async () => {
    console.log(startDate);
    try {
      // Fetch data from the backend API based on search criteria
      const formattedStartDate = startDate
        ? formatDateForBackend(startDate)
        : "";
      const formattedEndDate = endDate ? formatDateForBackend(endDate) : "";
      const response = await fetch(
        `${BACKEND_URL}/payruns?start_date=${formattedStartDate}&end_date=${formattedEndDate}&employee=${employeeName.trim()}`
      );
      const data = await response.json();
      setRows(data); // Assuming that the response is an array of objects representing rows
      console.log(startDate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", justifyContent: "start", margin: "10px" }}>
        <div>
          <TextField
            label="Employee Name"
            value={employeeName}
            onChange={(e) => setEmployeetName(e.target.value)}
          />
          &nbsp;&nbsp;&nbsp;
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            tyle={{ marginBottom: "16px" }}
          />
          &nbsp;&nbsp;&nbsp;
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            style={{ marginBottom: "16px" }}
          />
          &nbsp;&nbsp;&nbsp;
        </div>
        <div style={{ margin: "10px" }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleSearchButtonClick}
          >
            Search Payrun
          </Button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: "20px",
          marginLeft: "10px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddButtonClick}
        >
          +ADD new payrun
        </Button>
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[10]}
        checkboxSelection
        components={{
          Toolbar: (props) => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "10px",
              }}
            >
              <GridToolbar {...props} />
            </div>
          ),
          Pagination: (props) => <GridPagination {...props} />,
        }}
      />
    </div>
  );
};

export default Payrun;
