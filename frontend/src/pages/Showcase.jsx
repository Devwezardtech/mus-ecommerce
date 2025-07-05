// Showcase.jsx
import React from "react";
import api from "../api/axios"; 


const Showcase = ({ showcase, refCode, onRemove }) => {
  const handleCopy = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold mb-2">My Showcase</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {showcase.map((p) => {
          const referralLink = `${window.location.origin}/product/public/${p._id}?ref=${refCode}`;
          const commissionAmount = (p.price * p.commission).toFixed(2);

          return (
            <div key={p._id} className="bg-white p-4 rounded shadow hover:shadow-md transition">
              <img
                src={p.photo}
                alt={p.name}
                className="h-40 w-full object-cover rounded mb-2"
              />
              <h4 className="font-bold text-gray-800">{p.name}</h4>
              <p className="text-sm text-gray-600">{p.description}</p>
              <p className="text-sm text-gray-700 font-semibold mt-1">₱{p.price}</p>
              <p className="text-sm text-blue-600 mt-1">
                Commission: ₱{commissionAmount} ({Math.round(p.commission * 100)}%)
              </p>
              <input
                className="mt-2 w-full px-2 py-1 border rounded text-sm"
                readOnly
                value={referralLink}
              />
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => handleCopy(referralLink)}
                  className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Share
                </button>
                <button
                  onClick={() => onRemove(p._id)}
                  className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Showcase;
