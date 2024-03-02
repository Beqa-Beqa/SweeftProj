import { useState, useRef, useCallback } from "react";
import { Header, Main, History } from "./Containers";

export const newObserver = () => useRef<IntersectionObserver | undefined>(undefined);

export const lastImageRef = (observer: React.MutableRefObject<IntersectionObserver | undefined>, loading: boolean, setPage: React.Dispatch<React.SetStateAction<number>>) => useCallback((node: HTMLDivElement) => {
  if(loading) return;
  if(observer.current) observer.current.disconnect()
  observer.current = new IntersectionObserver((entries) => {
    if(entries[0].isIntersecting) {
      setPage(prev => prev + 1);
    }
  });
  if (node) observer.current.observe(node);
}, [loading]);

function App() {
  const [navTo, setNavTo] = useState<"Main" | "History">("Main");

  const [mainPage, setMainPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <header>
        <Header navTo={navTo} setNavTo={setNavTo} />
      </header>
      <main>
        {navTo === "Main" ? 
          <Main
            mainPage={mainPage}
            setMainPage={setMainPage}
            searchPage={searchPage}
            setSearchPage={setSearchPage}
            loading={loading} 
            setLoading={setLoading}
          />
        :
          <History
            historyPage={searchPage}
            setHistoryPage={setSearchPage}
            loading={loading}
            setLoading={setLoading}
          />
        }
      </main>
    </>
  );
}

export default App
