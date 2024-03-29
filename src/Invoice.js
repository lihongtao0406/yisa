import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar, GridPagination } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
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

const Invoice = () => {
  const [clientName, setClientName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rows, setRows] = useState([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null); // To store the ID of the selected invoice for deletion
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const formatDateForBackend = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };
  const navigate = useNavigate();

  const handleAddButtonClick = () => {
    // Implement the logic for adding a new item here
    navigate("/addinvoice");
  };

  const handleDeleteClick = (id) => {
    setSelectedInvoiceId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // Send a DELETE request to your backend API to delete the invoice with the selectedInvoiceId
      const response = await fetch(
        `${BACKEND_URL}/invoices/${selectedInvoiceId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log(
          `Invoice with ID ${selectedInvoiceId} deleted successfully`
        );
        // Fetch the updated list of invoices after deletion
        const updatedResponse = await fetch(
          `${BACKEND_URL}/invoices?start_date=${startDate}&end_date=${endDate}&client=${clientName.trim()}`
        );
        const updatedData = await updatedResponse.json();
        setRows(updatedData);
        // Perform any additional actions, such as updating the UI or refreshing the invoice list
      } else {
        console.error(`Failed to delete invoice with ID ${selectedInvoiceId}`);
        // Handle error, maybe display an error message to the user
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      // Handle error, maybe display an error message to the user
    } finally {
      // Close the delete confirmation dialog
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setSelectedInvoiceId(null);
    setIsDeleteDialogOpen(false);
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
        `${BACKEND_URL}/invoices?start_date=${formattedStartDate}&end_date=${formattedEndDate}&client=${clientName.trim()}`
      );
      const data = await response.json();
      setRows(data); // Assuming that the response is an array of objects representing rows
      console.log("formattedStartDate", formattedStartDate);
      console.log("asdad", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Fetch all invoices when the component mounts
    const fetchAllInvoices = async () => {
      try {
        const formattedStartDate = startDate
          ? formatDateForBackend(startDate)
          : "";
        const formattedEndDate = endDate ? formatDateForBackend(endDate) : "";
        const response = await fetch(
          `${BACKEND_URL}/invoices?start_date=${formattedStartDate}&end_date=${formattedEndDate}&client=${clientName.trim()}`
        );
        const data = await response.json();
        setRows(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllInvoices();
  }, [clientName, endDate, startDate]);

  const columns = [
    // { field: 'id', headerName: 'ID', width: 70 },
    { field: "client", headerName: "Client", width: 130 },
    { field: "employee", headerName: "Employee", width: 130 },
    { field: "serviceType", headerName: "Service Type", width: 120 },
    {
      field: "date",
      headerName: "Date",
      width: 120,
      sortable: true,
      sortComparator: dateComparator,
    },
    { field: "hours", headerName: "Hours", width: 120 },
    { field: "travel_time", headerName: "Travel Time", width: 120 },
    { field: "travel_km", headerName: "Travel KM", width: 120 },
    { field: "remittance", headerName: "Remittance Price", width: 120 },
    // { field: 'shiftreport_id', headerName: 'Shift Report ID', width: 120 },
    { field: "notes", headerName: "Notes", width: 120 },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => handleDeleteClick(params.row.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

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
            label="Client Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
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
            color="primary"
            onClick={handleSearchButtonClick}
            style={{ display: "None" }}
          >
            Search Invoice
          </Button>
        </div>
        <div style={{ marginLeft: "auto", margin: "10px" }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddButtonClick}
          >
            +ADD new invoice
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
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this invoice?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Invoice;
