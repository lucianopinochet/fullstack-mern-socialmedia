import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import authReducer from "./state";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";

const persistConfig = { key: "root", storage, version: 1 };//set config storage 
const persistedReducer = persistReducer(persistConfig, authReducer);// combines configurations and reducer for the state
const store = configureStore({//sets new configuration over the base redux settings
  reducer: persistedReducer,// sets reducer
  middleware: (getDefaultMiddleware) =>// install middlewares
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const root = ReactDOM.createRoot(document.getElementById("root")); // crete root of rendering DOM
root.render( // renders component composition
  <React.StrictMode> {/* wrapper component to debug */}
    <Provider store={store}> {/* component that provides accesibilty of the store to other component */}
      <PersistGate loading={null} persistor={persistStore(store)}> {/*delays app of running until state has been saved in the store*/}
        <App /> {/* main component to be loaded */}
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
