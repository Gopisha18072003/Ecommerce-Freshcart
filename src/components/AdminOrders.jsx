export default function AdminOrders() {
  const [date, setDate] = useState(null);
  let {
    data: orders,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["orders", date],
    queryFn: ({ signal }) => getOrders({ signal, date }),
  });
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };

  const formatOrderDates = (orders) => {
    return orders.map((order) => ({
      ...order,
      createdAt: formatDate(order.createdAt),
    }));
  };
  let formattedOrders = null;

  if (orders?.length) {
    formattedOrders = formatOrderDates(orders);
  }
  const navigate = useNavigate();

  function handleChangeDate(event) {
    setDate(event.target.value);
  }

  function handleOrderDetails(id) {
    navigate(`/order/${id}`);
  }

  return (
    <div>
      {isPending && <ProgressSpinner className="custom-spinner" />}
      {!isPending && (
        <div className="p-8 bg-white rounded-lg w-full overflow-auto poppins-regular h-[32rem]">
          <div className="flex justify-between mb-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-8 cursor-pointer hover:text-myGreen-dark hover:translate-x-[-4px] transition-all"
              onClick={() => navigate("/me")}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <div className="flex gap-4 items-center ">
              <label htmlFor="date" className="font-bold text-gray-500">
                Select Date
              </label>
              <input
                type="date"
                className="outline-none border-2 border-gray-400 rounded-md px-2 focus:border-black"
                onChange={handleChangeDate}
                value={date}
              />
            </div>
          </div>
          {orders?.length > 0 && (
            <table className="card">
              <thead>
                <tr>
                  <th>Payment Id</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Mode</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {formattedOrders.map((order) => (
                  <tr key={order._id} className="">
                    <td>{order.paymentDetails.paymentId}</td>
                    <td>{order.createdAt}</td>
                    <td>{order.email}</td>
                    <td>{order.paymentDetails.payment_method_types[0]}</td>
                    <td>{order.totalAmount}</td>
                    <td
                      className={`${
                        order.paymentDetails.payment_status == "paid"
                          ? "text-myGreen-dark font-semibold"
                          : ""
                      }`}
                    >
                      {order.paymentDetails.payment_status}
                    </td>
                    <td>
                      <button
                        className="hover:text-myGreen-dark"
                        onClick={() => handleOrderDetails(order._id)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="text-center">
            {orders?.length == 0 && (
              <div>
                <h1>No Records Found</h1>
              </div>
            )}
          </div>
        </div>
      )}
      {isError && (
        <div>
          <Error error="Something went wrong" description="try again later" />
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ProductService } from './service/ProductService';
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../util/http";
import { useNavigate } from "react-router";
import { ProgressSpinner } from "primereact/progressspinner";
import Error from "./Error";
