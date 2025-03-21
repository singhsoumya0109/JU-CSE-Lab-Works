import React, { Component } from "react";
import axios from "../lib/axios";

export default class OrderPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      loading: true,
      error: null,
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get("/orders");
      this.setState({ orders: response.data, loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  }

  render() {
    const { orders, loading, error } = this.state;

    if (loading)
      return (
        <p className="text-center text-gray-600 mt-10">Loading orders...</p>
      );
    if (error)
      return <p className="text-center text-red-500 mt-10">Error: {error}</p>;

    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold text-blue-1000 mb-6 text-center">
          Your Orders
        </h2>
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
              >
                <div className="mb-4">
                  <p className="text-gray-600">
                    <strong>Total Amount:</strong>{" "}
                    <span className="text-green-600">₹{order.totalAmount}</span>
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    <strong>Ordered On:</strong>{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium text-gray-700">
                    Products Ordered:
                  </h3>
                  <ul className="mt-2 space-y-4">
                    {order.products.map((productItem, index) => {
                      const product = productItem.product || {};
                      return (
                        <li
                          key={index}
                          className="flex items-center space-x-4 border-b pb-3"
                        >
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-md border"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                              ❌
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-gray-800 font-medium">
                              {product.name || "Product"}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {product.description ||
                                "No description available"}
                            </p>
                            <p className="text-gray-600 text-sm">
                              <strong>Quantity:</strong> {productItem.quantity}
                            </p>
                          </div>
                          <p className="text-gray-800 font-medium">
                            ₹{productItem.price}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="mt-4">
                  <p className="text-gray-600 text-sm">
                    <strong>Status:</strong>{" "}
                    <span className="text-blue-600">
                      {order.status || "Pending"}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
