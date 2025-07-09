import React, { useEffect, useRef, useState } from 'react';
import api from "../../api/axios";
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContect';
import ShippingSlip from '../../components/shipment/ShippingSlip';
import html2pdf from 'html2pdf.js';

const PDFShipment = () => {
  const { orderId, itemId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const pdfRef = useRef(null);
  const [order, setOrder] = useState(null);
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get(
          `/orders/seller/${orderId}/${itemId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrder(res.data.order);
        setItem(res.data.item);
      } catch (error) {
        console.error('Fetch failed:', error);
      }
    };

    fetchData();
  }, [orderId, itemId]);

  const handleDownload = () => {
    const element = pdfRef.current;
    const opt = {
      margin: 0.3,
      filename: `ShippingSlip-${order._id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a5', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
  };

  if (!order || !item) {
    return (
      <div className="p-4 text-center ">
        <p>Loading...</p>
        <button
          onClick={() => navigate('/seller/orders')}
          className="mt-2 px-4 py-2 bg-gray-600 text-white rounded"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="fixed w-full z-50">
        <HeaderSeller />
      </div>
      <h2 className=" pt-20 text-xl font-bold text-center mb-4">
       Shipping Slip PDF Preview
      </h2>

      <div
        ref={pdfRef}
        className="bg-white p-4 shadow border rounded max-w-md mx-auto"
      >
        <ShippingSlip order={order} item={item} seller={user} />
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={handleDownload}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          📄 Confirm & Download PDF
        </button>

        <button
          onClick={() => navigate('/seller/orders')}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PDFShipment;
