import React, { Component } from "react";
import useProductStore from "../stores/useProductStore";
import ProductGrid from "../components/ProductGrid";

export default class AllProducts extends Component {
  state = {
    products: [],
    loading: false,
    error: null,
    admin: null,
  };

  async componentDidMount() {
    const productStore = useProductStore;

    const admin = JSON.parse(localStorage.getItem("admin")) || null;
    this.setState({ admin });

    try {
      this.setState({ loading: true, error: null });
      await productStore.getState().fetchAllProducts();
      const products = productStore.getState().products;
      this.setState({ products, loading: false });
    } catch (err) {
      this.setState({
        error: "Failed to fetch products",
        loading: false,
      });
    }
  }

  render() {
    const { products, loading, error, admin } = this.state;

    return (
      <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
        <h2 className="text-2xl font-semibold mb-4">All Products</h2>
        {loading && <p className="text-gray-400">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}

        <ProductGrid products={products} admin={admin} />
      </div>
    );
  }
}
