import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const AddInvoice = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        date: '',
        clientName: '',
        supportProvider: '',
        hours: '',
        travelKm: '',
        travelHours: '',
        remittance:'',
        serviceType:'',
        notes:'',
        participantsWelfare: '',
        activity: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Display a confirmation dialog
        const userConfirmed = window.confirm("Are you sure you want to submit the form?");
    
        if (userConfirmed) {
        // User clicked "OK" or "Yes," proceed with form submission
    
        // Handle form submission, you can send the formData to an API or do any other logic here
        console.log('Form submitted:', formData);
    
        const newDate = new Date(formData.date);
        const formattedDate = newDate.toLocaleDateString('en-GB');

        // Ensure that remittance is set to 0 if it's undefined, null, or an empty string
        const remittanceValue = formData.remittance ? parseFloat(formData.remittance) : 0;


    
        try {
            const response = await fetch('http://127.0.0.1:8000/api/shift_invoice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // body: JSON.stringify({
                //     date: formattedDate,
                //     client_name: formData.clientName,
                //     support_provider: formData.supportProvider,
                //     participants_welfare: formData.participantsWelfare,
                //     activity: formData.activity
                // }),
                body: JSON.stringify({
                    shiftreport: {
                        date: formattedDate,
                        client_name: formData.clientName.trim(),
                        support_provider: formData.supportProvider.trim(),
                        participants_welfare: formData.participantsWelfare,
                        activity: formData.activity
                    },
                    invoice: {
                        shiftreport_id: 0,
                        client: formData.clientName.trim(),
                        employee: formData.supportProvider.trim(),
                        date: formattedDate,
                        hours: parseFloat(formData.hours),
                        travel_time: parseFloat(formData.travelHours),
                        travel_km: Math.ceil(formData.travelKm),
                        remittance: remittanceValue,
                        invoice_num: "",
                        serviceType:formData.serviceType,
                        notes:formData.notes
                    },
                }),
            });
    
            // Second POST request
            // const response2 = await fetch('http://127.0.0.1:8000/invoice', {
            // method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json',
            // },
            // body: JSON.stringify({
            //     client: formData.clientName,
            //     employee: formData.supportProvider,
            //     date: formattedDate,
            //     hours: parseFloat(formData.hours),
            //     travel_time: parseFloat(formData.travelHours),
            //     travel_km: parseFloat(formData.travelKm),
            //     remittance: parseFloat(formData.remittance),
            //     invoice_num: ""
            // }),
            // });
    
            if (response.ok) {
            console.log('Form data submitted successfully.');
            window.alert('Form submitted successfully!');
            navigate('/');
            // Optionally, reset the form or perform any other action after successful submission
            } else {
            console.error('Failed to submit form data.');
            }
        } catch (error) {
            console.error('Error submitting form data:', error);
        }
        } else {
        // User clicked "Cancel" or "No," do nothing or handle accordingly
        console.log('Form submission canceled.');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{margin: '10px'}}>
            <h2>Create a new invoice</h2>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                <TextField
                    label="Date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    style={{ marginBottom: '16px' }}
                />
                </Grid>
                <Grid item xs={6}>
                <TextField
                    label="Client Name"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                </Grid>
                <Grid item xs={6}>
                <TextField
                    label="Support Provider"
                    name="supportProvider"
                    value={formData.supportProvider}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                </Grid>
                <Grid item xs={6}>
                <TextField
                    label="Hours"
                    name="hours"
                    value={formData.hours}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                </Grid>
                <Grid item xs={4}>
                <TextField
                    label="Travel Km"
                    name="travelKm"
                    value={formData.travelKm}
                    onChange={handleChange}
                    fullWidth
                />
                </Grid>
                <Grid item xs={4}>
                <TextField
                    label="Travel Hours"
                    name="travelHours"
                    value={formData.travelHours}
                    onChange={handleChange}
                    fullWidth
                />
                </Grid>
                <Grid item xs={4}>
                <TextField
                    label="Remittance Price"
                    name="remittance"
                    value={formData.remittance}
                    onChange={handleChange}
                    fullWidth
                />
                </Grid>
                <Grid item xs={4}>
                    <FormControl sx={{ m: 0, minWidth: 210 }}>
                        <InputLabel id="label">Service Type</InputLabel>
                        <Select
                            name="serviceType"
                            value={formData.serviceType}
                            onChange={handleChange}
                            label="Service Type"
                            required
                        >
                            <MenuItem value="Social support">Social support</MenuItem>
                            <MenuItem value="Non face to face">Non face to face</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        label="Notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    label="Participants Welfare"
                    name="participantsWelfare"
                    value={formData.participantsWelfare}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={1}
                    style={{ display: 'none' }}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    label="Activity"
                    name="activity"
                    value={formData.activity}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                    style={{ display: 'none' }}
                />
                </Grid>
            </Grid>
            <Button type="submit" variant="contained" color="primary" style={{marginTop:'10px'}}>
                Submit
            </Button>
        </form>
    );
};

export default AddInvoice;
