import { useRef, useState } from "react";
import Input from "../components/Input";
import { categories } from "../App";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { addProduct } from "../util/http";
import { ProgressSpinner } from "primereact/progressspinner";
export default function AddProduct() {

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("/dummyImage.jpg");
  const [isAdded, setIsAdded] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false);
  const navigate = useNavigate()

  const {mutate, isPending: isAdding} = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
        setIsAdded(true);
        setTimeout(() => navigate('/products'), 2000)
    }
  })

  function handleSubmitForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append('image', image);
    formData.append('isFeatured', isFeatured);
    mutate(formData)
  }


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);

    // Generate a preview of the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleFeaturedChange = (event) => {
    setIsFeatured(event.target.checked);
  };
  const filePickerRef = useRef()
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="mt-[12rem]">
        <h1 className="poppins-bold text-2xl my-8 text-center">Add Product</h1>
        <div className="w-[12rem] mx-auto ">
          <img
            src={imagePreview}
            alt="photo"
            crossOrigin="anonymous"
            className="w-[12rem] h-[12rem] relative object-cover border-4 border-gray-300 rounded-md"
          />
          <input
            type="file"
            name="image"
            ref={filePickerRef}
            onChange={handleImageChange}
            accept=".jpg,.png,.jpeg"
            style={{ display: "none" }}
          />
          <button onClick={pickImageHandler} className="p-2 poppins-semibold rounded-md text-white bg-myGreen-dark my-2 mx-auto block">Pick Image</button>
        </div>
      <form
        action=""
        className="w-1/2 mx-auto flex flex-col gap-4 bg-white p-8 rounded-lg"
        onSubmit={handleSubmitForm}
      >
        
        <div className="">
          <Input
            label="Name"
            type="text"
            id="name"
            name="name"
            required={true}
          />
        </div>
        <div className="">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="category"
              className="poppins-semibold text-gray-700"
            >
              Category
            </label>
            <div className="border-2 rounded-md border-gray-300 flex items-center pr-2">
              <select
                name="category"
                id="category"
                required
                className={`poppins-regular p-2 border-none rounded-md w-[90%] outline-none`}
                defaultValue="fruits"
              >
                {
                    categories.map((category) => (
                        <option value={category.value} key={category.value}>{category.name}</option>
                    ))
                }
              </select>
            </div>
          </div>
        </div>

        <div className="">
          <div className="flex flex-col gap-1 ">
            <label
              htmlFor="description"
              className="poppins-semibold text-gray-700"
            >
              Description
            </label>
            <div className="border-2 rounded-md border-gray-300 flex items-center pr-2">
              <textarea
                id="description"
                name="description"
                required={true}
                className={`poppins-regular p-2 border-none rounded-md w-[100%] outline-none resize-none`}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="">
          <Input
            label="Price"
            type="Decimal"
            id="price"
            name="price"
            required={true}
          />
        </div>
        <div className="">
          <Input
            label="Quantity"
            type="Number"
            id="Quantity"
            name="quantity"
            required={true}
            />
            <Input
            label="Parameter"
            type="text"
            id="parameter"
            name="parameter"
            required={true}
            placeholder="eg. /kg, /lt, /dz"
          />
        </div>
        <div className="">
          <Input
            label="Discount"
            type="Number"
            id="discount"
            name="discount"
            required={true}
          />
        </div>
        <div className="flex gap-5">
          <label
            htmlFor="isFeatured"
            className="poppins-semibold text-gray-700"
          >
            Featured
          </label>
          <input
            type="checkbox"
            id="isFeatured"
            name="isFeatured"
            className="w-6 h-6"
            checked={isFeatured}
            onChange={handleFeaturedChange}
          />
        </div>
        <div className="flex justify-center gap-12">
          <button
            className="p-3 bg-myGreen-dark text-white poppins-semibold rounded-md text-lg"
          >
            {isAdding && (
              <ProgressSpinner
                className=" size-5 stroke-white px-8"
                strokeWidth="8"
              />
            )}
            {!isAdding && isAdded && (
              <div className="flex justify-center items-center">
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
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <span>Added</span>
              </div>
            )}
            {!isAdding && !isAdded && <span>Add</span>}
          </button>
        </div>
      </form>
      <div className="h-[8rem]">

      </div>
    </div>
  );
}
