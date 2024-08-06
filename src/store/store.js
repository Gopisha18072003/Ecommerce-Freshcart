import { combineReducers, configureStore } from "@reduxjs/toolkit";
import  cartSlice  from "./cart-slice";
import authReducer from "./auth-slice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import uiReducer from './ui-slice';
const rootReducer = combineReducers({
  cart: cartSlice,
  auth: authReducer,
  ui: uiReducer
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export default store;
