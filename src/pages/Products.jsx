import { fetchProducts } from "../util/http";
import { useQuery } from "@tanstack/react-query";
import EditCard from "../components/EditCard";
import { ProgressSpinner } from "primereact/progressspinner";
import { useNavigate } from "react-router";

export default function Products() {
  const { data: products, isPending } = useQuery({
    queryKey: ["products"],
    queryFn: ({ signal }) => fetchProducts({ signal }),
  });

  const navigate = useNavigate()

  function handleClickAddProduct() {
    navigate('/addProduct')
  }


  return (
    <div className="mt-[10rem]">
      {isPending && (
        <div className="w-full h-full ">
          <ProgressSpinner className="custom-spinner" />
        </div>
      )}
      {!isPending && products && (
        <div>
          <header className="flex justify-end px-2 py-4">
            <button className="border-2 border-myGreen-dark text-myGreen-dark p-2 rounded-md poppins-semibold text-md flex gap-2 hover:bg-myGreen-dark hover:text-white" onClick={handleClickAddProduct}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <span>Add</span>
            </button>
          </header>
          <ul className="grid grid-cols-5">
            {products.map((product) => (
              <li key={product._id}>
                <EditCard data={product} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
