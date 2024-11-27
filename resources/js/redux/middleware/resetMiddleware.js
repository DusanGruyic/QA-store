// resetMiddleware.js
import { RESET_APP_STATE } from "../actionTypes";
import { cartApi } from "../api/cartsRTK"; // Import your RTK Query API slice
import { productApi } from "../api/productsRTK";
import { userApi } from "../api/usersRTK";

export const resetMiddleware = (store) => (next) => (action) => {
    if (action.type === RESET_APP_STATE) {
        store.dispatch(cartApi.util.resetApiState());
        store.dispatch(productApi.util.resetApiState());
        store.dispatch(userApi.util.resetApiState());
    }
    return next(action);
};
