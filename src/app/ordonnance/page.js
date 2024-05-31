'use client'
import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const Page = () => {
  const contentRef = useRef();

  const generatePdf = () => {
    const input = contentRef.current;
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save("download.pdf");
      });
  };

  return (
    <div>
      <div className='mt-[100px]' ref={contentRef}>
        <h1>hello</h1>
        <h2>salut</h2>
      </div>
      <button onClick={generatePdf}>Generate PDF</button>
    </div>
  );
};

export default Page;
