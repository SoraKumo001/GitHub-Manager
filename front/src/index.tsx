import React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { ModuleReducer } from "@jswf/redux-module";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import { App } from "./App";

const persistConfig = {
  key: "root",
  storage
};

const store = createStore(persistReducer(persistConfig, ModuleReducer));
const persistor = persistStore(store);
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById("root") as HTMLElement
);
