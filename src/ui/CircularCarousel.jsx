import React, { useState, useEffect } from "react";
import { Carousel } from "primereact/carousel";
import Card from "./Card";


export default function CircularCarousel({ avbProducts, max }) {
  const [products, setProducts] = useState(avbProducts);

  const responsiveOptions = [
    

    {
      breakpoint: "2000px",
      numVisible:8,
      numScroll: 1,
    },
    {
      breakpoint: "1800px",
      numVisible:6,
      numScroll: 1,
    },
    {
      breakpoint: "1400px",
      numVisible:5,
      numScroll: 1,
    },
    {
      breakpoint: "1199px",
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: "767px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
      numScroll: 1,
    },
  ];


  const productTemplate = (product) => {
    return (
      <Card data={product}/>
    );
  };

  return (
    <div className="card">
      <Carousel
        value={products}
        responsiveOptions={responsiveOptions}
        className=" mt-12"
        circular
        autoplayInterval={3000}
        itemTemplate={productTemplate}
      />
    </div>
  );
}
