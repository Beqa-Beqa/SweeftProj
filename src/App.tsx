import { useState } from "react";
import { Header, Main } from "./Containers";

function App() {
  const [navTo, setNavTo] = useState<"Main" | "History">("Main");

  return (
    <>
      <header>
        <Header navTo={navTo} setNavTo={setNavTo} />
      </header>
      <main>
        <Main navTo={navTo} />
      </main>
    </>
  );
}

export default App
