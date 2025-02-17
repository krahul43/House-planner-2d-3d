import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { HouseDetails } from '../types/house';

export default function ExportPDF({ 
  houseDetails, 
  viewerRef 
}: { 
  houseDetails: HouseDetails;
  viewerRef: React.RefObject<HTMLDivElement>;
}) {
  const exportToPDF = async () => {
    if (!viewerRef.current) return;

    try {
      // Create PDF with higher quality settings
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: false
      });

      // Get the WebGL canvas
      const canvas = viewerRef.current.querySelector('canvas');
      if (!canvas) return;

      // Convert the WebGL canvas to a high-quality data URL
      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      // Add title with improved styling
      pdf.setFontSize(24);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'bold');
      pdf.text('House Plan Details', 15, 20);

      // Add house details with better formatting
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      
      const details = [
        `Style: ${houseDetails.style.charAt(0).toUpperCase() + houseDetails.style.slice(1)}`,
        `Total Area: ${houseDetails.totalArea} sq ft`,
        `Bedrooms: ${houseDetails.bedrooms}`,
        `Bathrooms: ${houseDetails.bathrooms}`,
        `Floors: ${houseDetails.floors}`,
        `Features: ${[
          houseDetails.hasGarage && 'Garage',
          houseDetails.hasGarden && 'Garden'
        ].filter(Boolean).join(', ')}`
      ];

      details.forEach((detail, index) => {
        pdf.text(detail, 15, 35 + (index * 7));
      });

      // Add the floor plan image with improved quality
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      
      const maxWidth = pageWidth - (margin * 2);
      const maxHeight = pageHeight - (margin * 2) - 60;
      
      const imgRatio = canvas.width / canvas.height;
      let imgWidth = maxWidth;
      let imgHeight = imgWidth / imgRatio;
      
      if (imgHeight > maxHeight) {
        imgHeight = maxHeight;
        imgWidth = imgHeight * imgRatio;
      }
      
      const xPos = margin + ((maxWidth - imgWidth) / 2);
      
      // Add image with high quality settings
      pdf.addImage(imgData, 'JPEG', xPos, 70, imgWidth, imgHeight, undefined, 'FAST');

      // Add footer with improved styling
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'italic');
      pdf.text('Generated by House Plan Generator', pageWidth / 2, pageHeight - 10, { align: 'center' });

      pdf.save('house-plan.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <button
      onClick={exportToPDF}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
      </svg>
      Export as PDF
    </button>
  );
}