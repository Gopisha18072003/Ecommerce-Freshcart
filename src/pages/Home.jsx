import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchProducts, fetchCategoryCounts } from "../util/http";
import CircularCarousel from "../ui/CircularCarousel";
import { ProgressSpinner } from "primereact/progressspinner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addFilter, removeFilter } from "../store/ui-slice";
import image from '../assets/noProductFound.png';
import heroVideo from '../assets/fruits fresh.mp4';
import bestDeals from '../assets/video1.mp4';


export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState(null);
  const {modal} = useSelector(state => state.auth)
  function handleClickCategory(category) {
    setActiveCategory(category);
  }

  const {
    data: categoryCounts,
    isPending: isPendingCategoryCounts
  } = useQuery({
    queryKey: ["categoryCounts"],
    queryFn:  fetchCategoryCounts,
  });

  const [activeSection, setActiveSection] = useState("featured");
  function handleClickSection(section) {
    setActiveSection(section);
  }

  const {
    data: sampleProducts,
    isPending: isPendingSample,
    isError: isErrorSample,
    sampleError,
  } = useQuery({
    queryKey: ["products", activeSection],
    queryFn: ({ signal }) => fetchProducts({ signal, type: activeSection }),
  });
  
  const {
    data: bestSellerProducts,
    isPending: isPendingBestSeller,
    isError: isErrorBestSeller,
    bestSellerError,
  } = useQuery({
    queryKey: ["products", "bestSeller"],
    queryFn: ({ signal }) => fetchProducts({ signal, type: "bestSeller" }),
  });


  const {
    data: categoryProducts,
    isPending: isPendingCategoryProducts,
    isError: isErrorCategoryProducts,
  } = useQuery({
    queryKey: [activeCategory],
    queryFn: ({ signal }) => fetchProducts({ signal, filters: {'category': [activeCategory]} }),
  });

  const dispatch = useDispatch()
  const navigate = useNavigate()

  function handleShopNow(filter) {
    dispatch(removeFilter())
    dispatch(addFilter(filter))

    navigate('/shop')
  }

  return (
    <div className="flex flex-col gap-12 mt-[8rem]">
      {modal && (
        <div className={`fixed z-50 top-[9rem] left-[42%] ${modal.split(' ')[0] == 'Logout' || modal.split(' ')[0] == 'Deleted' ? 'bg-orange-400': 'bg-myGreen-dark'} p-4 poppins-semibold text-white rounded-md`}>
           {modal}            
        </div>
        )}
      <div className="flex justify-between gap-6 mt-[2rem]">
        <div className="flex h-[22rem] items-center bg-white px-3 mt-8 w-[80%] justify-between">
          <div className="">
            <span className="margarine-regular text-xl text-myGreen-dark">
              100% Organic Food provide
            </span>
            <h1 className="poppins-black text-4xl mt-4 mb-2">
              Natural & Organic <br /> Health Care{" "}
            </h1>
            <p className="poppins-medium w-[28rem] ">
              Assertively target market-driven intellectual capital with
              worldwide human capital holistic
            </p>
            <Link className="custom-button bg-myGreen-dark px-4 py-4 flex gap-4 poppins-bold text-white rounded-md mt-6 w-[10rem] shopNow" to='/shop' >
              Shop Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={4}
                stroke="currentColor"
                className="size-6 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
          <img
            src="/hero-bg.png"
            alt=""
            className="w-auto h-[20rem]  "
          />
        </div>

        <div className="myBg mt-8 flex-col pl-6 pt-12 text-start hidden xl:flex">
          <span className="text-red-600 lobster-regular mb-2">
            Black Friday Offer{" "}
          </span>
          <h3 className="poppins-semibold text-2xl text-white">
            Organic Foods Up
          </h3>
          <h3 className="poppins-semibold text-2xl text-white">To 50% off</h3>
          <button className="custom-button flex bg-orange-500 w-1/2 poppins-medium text-md text-white px-2 py-2 gap-2 rounded-md mt-6 items-center" onClick={() => handleShopNow({'isOrganic': true})}>
            Shop Now
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>
      </div>
      <video src={heroVideo} autoPlay loop muted></video>
      <div className="flex flex-col justify-center">
        <h1 className="text-center poppins-bold text-3xl">
          Browse All Categories
        </h1>
        <p className="text-center poppins-medium text-sm text-gray-600 mt-4">
          Sticky niche market with goal-oriented networks Completely
          recaptiuelize
        </p>
        <nav className="mt-12">
          <ul className="list-none flex justify-between gap-4">
            <li
              className={`px-4 py-8 w-1/6 rounded-md cursor-pointer hover:shadow-2xl  hover:shadow-orange-300 ${
                activeCategory == "vegetables"
                  ? "bg-orange-400 text-white shadow-2xl shadow-orange-300"
                  : "bg-white"
              } `}
              onClick={() => handleClickCategory("vegetables")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={24}
                height={24}
                color={`${
                  activeCategory === "vegetables" ? "#ffffff" : "#06D001"
                }`}
                fill={"none"}
                className={`size-16 ${
                  activeCategory === "vegetables"
                    ? "bg-orange-400 border-white "
                    : "bg-lime-100 border-myGreen-dark"
                } rounded-full border-2 border-dashed  p-2 mx-auto`}
              >
                <path
                  d="M4.05205 8.46154C1.87672 10.4706 3.25798 14 6.51566 14C8.14654 14 9.52414 13.0186 9.96671 11.6727M5.93747 10.3077C2.32316 8.8909 4.24626 4.36129 7.95209 4.79869C7.95209 3.26929 9.30506 2 10.974 2C12.643 2 13.996 3.02188 13.996 4.55129C14.5306 4.11279 15.2366 3.84615 16.0106 3.84615C17.6795 3.84615 19.0325 5.08598 19.0325 6.61538C19.0325 8.14479 17.6795 9.38462 16.0106 9.38462M18.8605 7.53846C22.3504 8.80845 21.3348 14 17.5215 14C15.5744 14 13.996 12.5041 13.996 10.6588C12.9886 12.1538 11.4777 12.6154 9.96671 11.6923"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 14C7.88632 14.4415 9.41287 16.5365 9.5 21C9.51288 21.66 11.2845 22 12 22C12.7155 22 14.4871 21.66 14.5 21C14.5871 16.5365 16.1137 14.4415 17 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <h3 className="text-center poppins-medium text-lg mb-1 mt-4">
                Vegetables
              </h3>
              <p className=" poppins-light text-sm flex items-center justify-center">
                <span
                  className={`h-2 w-2 block rounded-full ${
                    activeCategory === "vegetables"
                      ? "bg-white"
                      : "bg-orange-500"
                  } `}
                ></span>
                {!isPendingCategoryCounts && categoryCounts && <span className="px-1 font-semibold">{categoryCounts['vegetables']}</span>} items
              </p>
            </li>
            <li
              className={`px-4 py-8 w-1/6 rounded-md cursor-pointer hover:shadow-2xl  hover:shadow-orange-300 ${
                activeCategory == "drinks"
                  ? "bg-orange-400 text-white shadow-2xl shadow-orange-300"
                  : "bg-white"
              } `}
              onClick={() => handleClickCategory("drinks")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={24}
                height={24}
                color={`${activeCategory === "drinks" ? "#ffffff" : "#e60073"}`}
                fill={"none"}
                className={`size-16 ${
                  activeCategory === "drinks"
                    ? "bg-orange-400 border-white "
                    : "bg-pink-100 border-pink-600"
                } rounded-full border-2 border-dashed  p-2 mx-auto`}
              >
                <path
                  d="M18.2505 10.5H19.6403C21.4918 10.5 22.0421 10.7655 21.9975 12.0838C21.9237 14.2674 20.939 16.8047 17 17.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M5.94627 20.6145C2.57185 18.02 2.07468 14.3401 2.00143 10.5001C1.96979 8.8413 2.45126 8.5 4.65919 8.5H15.3408C17.5487 8.5 18.0302 8.8413 17.9986 10.5001C17.9253 14.3401 17.4281 18.02 14.0537 20.6145C13.0934 21.3528 12.2831 21.5 10.9194 21.5H9.08064C7.71686 21.5 6.90658 21.3528 5.94627 20.6145Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M11.3089 2.5C10.7622 2.83861 10.0012 4 10.0012 5.5M7.53971 4C7.53971 4 7 4.5 7 5.5M14.0012 4C13.7279 4.1693 13.5 5 13.5 5.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-center poppins-medium text-lg mb-1 mt-4">
                Coffee & Drinks
              </h3>
              <p className=" poppins-light text-sm flex items-center justify-center">
                <span
                  className={`h-2 w-2 block rounded-full ${
                    activeCategory === "drinks" ? "bg-white" : "bg-orange-500"
                  } `}
                ></span>
                {!isPendingCategoryCounts && categoryCounts && <span className="px-1 font-semibold">{categoryCounts['drinks'] || 0}</span>} items
              </p>
            </li>
            <li
              className={`px-4 py-8 w-1/6 rounded-md cursor-pointer hover:shadow-2xl  hover:shadow-orange-300 ${
                activeCategory == "dairy"
                  ? "bg-orange-400 text-white shadow-2xl shadow-orange-300"
                  : "bg-white"
              } `}
              onClick={() => handleClickCategory("dairy")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={24}
                height={24}
                color={`${activeCategory === "dairy" ? "#ffffff" : "#0033cc"}`}
                fill={"none"}
                className={`size-16 ${
                  activeCategory === "dairy"
                    ? "bg-orange-400 border-white "
                    : "bg-blue-100 border-blue-600"
                } rounded-full border-2 border-dashed  p-2 mx-auto`}
              >
                <path
                  d="M14.7273 5C15.631 5 16.3636 4.32843 16.3636 3.5C16.3636 2.67157 15.631 2 14.7273 2H9.27273C8.36899 2 7.63636 2.67157 7.63636 3.5C7.63636 4.32843 8.36899 5 9.27273 5M15.2459 4.92311C16.8664 7.89408 18 10.3773 18 13.7771V18C18 21.3093 17.2465 22 13.6364 22H10.3636C6.75345 22 6 21.3093 6 18V13.7771C6 10.3773 7.10674 7.88562 8.72727 4.91465"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 12C6.57143 12.5 8.09206 12.4761 8.98433 12.2789C9.60646 12.1415 10.2768 12.3027 10.6984 12.7639L11.523 13.6658C11.9973 14.1846 12.7163 14.4309 13.4245 14.3173L14.4681 14.1499C15.0422 14.0578 15.6132 14.2904 16.004 14.7055C17.2226 16 18 16 18 16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-center poppins-medium text-lg mb-1 mt-4">
                Milk & Dairy
              </h3>
              <p className=" poppins-light text-sm flex items-center justify-center">
                <span
                  className={`h-2 w-2 block rounded-full ${
                    activeCategory === "dairy" ? "bg-white" : "bg-orange-500"
                  } `}
                ></span>
                {!isPendingCategoryCounts && categoryCounts && <span className="px-1 font-semibold">{categoryCounts['dairy']}</span>} items
              </p>
            </li>
            <li
              className={`px-4 py-8 w-1/6 rounded-md cursor-pointer hover:shadow-2xl  hover:shadow-orange-300 ${
                activeCategory == "meat"
                  ? "bg-orange-400 text-white shadow-2xl shadow-orange-300"
                  : "bg-white"
              } `}
              onClick={() => handleClickCategory("meats")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={24}
                height={24}
                color={`${activeCategory === "meat" ? "#ffffff" : "#ff9933"}`}
                fill={"none"}
                className={`size-16 ${
                  activeCategory === "meat"
                    ? "bg-orange-400 border-white "
                    : "bg-orange-100 border-orange-500"
                } rounded-full border-2 border-dashed  p-2 mx-auto`}
              >
                <path
                  d="M10 15.8446L6.68575 19.1589C7.45757 19.7089 7.56154 20.8655 6.88551 21.5416C6.27426 22.1528 5.28323 22.1528 4.67198 21.5416C4.19008 21.0597 4.02512 20.2787 4.30305 19.6969C3.72125 19.9749 2.94033 19.8099 2.45844 19.328C1.84719 18.7168 1.84719 17.7257 2.45844 17.1145C3.13447 16.4385 4.29108 16.5424 4.84114 17.3142L8.15538 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.5368 3.68189C14.8712 1.34751 18.1694 1.53315 20.3181 3.68189C22.033 5.39675 22.4975 7.8437 21.4285 9.94858C19.6533 7.59535 15.6579 9.39829 16.4055 12.3559C14.7572 11.6697 13.3426 13.7886 14.478 15.0632C12.0982 16.0318 9.73049 16.4381 8.64618 15.3538C6.49743 13.2051 10.2024 6.01628 12.5368 3.68189Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-center poppins-medium text-lg mb-1 mt-4">
                Meat
              </h3>
              <p className=" poppins-light text-sm flex items-center justify-center">
                <span
                  className={`h-2 w-2 block rounded-full ${
                    activeCategory === "meat" ? "bg-white" : "bg-orange-500"
                  } `}
                ></span>
                {!isPendingCategoryCounts && categoryCounts && <span className="px-1 font-semibold">{categoryCounts['meats']}</span>} items
              </p>
            </li>
            <li
              className={`px-4 py-8 w-1/6 rounded-md cursor-pointer hover:shadow-2xl  hover:shadow-orange-300 ${
                activeCategory == "fruits"
                  ? "bg-orange-400 text-white shadow-2xl shadow-orange-300"
                  : "bg-white"
              } `}
              onClick={() => handleClickCategory("fruits")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={24}
                height={24}
                color={`${activeCategory === "fruits" ? "#ffffff" : "#ff66cc"}`}
                fill={"none"}
                className={`size-16 ${
                  activeCategory === "fruits"
                    ? "bg-orange-400 border-white "
                    : " bg-pink-100 border-[#ff66cc]"
                } rounded-full border-2 border-dashed  p-2 mx-auto`}
              >
                100
                <path
                  d="M8 5C5.23858 5 3 8.0139 3 11.0278C3 14.544 3.5 17.0556 5.5 20.0695C7.02044 22.1062 9.05026 22.6168 11.2139 21.1903C11.6757 20.8859 12.3243 20.8859 12.7861 21.1903C14.9497 22.6168 16.9796 22.1062 18.5 20.0695C20.5 17.0556 21 14.544 21 11.0278C21 8.0139 18.7614 5 16 5C14.5746 5 13.2885 5.7849 12.3777 6.63254C12.166 6.82949 11.834 6.82949 11.6223 6.63254C10.7115 5.7849 9.42542 5 8 5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 12C6 10.3665 6.82273 8.73298 8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 6C12 4.66667 12.6 2 15 2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-center poppins-medium text-lg mb-1 mt-4">
                Fresh Fruits
              </h3>
              <p className=" poppins-light text-sm flex items-center justify-center">
                <span
                  className={`h-2 w-2 block rounded-full ${
                    activeCategory === "fruits" ? "bg-white" : "bg-orange-500"
                  } `}
                ></span>
                {!isPendingCategoryCounts && categoryCounts && <span className="px-1 font-semibold">{categoryCounts['fruits']}</span>} items
              </p>
            </li>
            <li
              className={`px-4 py-8 w-1/6 rounded-md cursor-pointer hover:shadow-2xl  hover:shadow-orange-300 ${
                activeCategory == "cleaning"
                  ? "bg-orange-400 text-white shadow-2xl shadow-orange-300"
                  : "bg-white"
              } `}
              onClick={() => handleClickCategory("cleaning")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={24}
                height={24}
                color={`${
                  activeCategory === "cleaning" ? "#ffffff" : "#1a53ff"
                }`}
                fill={"none"}
                className={`size-16 ${
                  activeCategory === "cleaning"
                    ? "bg-orange-400 border-white "
                    : " bg-[#e6e6ff] border-[#1a53ff]"
                } rounded-full border-2 border-dashed  p-2 mx-auto`}
              >
                <path
                  d="M21 3L13 11.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.44573 11.0854C6.96539 12.0368 4.98269 11.8736 3 11.0885C3.50059 17.531 6.50414 20.0089 10.5089 21C10.5089 21 13.5261 18.8664 13.961 13.8074C14.0081 13.2595 14.0317 12.9856 13.9178 12.6769C13.8038 12.3682 13.5802 12.1468 13.1329 11.704C12.3973 10.9757 12.0295 10.6116 11.5929 10.5204C11.1564 10.4293 10.5862 10.648 9.44573 11.0854Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.5 16.4464C4.5 16.4464 7 16.9286 9.5 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 7.25C8.5 7.94036 7.94036 8.5 7.25 8.5C6.55964 8.5 6 7.94036 6 7.25C6 6.55964 6.55964 6 7.25 6C7.94036 6 8.5 6.55964 8.5 7.25Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M11 4V4.1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-center poppins-medium text-lg mb-1 mt-4">
                Cleaning Essentials
              </h3>
              <p className=" poppins-light text-sm flex items-center justify-center">
                <span
                  className={`h-2 w-2 block rounded-full ${
                    activeCategory === "cleaning" ? "bg-white" : "bg-orange-500"
                  } `}
                ></span>
               {!isPendingCategoryCounts && categoryCounts && <span className="px-1 font-semibold">{categoryCounts['cleanings'] || 0}</span>} items
              </p>
            </li>
          </ul>
        </nav>
        <div>
          {
            isPendingCategoryProducts && (
              <div className="h-[24rem] w-full flex justify-center items-center">
            <ProgressSpinner
              style={{ width: "50px", height: "50px" }}
              strokeWidth="8"
              fill="white"
              animationDuration=".5s"
              className="custom-spinner"
            />
          </div>
            )
          }
          {
            !isPendingCategoryProducts && categoryProducts.length == 0 && activeCategory && (
              <div className="w-full bg-white mt-8 flex flex-col justify-center items-center">
                <img src='/noProductFound.png' className="h-[24rem] w-[32rem]"/>
                <p className="py-4 poppins-bold text-xl">No products found</p>
              </div>
            )
          }
          {
            !isPendingCategoryProducts && categoryProducts.length >0 && (
              <div>
                <CircularCarousel avbProducts={categoryProducts} />
              </div>
            )
          }
        </div>
      </div>

      <div className="flex">
        <div className="w-[30%] section1 flex flex-col gap-4 p-8">
          <p className="lobster-regular text-myGreen-dark">Enjoy up to 20%</p>
          <h3 className="poppins-bold text-2xl">Fresh Vegetables</h3>
          <button className="custom-button flex gap-1 bg-myGreen-dark w-[7rem] text-white poppins-semibold items-center p-2 rounded-md text-sm justify-center" onClick={() => handleShopNow({'category': ['vegetables']})}>
            Shop Now
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={4}
              stroke="currentColor"
              className="size-4 font-bold"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>

        <div className="w-[70%] flex h-[20rem] overflow-hidden">
          <section className="w-[80%] solid-background pl-12 flex flex-col gap-6 justify-center">
            <p className="lobster-regular text-orange-500 text-lg">
              Enjoy up to 20% all Products
            </p>
            <h2 className="text-white poppins-bold text-2xl ">
              All Tasted Organic <br />& Fresh Product
            </h2>
            <p className="text-gray-400 poppins-regular text-sm">
              Progressive models functionalized supply chains
            </p>
            <button className="custom-button text-white bg-orange-500 rounded-md flex gap-2 poppins-semibold text-sm p-3 w-[8rem] items-center" onClick={() => handleShopNow({})}>
              Shop Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={4}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </button>
          </section>

          <section className=" w-[40%] image-background"></section>
        </div>
      </div>

      <div className="mb-12">
        <nav>
          <ul className="flex justify-center gap-12 poppins-regular border-b-4 border-gray-200 pb-2">
            <li
              className={`relative cursor-pointer ${
                activeSection === "featured" ? "font-bold" : ""
              }`}
              onClick={() => handleClickSection("featured")}
            >
              Featured{" "}
              {activeSection === "featured" && (
                <span className="w-full absolute h-1 bg-myGreen-dark left-0 bottom-[-12px]"></span>
              )}
            </li>
            <li
              className={`relative cursor-pointer ${
                activeSection === "bestSeller" ? "font-bold " : ""
              }`}
              onClick={() => handleClickSection("bestSeller")}
            >
              Best Seller{" "}
              {activeSection === "bestSeller" && (
                <span className="w-full absolute h-1 bg-myGreen-dark left-0 bottom-[-12px]"></span>
              )}
            </li>
            <li
              className={`relative cursor-pointer ${
                activeSection === "popular" ? "font-bold " : ""
              }`}
              onClick={() => handleClickSection("popular")}
            >
              Popular{" "}
              {activeSection === "popular" && (
                <span className="w-full absolute h-1 bg-myGreen-dark left-0 bottom-[-12px]"></span>
              )}
            </li>
          </ul>
        </nav>
        {isPendingSample
          && (
            <div className="flex justify-center items-center h-[20rem]">
              <ProgressSpinner
                style={{ width: "50px", height: "50px" }}
                strokeWidth="8"
                fill="white"
                animationDuration=".5s"
                className="custom-spinner"
              />
            </div>
          )}

        {!isPendingSample && <CircularCarousel avbProducts={sampleProducts} />}
      </div>

      <div className="w-[100%] flex h-[40rem] relative overflow-hidden">
        {/* <section className=" w-[30%] image-background2"></section>
        <section className="w-[70%] solid-background2 pl-12 flex flex-col gap-6 justify-center items-center">
          <h2 className="text-white poppins-bold text-2xl ">
            Best Deals<span className="text-orange-500 poppins-semibold border-b-2 border-orange-500"> This Week</span>
          </h2>
          <p className="text-gray-400 poppins-regular text-sm w-[40rem] text-center ">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius sapiente explicabo quod tenetur eveniet quaerat?
          </p>

        </section>
        <div className="absolute right-[-14rem] top-[-2rem] z-10 rounded-full w-[30rem] h-[30rem] overflow-hidden" id='circle'>
        </div> */}
        <video src={bestDeals} autoPlay loop muted className="w-full h-full object-cover"></video>
      </div>

      <div className="flex relative justify-center h-[20rem]  mb-[5em]">
      <div className="w-[80%] absolute top-[-10rem] z-10">
          {!isPendingBestSeller && bestSellerProducts && (
            <CircularCarousel avbProducts={bestSellerProducts} max={4}/>
          )}
        </div>
      </div>
    </div>
  );
}


