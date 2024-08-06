import React, { useState } from "react";
import { AutoComplete } from "primereact/autocomplete";

export default function AutoCompleteInput({ products, category, className, selectedProduct, setSelectedProduct }) {

  const [filteredProducts, setFilteredProducts] = useState(null);
  let avbProducts = products;

  if (category !== "") {
    avbProducts = avbProducts.filter((prod) => prod.category == category);
  }
  const search = (event) => {
    // Timeout to emulate a network connection
    setTimeout(() => {
      let _filteredProducts;

      if (!event.query.trim().length) {
        _filteredProducts = [...avbProducts];
      } else {
        _filteredProducts = avbProducts.filter((products) => {
          return products.name
            .toLowerCase()
            .startsWith(event.query.toLowerCase());
        });
      }

      setFilteredProducts(_filteredProducts);
    }, 250);
  };

  return (
    <div className="card flex justify-content-center">
      <AutoComplete
        field="name"
        value={selectedProduct}
        suggestions={filteredProducts}
        completeMethod={search}
        onChange={(e) => setSelectedProduct(e.value)}
        className={className}
        placeholder={`Search ${category? category : 'Products'}`}
      />
    </div>
  );
}
