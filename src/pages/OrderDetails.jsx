import { useNavigate, useParams } from "react-router";
import { getOrder } from "../util/http";
import { ProgressSpinner } from "primereact/progressspinner";
import { useQuery } from "@tanstack/react-query";
import Error from "../components/Error";

export default function OrderDetails() {
  const { id } = useParams();
  let {
    data: order,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: ({ signal }) => getOrder({ signal, id }),
  });
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };
  const navigate = useNavigate();

  return (
    <div className="mt-[12rem]">
      {isPending && (
        <div className="w-full flex">
            <ProgressSpinner className="custom-spinner " />
        </div>
      )
      }
      {!isPending && order && (
        <div className="w-1/2 mx-auto">
          <div className="flex justify-start my-4 " >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-8 hover:translate-x-[-4px] transition-all hover:text-myGreen-dark cursor-pointer"
              onClick={() => navigate('/orders')}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <div className="flex flex-col bg-white rounded-md pb-8 pt-4">
            <div className="flex justify-between poppins-regular text-sm text-gray-500 border-b-2 border-gray-300 px-8 items-center py-1">
              <span>{order.paymentDetails.paymentId}</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className="px-8 py-4">
              <ul className="">
                {order.productDetails.map((product) => (
                  <li className="flex justify-between border-b-2 border-gray-100 py-4">
                    <div className="flex gap-8">
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        crossOrigin="anonymous"
                        className="w-[8rem] h-[8rem] object-cover"
                      />
                      <h1 className="poppins-semibold text-lg">{product.name}</h1>
                    </div>
                    <div className="flex flex-col items-end poppins-regular">
                      <h3 className="font-semibold text-md text-myGreen-dark">$ {product.price}</h3>
                      <span className="text-sm text-gray-400">x{product.quantity}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between px-8 gap-8 poppins-regular">
              <h1 className="font-semibold text-md">Total Amount</h1>
              <h3 className="text-myGreen-dark font-semibold text-md">$ {order.totalAmount}</h3>
            </div>
          </div>
        </div>
      )}
      {isError && <div>
            <Error error="No Order Found" description="try again later" />
        </div>}

      <div className="h-[8rem]"></div>
    </div>
  );
}
