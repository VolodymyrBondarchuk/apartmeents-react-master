import { PDFDownloadLink } from '@react-pdf/renderer';
import React, { useEffect, useState } from 'react';
import Backdrop from './UI/Backdrop';
import PDFGeneratorUtilities from './Utilities/PDFGenerator/PDFGeneratorUtilities';
import PDFGeneratorOpex from './OPEX/PDFGenerator/PDFGenerator';
import classes from './PdfDownloadModal.module.css';

const PdfDownloadModal = (props) => {

    const [firstLoaded, setFirstLoaded] = useState(false);
    const [finished, setFinished] = useState(false);
    let invoices = props.invoices;
    let pdfGeneratorEnglish =
        props.isOpex ? <PDFGeneratorOpex invoices={invoices} english removeModal={props.removeModal} />
            : <PDFGeneratorUtilities invoices={invoices} english removeModal={props.removeModal} />;

    let pdfGeneratorRussian = props.isOpex ? <PDFGeneratorOpex invoices={invoices} removeModal={props.removeModal} />
        : <PDFGeneratorUtilities invoices={invoices} removeModal={props.removeModal} />;
    return (
        <>
            <Backdrop cancelDelete={props.removeModal} />
            <div className={classes.PdfModal.concat(" shadow")}>
                <button className="fa fa-times" aria-hidden="true" style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    color: 'red',
                    cursor: 'pointer',
                    border: "none",
                    outline: "none"
                }} onClick={props.removeModal}>

                </button>
                <p>Download file in the preferred language?</p>
                <br />
                {!finished &&
                    <p>Loading pdf...</p>
                }
                <div style={{ display: finished ? "" : "none" }}>

                    {<PDFDownloadLink id="we" key={1}
                        document={pdfGeneratorEnglish}
                        fileName="invoice_english.pdf"
                        style={{
                            textDecoration: "none",
                            padding: "10px",
                            color: "#4a4a4a",
                            backgroundColor: "#f2f2f2",
                            border: "1px solid #4a4a4a",
                            float: 'left'
                        }}
                    >
                        {({ blob, url, loading, error }) => {
                            // downloadLink = url;
                            if (!loading)
                                setFirstLoaded(true);
                            return loading ? "Loading english..." : "Export PDF in English"
                        }
                        }
                    </PDFDownloadLink>
                    }


                    {firstLoaded &&
                        <PDFDownloadLink id="w1e" key={2}
                            document={pdfGeneratorRussian}
                            fileName="invoice_russian.pdf"
                            style={{
                                textDecoration: "none",
                                padding: "10px",
                                color: "#4a4a4a",
                                backgroundColor: "#f2f2f2",
                                border: "1px solid #4a4a4a",
                                float: 'right'
                            }}

                        >
                            {({ blob, url, loading, error }) => {
                                //downloadLink = url;
                                if (!loading)
                                    setFinished(true);
                                return loading ? "Loading russian..." : "Export PDF in Russian"
                            }
                            }
                        </PDFDownloadLink>
                    }
                </div>
            </div>
        </>
    )
}

export default PdfDownloadModal;