# ARGILETTE CRM - Bulk Contact Import Guide

## Overview
ARGILETTE CRM now supports bulk contact import through CSV and Excel files, allowing you to efficiently add hundreds or thousands of contacts at once.

## Supported File Formats
- **CSV** (.csv) - Comma-separated values
- **Excel** (.xls, .xlsx) - Microsoft Excel spreadsheets
- **Maximum file size**: 10MB

## Smart Field Mapping
The system automatically maps column headers to contact fields using flexible matching:

### Name Field
Recognizes: `name`, `full name`, `fullname`, `contact name`, `first name`, `firstname`

### Email Field  
Recognizes: `email`, `email address`, `e-mail`, `mail`

### Phone Field
Recognizes: `phone`, `phone number`, `telephone`, `mobile`, `cell`

### Company Field
Recognizes: `company`, `organization`, `business`, `firm`, `corp`

### Job Title Field
Recognizes: `job title`, `title`, `position`, `role`, `designation`

### Lead Source Field
Recognizes: `lead source`, `source`, `origin`, `channel`

### Status Field
Recognizes: `status`, `lead status`, `contact status`

## Import Process

### 1. Access Import Feature
- Navigate to "Contacts" in the sidebar
- Click on "Bulk Import" tab
- Use the file upload area to select your file

### 2. File Requirements
- First row must contain column headers
- Each contact must have either a name or email address
- Email addresses must be in valid format
- Duplicate emails will be automatically skipped

### 3. Import Results
After upload, you'll receive a detailed report:
- **Imported**: Number of successfully added contacts
- **Duplicates**: Contacts skipped due to existing email addresses
- **Failed**: Contacts that couldn't be imported with error details

## Sample CSV Template
```csv
name,email,phone,company,job title,lead source,status
John Doe,john@example.com,+1-555-0123,ACME Corp,Sales Manager,Website,active
Jane Smith,jane@company.com,+1-555-0456,Tech Solutions,Marketing Director,Referral,active
```

## Best Practices

### Data Preparation
- Clean your data before importing
- Use consistent formatting for phone numbers
- Include company information when available
- Specify lead sources for better tracking

### Quality Control
- Download and use the provided template
- Test with a small file first
- Review import results carefully
- Check for any failed imports and correct data

### Common Issues
- **Invalid email format**: Ensure emails follow standard format
- **Missing required data**: Each contact needs name or email
- **Large files**: Break files over 10MB into smaller chunks
- **Special characters**: May cause parsing issues in some systems

## Download Template
Use the "Download Template" button to get a properly formatted CSV file that you can fill with your contact data.

## Error Handling
The system provides detailed error messages for failed imports:
- Row numbers for easy identification
- Specific error descriptions
- Validation failure reasons

This bulk import feature dramatically speeds up contact management, allowing you to efficiently migrate from other systems or import large contact lists.