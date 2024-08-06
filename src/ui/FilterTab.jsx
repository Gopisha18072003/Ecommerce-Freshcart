import { categories } from "../App";
import { Checkbox } from "primereact/checkbox";
import { Slider } from "primereact/slider";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFilter, removeFilter } from "../store/ui-slice";
export default function FilterTab() {
  const filters = useSelector(state => state.ui.filters)
  const dispatch = useDispatch()
  const [maxPrice, setMaxPrice] = useState(filters['price'] || 50);
  const [selectedCategories, setSelectedCategories] = useState(filters['category'] || []);
  const [inStock, setInStock] = useState(filters['quantity'] == 0);
  const [selectedRating, setSelectedRating] = useState(filters['averageRating'] || 1);
  const [isOrganic, setIsOrganic] = useState(filters['isOrganic'] || false)

  const onCategoryChange = (e) => {
    const { checked, value } = e.target;
    let _selectedCategories = [...selectedCategories];

    if (checked) {
      _selectedCategories.push(value);
    } else
      _selectedCategories = _selectedCategories.filter(
        (category) => category !== value
      );

    setSelectedCategories(_selectedCategories);
  };

  function onChangeRating(e) {
    const rating = e.target.value;
    setSelectedRating(rating);
  }

  function handleApplyFilter() {
    const filters = {'price': maxPrice}
    if(selectedCategories.length > 0) {
      filters['category'] = selectedCategories
    }
    if(inStock) {
      filters['quantity'] = 0
    }
    if(selectedRating !== 1) {
      filters['averageRating'] = selectedRating
    }
    if(isOrganic) {
      filters['isOrganic'] = true
    }

    dispatch(addFilter(filters))

  }

  function handleResetFilter() {
    setMaxPrice(50);
    setSelectedCategories([]);
    setInStock(false);
    setSelectedRating(1);
    setIsOrganic(false)
    dispatch(removeFilter())

  }

  return (
    <div className="p-4 flex gap-4 flex-col justify-between">
      <h1 className="poppins-semibold text-lg uppercase">Filters</h1>
      <div className=" aside px-2 flex flex-col gap-4 overflow-y-scroll h-[28rem] bg-green-50">
        <div className="mt-2">
          <h3 className="poppins-semibold text-myGreen-dark text-[1rem] py-1 mb-1">
            Category
          </h3>
          {categories.map((category) => {
            return (
              <div
                key={category.name}
                className="flex align-items-center poppins-regular text-sm"
              >
                <div className="flex flex-row">
                  <input
                    className="custom-checkbox"
                    type="checkbox"
                    id={category.name}
                    name="category"
                    value={category.value}
                    onChange={onCategoryChange}
                    checked={ selectedCategories.some(
                      (item) => item == category.value
                    )}
                  />
                  <label
                    htmlFor={category.name}
                    className="ml-2 custom-label poppins-regular"
                  >
                    {category.name}
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        <div className="">
          <h3 className="poppins-semibold text-[1rem] py-1 text-myGreen-dark mb-1">
            Maximum Price
          </h3>
          <div className="card flex justify-content-center">
            <div className="w-14rem poppins-regular">
              $
              <InputText
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className=" border-2 border-gray w-[30%] rounded-md mb-2 poppins-regular"
              />
              <Slider
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="poppins-semibold text-myGreen-dark text-[1rem] py-1 mb-1">
            Rating
          </h3>
          <div className="flex flex-row poppins-regular text-sm">
            <input
              type="checkbox"
              id="rating 1"
              name="rating"
              value={1}
              onChange={onChangeRating}
              checked={selectedRating == 1}
              className="custom-checkbox"
            />
            <label htmlFor="rating 1" className="custom-label flex flex-row">
              <div className="flex flex-row items-center">
                1{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="yellow"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="yellow"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
                & above
              </div>
            </label>
          </div>
          <div className="flex flex-row poppins-regular text-sm">
            <input
              className="custom-checkbox"
              type="checkbox"
              id="rating 2"
              name="rating"
              value={2}
              onChange={onChangeRating}
              checked={selectedRating == 2}
            />
            <label htmlFor="rating 2" className="custom-label flex flex-row">
              <div className="flex flex-row">
                2{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="yellow"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="yellow"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
                & above
              </div>
            </label>
          </div>
          <div className="flex flex-row poppins-regular text-sm">
            <input
              className="custom-checkbox"
              type="checkbox"
              id="rating 3"
              name="rating"
              value={3}
              onChange={onChangeRating}
              checked={selectedRating == 3}
            />
            <label htmlFor="rating 3" className="custom-label flex flex-row">
              <div className="flex flex-row">
                3{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="yellow"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="yellow"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
                & above
              </div>
            </label>
          </div>
          <div className="flex flex-row poppins-regular text-sm">
            <input
              className="custom-checkbox"
              type="checkbox"
              id="rating 4"
              name="rating"
              value={4}
              onChange={onChangeRating}
              checked={selectedRating == 4}
            />
            <label htmlFor="rating 4" className="custom-label flex flex-row">
              <div className="flex flex-row">
                4{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="yellow"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="yellow"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
                & above
              </div>
            </label>
          </div>
        </div>

        <div className="flex flex-row justify-start poppins-regular">
          <input
            className="custom-checkbox"
            type="checkbox"
            id="inStock"
            name="inStock"
            value={inStock}
            onChange={() => setInStock((prv) => !prv)}
            checked={inStock}
          />
          <label htmlFor="inStock" className="ml-2 custom-label">
            In Stock
          </label>
        </div>

        <div className="flex flex-row justify-start poppins-regular">
          <input
            className="custom-checkbox"
            type="checkbox"
            id="isOrganic"
            name="isOrganic"
            value={isOrganic}
            onChange={() => setIsOrganic((prv) => !prv)}
            checked={isOrganic}
          />
          <label htmlFor="isOrganic" className="ml-2 custom-label ">
            Organic
          </label>
        </div>

      </div>
      <div className="flex justify-between">
        <button onClick={handleApplyFilter} className="p-2 poppins-semibold bg-myGreen-dark hover:bg-green-700 text-white rounded-md">Apply</button>
        <button onClick={handleResetFilter} className="p-2 poppins-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-md">Reset</button>
      </div>
    </div>
  );
}
