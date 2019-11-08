import styled from "styled-components";
export const WindowStyle = styled.div`
  display: flex;
  height: 100%;
  padding: 0.8em;
  box-sizing: border-box;
  flex-direction: column;

  > #message {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    > div {
      display: inline-block;
      color: #224488;
      font-weight: bold;
    }
  }
  > * {
    margin: 0.2em;
  }
  #link {
    font-size: 60%;
  }
  #option {
    background-color: rgba(255, 255, 255, 0.3);
    padding: 0.3em;
  }
`;
