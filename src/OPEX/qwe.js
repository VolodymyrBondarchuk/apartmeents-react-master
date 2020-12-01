import { PDFDownloadLink } from '@react-pdf/renderer';
import React from 'react';
import PDFGenerator from './PDFGenerator/PDFGenerator';

const qwe = () => {
    return (
        <PDFDownloadLink id="we"
            document={<PDFGenerator />}
            fileName="invoice.pdf"
            style={{
                textDecoration: "none",
                padding: "10px",
                color: "#4a4a4a",
                backgroundColor: "#f2f2f2",
                border: "1px solid #4a4a4a"
            }}
        >
            {({ blob, url, loading, error }) => { 
                return loading ? "Loading invoice..." : "Export PDF of the invoice"
            }
            }
        </PDFDownloadLink>
    );
}

export default qwe;