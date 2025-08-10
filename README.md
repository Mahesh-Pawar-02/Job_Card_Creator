# Manufacturing Job Card Creator Application

A comprehensive web application for creating and managing manufacturing process job cards, specifically designed for heat treatment and quality control processes. Built with vanilla HTML, CSS, and JavaScript, this application provides an intuitive interface for manufacturing professionals, quality managers, and production supervisors to create detailed job cards that track the entire manufacturing process.

## Features

### ✨ Core Functionality
- **Create Manufacturing Job Cards**: Build comprehensive job cards with all essential manufacturing information
- **Real-time Preview**: See how your job card will look as you type
- **Edit & Update**: Modify existing job cards with ease
- **Delete Management**: Remove job cards you no longer need
- **Local Storage**: All data is saved locally in your browser
- **Export/Import**: Backup and share your job card data

### 🏭 Manufacturing-Specific Features
- **Company Information**: Document control with format numbers, revision tracking, and charge numbers
- **Parts Management**: Track multiple parts with weights, quantities, and automatic total weight calculations
- **Incoming Inspection**: Comprehensive quality checks with Yes/No parameters and remarks
- **Heat Treatment Process**: Detailed process tracking with timing (IN/OUT) and temperature data
- **Final Inspection**: Quality parameters with specified vs actual values
- **Quality Management**: Operator signatures and quality manager approvals

### 📊 Process Tracking
- **Visual Inspection**: Dent & damage checks, rust/scaling assessment
- **Pre-processing**: Punching, pasting, fixture inspection, cut piece operations
- **Heat Treatment**: Charge preparation, washing, heating, CHT, tempering, shot blasting
- **Quality Control**: Surface hardness, core hardness, case depth measurements
- **Documentation**: Complete audit trail with operator signatures and timestamps

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Installation
1. Download or clone the project files
2. Open `index.html` in your web browser
3. Start creating manufacturing job cards immediately

### File Structure
```
project01/
├── index.html          # Main application interface
├── styles.css          # Application styling and responsive design
├── script.js           # Core application logic and functionality
├── README.md           # This documentation file
└── demo.html           # Demo page showcasing features
```

## Usage Instructions

### Creating a New Job Card

1. **Company Information**
   - Enter company name and address
   - Set format number, revision number, and date
   - Specify charge number for tracking

2. **Parts Information**
   - Set job date and customer name
   - Add SQF number for quality system reference
   - Enter part details (name, weight, quantity)
   - Add multiple parts as needed
   - Automatic total weight calculation

3. **Incoming Inspection**
   - Select applicable processes (Yes/No)
   - Mark completion status (Yes/No)
   - Add relevant remarks for each process
   - Record operator signature

4. **Heat Treatment Process**
   - Record IN/OUT times for each process step
   - Enter temperature and hardness data
   - Add process-specific remarks
   - Track operator responsible for each step

5. **Final Inspection**
   - Record specified vs actual quality parameters
   - Document surface hardness, core hardness, case depth
   - Add inspection operator signature

6. **Quality Management**
   - Add final remarks (e.g., "OK")
   - Record Quality Manager signature
   - Complete the job card

### Managing Job Cards

- **View All Cards**: See all created job cards in the list below the form
- **Edit Cards**: Click the edit button to modify existing job cards
- **Delete Cards**: Remove unwanted job cards with confirmation
- **Export Data**: Download all job cards as JSON file
- **Import Data**: Restore job cards from previously exported files

### Real-time Preview

The preview section shows exactly how your job card will appear, updating in real-time as you fill out the form. This helps ensure accuracy and completeness before saving.

## Technical Details

### Technology Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Browser Local Storage API
- **Icons**: Font Awesome 6.0
- **Responsive Design**: CSS Grid and Flexbox with media queries

### Data Structure
Job cards are stored as JSON objects with the following structure:
```json
{
  "id": "timestamp",
  "companyName": "Company Name",
  "companyAddress": "Address",
  "formatNo": "Format Number",
  "revNo": "Revision Number",
  "revDate": "Revision Date",
  "chargeNo": "Charge Number",
  "jobDate": "Job Date",
  "customerName": "Customer Name",
  "sqfNo": "SQF Number",
  "parts": [
    {
      "partName": "Part Name",
      "weight": 3.142,
      "quantity": "56 NOS",
      "totalWeight": 175.952
    }
  ],
  "incomingInspection": { /* inspection data */ },
  "heatTreatmentProcess": { /* process data */ },
  "finalInspection": { /* quality data */ },
  "remarks": "OK",
  "qmSignature": "Quality Manager Name",
  "createdAt": "ISO timestamp"
}
```

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Customization

### Styling
- Modify `styles.css` to change colors, fonts, and layout
- Adjust responsive breakpoints in media queries
- Customize form validation and error styling

### Functionality
- Extend `script.js` to add new features
- Modify form fields in `index.html`
- Add new inspection parameters or process steps

### Data Fields
- Add new form fields for additional tracking requirements
- Modify validation rules for specific fields
- Customize export/import data format

## Troubleshooting

### Common Issues

**Form not saving data**
- Check browser console for JavaScript errors
- Ensure browser supports Local Storage
- Verify all required fields are filled

**Preview not updating**
- Refresh the page
- Check for JavaScript errors in console
- Ensure all form elements have proper IDs

**Data not persisting**
- Check browser storage settings
- Clear browser cache and try again
- Verify Local Storage is enabled

**Responsive issues**
- Test on different screen sizes
- Check CSS media queries
- Verify viewport meta tag is present

### Performance Tips
- Limit the number of job cards stored locally
- Export data regularly to prevent storage issues
- Use the clear form function to reset between jobs

## Future Enhancements

### Planned Features
- **Print Functionality**: Generate PDF job cards
- **Database Integration**: Connect to external databases
- **User Authentication**: Multi-user support with roles
- **Advanced Reporting**: Analytics and process optimization
- **Mobile App**: Native mobile application
- **Cloud Sync**: Multi-device synchronization

### API Integration
- **ERP Systems**: Connect to enterprise resource planning
- **Quality Management**: Integrate with QMS software
- **Production Planning**: Link to production scheduling systems

## Contributing

This is an open-source project. Contributions are welcome:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For support or questions:
- Check the troubleshooting section above
- Review browser console for error messages
- Ensure all files are in the same directory
- Verify file permissions and access rights

---

**Note**: This application is designed for manufacturing environments and includes specific fields for heat treatment processes. Modify the form structure and validation rules to match your specific manufacturing requirements.
