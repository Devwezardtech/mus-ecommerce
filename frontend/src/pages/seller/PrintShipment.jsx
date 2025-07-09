import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../../api/axios";
import ShippingSlip from '../../components/shipment/ShippingSlip';
import { useAuth } from '../../contexts/AuthContect';
import { useReactToPrint } from 'react-to-print';
import HeaderSeller from './HeaderSeller'

const PrintShipment = () => {
  const { orderId, itemId } = useParams();
  const [order, setOrder] = useState(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [printError, setPrintError] = useState(false); // for "nothing to print"
  const { user } = useAuth();
  const navigate = useNavigate();
  const printRef = useRef();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get(
          `/orders/seller/${orderId}/${itemId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrder(res.data.order);
        setItem(res.data.item);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, itemId]);

  const handlePrint = useReactToPrint({
    content: () => {
      if (!printRef.current) {
        setPrintError(true); // show retry
        console.warn('Nothing to print (printRef is null)');
        return null;
      }
      return printRef.current;
    },
    documentTitle: 'Shipping Slip',
    onAfterPrint: () => {
      alert(' Successfully printed!');
      navigate('/seller/dashboard');
    },
  });

  const handleRetry = () => {
    setPrintError(false);
    window.location.reload();
  };

  if (loading) return <p className="p-4">Loading...</p>;

  if (!order || !item) {
    return (
      <div>
             <div className="fixed w-full z-50">
              <HeaderSeller />
            </div>
      
      <div className="p-4 text-red-500">
        <p>Order or item not found.</p>
        <button
          onClick={() => navigate('/seller/orders')}
          className="mt-2 px-4 py-2 bg-gray-600 text-white rounded"
        >
          Back to Orders
        </button>
      </div>
      </div>
    );
  }

  return (
    <div>
             <div className="fixed w-full z-50">
              <HeaderSeller />
            </div>

    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="fixed w-full z-50">
        <HeaderSeller />
      </div>
      <h2 className="pt-20 text-xl font-bold text-center mb-4">
        🖨️ Print Shipping Slip
      </h2>

      <div
        ref={printRef}
        className="bg-white p-4 shadow border rounded max-w-md mx-auto"
      >
        <ShippingSlip order={order} item={item} seller={user} />
      </div>

      <div className="flex justify-center gap-4 mt-6">
        {!printError ? (
          <button
            onClick={handlePrint}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            🖨️ Confirm & Print
          </button>
        ) : (
          <div className="text-center">
            <p className="text-red-500 mb-2">Nothing to print. Retry loading.</p>
            <button
              onClick={handleRetry}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
             Refresh & Retry
            </button>
          </div>
        )}

        <button
          onClick={() => navigate('/seller/orders')}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
     </div>
  );
};

export default PrintShipment;
