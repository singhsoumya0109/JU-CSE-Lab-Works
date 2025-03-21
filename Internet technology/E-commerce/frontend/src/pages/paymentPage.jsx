import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";

const Payment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const finalizePayment = async () => {
      const orderId = localStorage.getItem("orderId");

      if (!orderId) {
        setError("Order not found.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.post("/api/payment/checkout-success", {
          orderId,
        });
        console.log("Order finalized:", res.data);
        setTimeout(() => navigate("/order-history"), 2000);
      } catch (err) {
        setError(err.response?.data?.error || "Payment failed.");
      } finally {
        setLoading(false);
      }
    };

    finalizePayment();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {loading ? (
        <p className="text-xl font-semibold">Processing your payment...</p>
      ) : error ? (
        <p className="text-xl font-semibold text-red-500">{error}</p>
      ) : (
        <p className="text-xl font-semibold text-emerald-400">
          Payment Successful! Redirecting to your orders...
        </p>
      )}
    </div>
  );
};

export default Payment;
