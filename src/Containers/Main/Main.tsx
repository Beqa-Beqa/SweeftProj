import { useContext, useState, useRef, useCallback, useEffect } from "react";
import { MainSearch } from "../../Components";
import "./Main.css";
import { MainContext } from "../../Contexts/MainContextProvider";
import { fetchImageStat, fetchImages, fetchSearchImages } from "../../Functions";

const Main = (props: {
  navTo: "Main" | "History"
}) => {
  const {images, setImages, imagesStatistics, setImagesStatistics, history, searchedImagesData, setSearchedImagesData} = useContext(MainContext);
  const [mainPage, setMainPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);

  const [search, setSearch] = useState<string>("");
  const [showSearchResults, setShowSearchResults] = useState<{show: boolean, search: string}>({show: false, search: ""});

  const observer = useRef<IntersectionObserver | undefined>(undefined);

  const lastImageRef = useCallback((node: HTMLDivElement) => {
    if(loading) return;
    if(observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting) {
        if(showSearchResults.show) {
          setSearchPage(prev => prev + 1);
        } else if (showHistoryImages.show) {
          setHistoryPage(prev => prev + 1);
        } else {
          setMainPage(prev => prev + 1);
        }
      }
    });
    if (node) observer.current.observe(node);
  }, [loading]);

  useEffect(() => {
    const fetch = async (target: "mainpage" | "history" | "search" = "mainpage") => {
      setLoading(true);
      if(target === "mainpage") {
        await fetchImages(images, setImages, mainPage);
      } else if (target === "history") {
        await fetchSearchImages(searchedImagesData, setSearchedImagesData, showSearchResults.search, historyPage);
      } else {
        await fetchSearchImages(searchedImagesData, setSearchedImagesData, showSearchResults.search, searchPage)
      }
      setLoading(false);
    }

    fetch();

    if(showSearchResults.show) {
      fetch("search");
    } else if (showHistoryImages.show) {
      fetch("history");
    } else {
      fetch();
    }
  }, [mainPage, historyPage, searchPage]);

  const [showStats, setShowStats] = useState<{show: boolean, data: ImageStatistics | {}}>({show: false, data: {}});

  const [showHistoryImages, setShowHistoryImages] = useState<{show: boolean, data: ImageInitialData[]}>({show: false, data: []});

  const handleImageClick = async (img: ImageInitialData) => {
    const foundStats = imagesStatistics.find((data: ImageStatistics) => data.id === img.id);
    if(foundStats) {
      setShowStats({show: true, data: foundStats});
    } else {
      const result = await fetchImageStat(imagesStatistics, setImagesStatistics, img.id);
      setShowStats({show: true, data: result});
    }
  }

  return (
    <>
      <div className="main">
        {props.navTo === "Main" && <MainSearch search={search} setSearch={setSearch} setShowSearchResults={setShowSearchResults} />}
        {props.navTo === "Main" && <div className="main-images-container">
          {!showSearchResults.show ?
            images.length &&
                images.map((image: ImageInitialData, index: number) => {
                  if(index + 1 === images.length) {
                    return <div onClick={() => handleImageClick(image)} ref={lastImageRef} key={index} className="image-container">
                      <img src={image.urls.regular} alt="random image"/>
                    </div>
                  } else {
                    return <div onClick={() => handleImageClick(image)} key={index} className="image-container">
                      <img src={image.urls.regular} alt="random image"/>
                    </div>
                  }
                })
          :
            <div className="search-results">
              <span className="cancel-button" onClick={() => setShowSearchResults({show: false, search: ""})}>Cancel X</span>
              <div className="main-images-container">
                {searchedImagesData.filter((data: SearchedImageData) => data.searchKey === showSearchResults.search).map((data: SearchedImageData, index: number) => {
                  if(index + 1 === searchedImagesData.filter((data: SearchedImageData) => data.searchKey === showSearchResults.search).length) {
                    return <div ref={lastImageRef} key={data.id} onClick={() => handleImageClick(data)} className="image-container">
                      <img src={data.urls.regular} alt="searched image" />
                    </div>
                  } else {
                    return <div key={data.id} onClick={() => handleImageClick(data)} className="image-container">
                      <img src={data.urls.regular} alt="searched image" />
                    </div>
                  }
                })
                }
              </div>
            </div>
            }
          {loading && <span style={{fontSize: 30}}>Loading...</span>}
        </div>}
        {props.navTo === "History" ?
          !showHistoryImages.show ?
            <div className="history-word-buttons">
            {history.length ?
              history.map((str: string, key: number) => {
                return <span onClick={() => setShowHistoryImages({show: true, data: searchedImagesData.filter((data: SearchedImageData) => data.searchKey === str)})} key={key}>{str}</span>
                  })
              : null}
            </div>
          : 
            <div className="history-container">
              <span onClick={() => setShowHistoryImages({show: false, data: []})}>Cancel X</span>
              <div className="main-images-container">
                {showHistoryImages.data.map((data: ImageInitialData, index: number) => {
                  if(index + 1 === showHistoryImages.data.length) {
                    return <div ref={lastImageRef} key={index} className="image-container">
                      <img src={data.urls.regular} alt="old searched image" />
                    </div>
                  } else {
                    return <div key={index} className="image-container">
                      <img src={data.urls.regular} alt="old searched image" />
                    </div>
                  }
                })}
              </div>
            </div>
        : null
        }
      </div>
      {showStats.show && 
        <div className="prompt">
          <div className="prompt-box">
            <div className="prompt-box-header">
              <span>Statistics</span>
              <span style={{cursor: "pointer"}} onClick={() => setShowStats({show: false, data: {}})}>X</span>
            </div>
            <div className="statistics-data">
              <span>Views: {(showStats.data as ImageStatistics).views.total}</span>
              <span>Likes: {(showStats.data as ImageStatistics).likes.total}</span>
              <span>Downloads: {(showStats.data as ImageStatistics).downloads.total}</span>
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default Main;