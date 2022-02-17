import Zip from "./components/Zip";
import Error from "./components/Error";
import { useState } from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Tree } from "./components/Tree";

function App() {
  const [error, setError] = useState(false);
  const errorHandler = () => {
    setError((prevState) => !prevState);
  };
  return (
    <div>
      <h1 className="header">Zip Extractor</h1>
      <p className="text-center">
        Archive Extractor is a small and easy online tool that can extract over
        70 types of compressed files, such as 7z, zipx, rar, tar, exe, dmg and
        much more.
      </p>
      <Zip handler={errorHandler} />
      {error && <Error handler={errorHandler} />}
    </div>
  );
}

export default App;
