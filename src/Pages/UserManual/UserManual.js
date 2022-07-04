import React, {useEffect, useState} from 'react';
import { Document, Page, pdfjs } from "react-pdf";
import pdfFile from './User Manual.pdf';
import './UserManual.css';
import {useSearchParams} from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function UserManual() {
    const [numPages, setNumPages] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setTimeout(()=>{
            const pageToScrollTo = document.querySelector(`.react-pdf__Page[data-page-number="${searchParams.get("page")}"]`);
            pageToScrollTo.scrollIntoView();
        },100)
    }

    return (
        <div className={"UserManual"}>
            <Document
                file={pdfFile}
                options={{ workerSrc: "/pdf.worker.js" }}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                {Array.from(new Array(numPages), (el, index) => (
                    <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={96/72} />
                ))}
            </Document>
        </div>
    );
}