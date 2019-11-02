/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { ModuleReducer } from "@jswf/redux-module";
import { TopArea } from "./TopArea/TopArea";
import { RepositorieList } from "./RepositorieList/RepositorieList";
import { FlexParent } from "./Parts/FlexParent";

function App() {
  return (
    <>
      <FlexParent>
        <TopArea />
        <RepositorieList />
      </FlexParent>
    </>
  );
}
const store = createStore(ModuleReducer);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement
);
