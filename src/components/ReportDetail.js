import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ReportDetail = () => {
  // 使用 useParams 获取路由参数中的 id
  const { id } = useParams();
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/shiftreport/${id}`);
        const data = await response.json();
        setReportData(data); // 假设返回的数据是一个对象，包含报告的详细信息
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };

    fetchReportData();
  }, [id]);

  const handleExport = async () => {
    const table = document.getElementById('myTable');
  
    // Use html2canvas to convert the table to an image
    const canvas = await html2canvas(table);
  
    // Create a new jsPDF instance
    const pdf = new jsPDF('p', 'pt', 'letter');
  
    // Calculate the aspect ratio to maintain the table's proportions
    const aspectRatio = canvas.width / canvas.height;
  
    // Set the maximum width and height of the image in the PDF
    const maxWidth = pdf.internal.pageSize.width - 30; // Subtracting margins
    const maxHeight = maxWidth / aspectRatio;
  
    // Add the image of the table to the PDF
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 15, 15, maxWidth, maxHeight);
  
    // Save the PDF
    pdf.save(`${reportData.client_name}(${reportData.date})-${reportData.support_provider}.pdf`);
  };

  if (!reportData) {
    // 数据还在加载中
    return <div>Loading...</div>;
  }

  return (
    <>
    <table id="myTable" style={{ borderCollapse: 'collapse', width: '100%' , marginTop:'30px'}}>
      <tbody>
        {/* First row with two columns */}
        <tr>
          <td style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>
            <strong style={{marginRight:'10px'}}>Client:</strong> 
            {reportData.client_name}
          </td>
          <td style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>
            <strong style={{marginRight:'10px'}}>Date:</strong> 
            {reportData.date}
          </td>
        </tr>

        {/* Second row with one column */}
        <tr>
          <td style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }} colSpan="2">
            <strong style={{marginRight:'10px'}}>Participants:</strong> 
            {reportData.participants_welfare}
          </td>
        </tr>

        {/* Third row with one column */}
        <tr>
          <td style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }} colSpan="2">
            <strong style={{marginRight:'10px'}}>Support Provider:</strong> 
            {reportData.support_provider}
          </td>
        </tr>

        {/* Fourth row with one column */}
        <tr>
          <td style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }} colSpan="2">
            <strong>Activity:</strong> 
            <br />{reportData.activity}
          </td>
        </tr>
      </tbody>
    </table>
    <button onClick={handleExport}>Export to PDF</button>
    </>
  );
};

export default ReportDetail;
