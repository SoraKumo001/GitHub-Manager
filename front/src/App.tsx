import React from "react";
import { TopArea } from "./TopArea/TopArea";
import { RepositorieList } from "./RepositorieList/RepositorieList";
import { FlexParent } from "./Parts/FlexParent";

export function App() {
  return (
    <>
      <FlexParent>
        <TopArea />
        <RepositorieList />
      </FlexParent>
    </>
  );
}
