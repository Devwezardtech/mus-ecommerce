// src/components/shipment/ShippingSlipModal.jsx

import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import ReactToPdf from 'react-to-pdf';
import ShippingSlip from './ShippingSlip';

const ShippingSlipModal = ({ order, item, onClose }) => {
  const printRef = useRef();

  if (!order || !item) return null;

  return (
    <div className="mt-6">
      {/* Hidden slip content for printing/pdf */}
      <div className="absolute top-0 left-0 opacity-0 pointer-events-none">
        <ShippingSlip ref={printRef} order={order} item={item} />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <ReactToPrint
          trigger={() => (
            <button className="bg-green-600 text-white px-3 py-1 rounded">
              🖨️ Print Shipping Slip
            </button>
          )}
          content={() => printRef.current}
          onAfterPrint={onClose}
        />

        <ReactToPdf
          targetRef={printRef}
          filename={`ShippingSlip-${order._id}.pdf`}
          options={{ orientation: 'portrait', unit: 'mm', format: 'a5' }}
        >
          {(toPdf) => (
            <button onClick={toPdf} className="bg-blue-600 text-white px-3 py-1 rounded">
              📄 Download PDF
            </button>
          )}
        </ReactToPdf>

        <button
          onClick={onClose}
          className="bg-gray-400 text-white px-3 py-1 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ShippingSlipModal;
