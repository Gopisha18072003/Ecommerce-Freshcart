import { createSlice } from "@reduxjs/toolkit";

const cart = createSlice({
    name: 'cart',
    initialState: { items:[], total: 0 },
    reducers: {
        addItemToCart(state, action) {
            let isItemFound = false;
            for (let item of state.items) {
                if(item.product._id == action.payload.product._id) {
                    item.quantity += 1;
                    state.total += action.payload.product.finalPrice
                    isItemFound = true;
                    break;
                }
            }
            if(!isItemFound) {
                state.items.push({
                    product : action.payload.product,
                    quantity: 1
                })
                state.total += action.payload.product.finalPrice
            }

        },
        setCartData(state, action) {
            state.items = action.payload.items;
            state.total = action.payload.total
        },
        emptyCartData(state) {
            state.items = [],
            state.total = 0
        },
        removeItemToCart(state, action) {
            state.items = state.items.map(item => {
                if (item.product._id === action.payload.product._id) {
                    if (item.quantity > 1) {
                        item.quantity -= 1;
                        state.total -= action.payload.product.finalPrice;
                    } else {
                        // Do not include this item if its quantity is 1
                        state.total -= action.payload.product.finalPrice;
                        return null;
                    }
                    
                }
                return item;
            }).filter(item => item !== null);
        }
    }
})

export const {addItemToCart, removeItemToCart, setCartData, emptyCartData} = cart.actions;
export default cart.reducer;