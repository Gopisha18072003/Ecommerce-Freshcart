import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import { QueryClientProvider } from "@tanstack/react-query";
import { querClient } from "./util/http";
import ProtectedRoute from "./util/authentication.jsx";
import { loader as rootLoader } from "./pages/Root";



import RootLayout from "./pages/Root";
import ErrorPage from "./pages/Error";
import HomePage from "./pages/Home";
import ShopPage from "./pages/Shop";

import { Provider } from "react-redux";
import store from "./store/store.js";
import Signin from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx";

import { action as signupAction } from "./pages/Signup.jsx";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./store/store.js";
import Profile from "./pages/Profile.jsx";
import Cart from "./pages/Cart.jsx";
import Product from "./pages/Product.jsx";
import Success from "./pages/Success.jsx";
import Cancel from "./pages/Cancel.jsx";
import Support from "./pages/Support.jsx";
import Products from "./pages/Products.jsx";
import EditProduct from "./pages/EditProduct.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import Orders from "./pages/AllOrders.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";



function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      loader: rootLoader,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <HomePage />},
        { path: "shop", element: <ShopPage /> },
        {
          path: "cart",
          element: (
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          ),
        },
        {
          path: "success",
          element: (
              <Success />
          ),
        },
        {
          path: "cancel",
          element: (
              <Cancel/>
          ),
        },
        {
          path: "support",
          element: <Support />

        },
        {
          path: "products",
          element: <Products />,

        },
        {
          path: "orders",
          element: <Orders />
        },
        {
          path: "order/:id",
          element: <OrderDetails />
        },
        {
          path: "edit-product/:id",
          element: <EditProduct />

        },
        {
          path: "me",
          element: (
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
          ),
        },        
        
        {
          path: "addProduct",
          element: (
            <ProtectedRoute>
              <AddProduct/>
            </ProtectedRoute>
          ),
        },
        {
          path: 'product/:productId',
          element: <Product />,
          errorElement: <ErrorPage text="No Product Found" />
        }
      ],
    },
    {
      path: "/login",
      element: <Signin />,
    },
    {
      path: "/signup",
      element: <Signup />,
      action: signupAction,
    },
    {
      path: "/forgotPassword",
      element: (
          <ForgotPassword/>

      ),
    },        
    {
      path: "/resetPassword/:token",
      element: (
          <ResetPassword/>
      ),
    },
    
  ]);
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <PrimeReactProvider >
          <QueryClientProvider client={querClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </PrimeReactProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
export const categories = [
  { name: "Fruits", value: "fruits", icon: "/icons/fruit.png" },
  { name: "Vegetables", value: "vegetables", icon: "/icons/vegetable.png" },
  { name: "Meats", value: "meats", icon: "/icons/barbecue.png" },
  { name: "Seafoods", value: "packed seafoods", icon: "/icons/seafood.png" },
  { name: "Dairy", value: "dairy", icon: "/icons/dairy.png" },
  { name: "Groceries", value: "grocery", icon: "/icons/grocery.png" },
  { name: "Poultry", value: "poultry", icon: "/icons/poultry.png" },
  { name: "Frozen", value: "frozen foods", icon: "/icons/frozen.png" },
];
