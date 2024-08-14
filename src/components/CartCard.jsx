import { Rating } from "primereact/rating";
import { useDispatch } from "react-redux";
import { addItemToCart, removeItemToCart, setCartData } from "../store/cart-slice";
import { useMutation } from "@tanstack/react-query";
import { updateCart } from "../util/http";
import { useSelector } from "react-redux";
export default function CartCard({ classes, item }) {
  const userId = useSelector(state => state.auth.currentUser._id)
  const { product, quantity } = item; 
  const dispatch = useDispatch()
  const cart = useSelector(state => state.cart.items)
  const totalPrice = useSelector(state => state.cart.total)


  function handleAddItem(product) {
    console.log("added Product-",product)
    let prvCartData = {
      items: cart.map((item) => ({ ...item })),
      total: totalPrice,
    };
    let isItemFound = false;
    for (let item of prvCartData.items) {
      if (item.product._id == product.product._id) {
        item.quantity += 1;
        prvCartData.total += product.product.finalPrice;
        isItemFound = true;
        break;
      }
    }
    if (!isItemFound) {
      prvCartData.items.push({
        product: product.product,
        quantity: 1,
      });
      prvCartData.total += product.product.finalPrice;
    }
    dispatch(setCartData(prvCartData));
    const updateCartDatabase = async () => {
      const data = JSON.stringify(prvCartData)
      const response = await updateCart(data);
    };
    updateCartDatabase();

  }

  function handleAddItemToCart(product) {
   handleAddItem(product)
  }

  function handleRemoveItem(product) {
    let prvCartData = {
      items: cart.map((item) => ({ ...item })),
      total: totalPrice,
    };
    console.log(product);

    for (let item of prvCartData.items) {
      if (item.product._id == product.product._id) {
        if(item.quantity == 1) {
          prvCartData.items = prvCartData.items.filter(allItem => allItem.product._id !== product.product._id)
          prvCartData.total -= product.product.finalPrice;

        }else{
          item.quantity -= 1
          prvCartData.total -= product.product.finalPrice;
        }
        break;
      }
    }

    dispatch(setCartData(prvCartData));
    const updateCartDatabase = async () => {
      const data = JSON.stringify(prvCartData)
      const response = await updateCart(data);
    };
    updateCartDatabase();

  }
  function handleRemoveItemToCart(product) {
    handleRemoveItem(product)
  }

  return (
    <div className={`${classes} p-2 rounded-md`}>
      <div className="flex gap-4">
        <div id="image" className="">
          <img
            src={`https://freshcart-api-4ftp.onrender.com/uploads/items/${product.image}`}
            alt={product.name}
            className="w-[8rem] h-[8rem] object-cover rounded-md"
            crossOrigin="anonymous"
          />
        </div>

        <div id="description" className="flex flex-col justify-center">
          <h2 className="poppins-bold mb-2">{product.name}</h2>
          <p className="text-myGreen-dark poppins-regular text-md">
          {product.discount ? (
            <>
              <s className="text-sm text-gray-500 poppins-regular">
                ${product.price.toFixed(2)}
              </s>{" "}
              <span className="text-md poppins-semibold text-red-500 ">
                ${(product.price -(product.price * product.discount) / 100).toFixed(2)}
                
              </span>
                
            </>
          ) : (
            <span>${product.price.toFixed(2)}</span> 
          )}
          <span className="text-sm poppins-regular text-gray-400 ml-1">{product.parameter}</span>
          <span className="ml-4 bg-myGreen-dark text-white text-sm p-1 rounded-md">{product.discount}% off</span>
          </p>

          <div className="flex gap-2 mb-4">
            <Rating value={product.averageRating} readOnly cancel={false} />
            <span className="poppins-regular text-sm">
              ({product.ratingsQuantity})
            </span>
          </div>
        </div>
      </div>

      <div id="controls" className="w-[32%] flex h-[2.5rem]">
        <button className="bg-myGreen-dark rounded-l-md px-4 py-1 hover:bg-green-700" onClick={() => handleAddItemToCart(item)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="white"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
        <span className="border-2 border-gray-300 w-14 text-center poppins-regular py-1">{quantity}</span>
        <button className="bg-orange-500 px-4 py-1 rounded-r-md hover:bg-orange-600" onClick={() => handleRemoveItemToCart(item)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="white"
            className="size-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  );
}
