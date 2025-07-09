import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

const ShippingSlip = ({ order, item, seller }) => {
  const barcodeRef = useRef();

 useEffect(() => {
  if (barcodeRef.current && order?._id && item?.productId?.name) {
    const shortBarcodeData = `ID${order._id.slice(-6)}|${item.quantity}|${Math.round(item.price)}|${order.paymentMethod}`;

    JsBarcode(barcodeRef.current, shortBarcodeData, {
      format: 'CODE128',
      lineColor: '#000',
      width: 1,
      height: 50,
      displayValue: true,
      fontSize: 14,
      text: `${order._id}`
    });
  }
}, [order]);


  if (!order || !item || !item.productId) {
    return <p className="text-red-500">Missing order or product data.</p>;
  }

  const jntShippinggFee = 120; // Example shipping fee, can be dynamic based on order

  return (
    <div className="border border-gray-400 rounded p-6 text-gray-800 font-sans max-w-md mx-auto bg-white shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        
        <div>
          <p className="text-xs text-gray-500">Your Trusted Online Seller</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Order #: {order._id.slice(-6)}</p>
          <p className="text-sm text-gray-600">
            Date: {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="mb-4">
        <h3 className="font-semibold mb-1 text-gray-700">Ship To:</h3>
        <div className="text-sm">
          <p><strong>Name:</strong> {order.userId?.name}</p>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
        </div>
      </div>

      {/* Product Info */}
      <div className="mb-4 border-t pt-3 border-dashed">
        <h3 className="font-semibold mb-1 text-gray-700">Product Details:</h3>
        <div className="text-sm">
          <p><strong>Name o Product:</strong> {item.productId?.name}</p>
          <p><strong>Qty:</strong> {item.quantity}</p>
          <p><strong>Unit Price:</strong> ₱{Number(item?.price || 0).toFixed(2)}</p>
          <p > <strong>
            Subtotal:</strong> ₱{(Number(item?.price || 0) * Number(item?.quantity || 0)).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Payment & Seller */}
      <div className="mb-4 text-sm">
        <p><strong>Payment:</strong> {order.paymentMethod}</p>
        <p><strong>Shipping Fee:</strong> ₱{jntShippinggFee.toFixed(2)}</p>
        <p><strong>Total Amount: ₱{(Number(item?.price || 0)  * Number(item?.quantity || 0) + Number(jntShippinggFee)).toFixed(2)}</strong> </p>
        <p><strong>Seller Email:</strong> {seller?.email || 'seller@example.com'}</p>
        <p><strong>Tracking #:</strong> _______________________</p>
      </div>

      {/* Barcode */}
      <div className="flex justify-center mt-4">
        <svg ref={barcodeRef} />
      </div>

      {/* Footer */}
      <p className="text-xs text-center mt-4 italic text-gray-500">
        Handle with care. Contact customer support if any issue arises.
      </p>
    </div>
  );
};

export default ShippingSlip;
