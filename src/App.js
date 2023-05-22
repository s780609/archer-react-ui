import logo from "./logo.svg";
import "./App.css";

import { SpecialCharacterKeyboard } from "./lib";
import { Recorder } from "./lib";

function App() {
  const onClick = (e) => {
    console.log(e);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <body>
        <input></input>
        <SpecialCharacterKeyboard onClick={onClick}></SpecialCharacterKeyboard>
        <Recorder></Recorder>
      </body>
    </div>
  );
}

export default App;
