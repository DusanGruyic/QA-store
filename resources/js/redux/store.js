import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import activeStepReducer from "./activeStepSlice";
import authSlice from "./authSlice";
import { userApi } from "./api/usersRTK";
import { cartApi } from "./api/cartsRTK";
import { setupListeners } from "@reduxjs/toolkit/query";
import { productApi } from "./api/productsRTK";
import { resetMiddleware } from "./middleware/resetMiddleware";
import { RESET_APP_STATE } from "./actionTypes";

const appReducer = combineReducers({
    activeStep: activeStepReducer,
    auth: authSlice,
    [userApi.reducerPath]: userApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
});

const rootReducer = (state, action) => {
    if (action.type === RESET_APP_STATE) {
        // Return undefined to reset the state
        state = undefined;
    }
    return appReducer(state, action);
};

const persistConfig = {
    key: "root",
    storage,
    blacklist: ["activeStep", "auth", "productApi", "cartApi"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }).concat(
            userApi.middleware,
            cartApi.middleware,
            productApi.middleware,
            resetMiddleware
        ),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
