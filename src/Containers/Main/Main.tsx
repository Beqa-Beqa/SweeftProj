import { useContext, useState, useEffect } from "react";
import { MainSearch } from "../../Components";
import "./Main.css";
import { MainContext } from "../../Contexts/MainContextProvider";
import { fetchImageStat, fetchImages, fetchSearchImages } from "../../Functions";
import { lastImageRef, newObserver } from "../../App";

const Main = (props: {
  mainPage: number,
  setMainPage: React.Dispatch<React.SetStateAction<number>>,
  searchPage: number,
  setSearchPage: React.Dispatch<React.SetStateAction<number>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  loading: boolean
}) => {
  const {images, setImages, imagesStatistics, setImagesStatistics, searchedImagesData, setSearchedImagesData, search, setSearch} = useContext(MainContext);
  const {mainPage, setMainPage, loading, setLoading, searchPage, setSearchPage} = props;

  const [showSearchResults, setShowSearchResults] = useState<{show: boolean, search: string}>({show: false, search: ""});

  const [total, setTotal] = useState<number>(0);

  const mainObserver = newObserver();
  const mainLastImageRef = lastImageRef(mainObserver, loading, setMainPage);
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      await fetchImages(images, setImages, mainPage);
      setLoading(false);
    }

    fetch();
  }, [mainPage]);


  const searchObserver = newObserver();
  const searchLastImageRef = lastImageRef(searchObserver, loading, setSearchPage);
  useEffect(() => {
    const searchedImages = searchedImagesData.filter((data: SearchedImageData) => data.searchKey === showSearchResults.search);

    const fetch = async () => {
      if(total > searchedImages.length) {
        setLoading(true);
        await fetchSearchImages(searchedImagesData, setSearchedImagesData, search, searchPage);
        setLoading(false);
      }
    }

    setTimeout(() => fetch(), 1000);
  }, [searchPage]);

  const [showStats, setShowStats] = useState<{show: boolean, data: ImageStatistics | {}, src: string}>({show: false, data: {}, src: ""});

  const handleImageClick = async (img: ImageInitialData) => {
    const foundStats = imagesStatistics.find((data: ImageStatistics) => data.id === img.id);
    if(foundStats) {
      setShowStats({show: true, data: foundStats, src: img.urls.regular});
    } else {
      const result = await fetchImageStat(imagesStatistics, setImagesStatistics, img.id);
      setShowStats({show: true, data: result, src: img.urls.regular});
    }
  }

  return (
    <>
      <div className="main">
        <MainSearch setTotal={setTotal} setShowSearchResults={setShowSearchResults} />
        <div className="main-images-container">
          {!showSearchResults.show ?
            images.length &&
                images.map((image: ImageInitialData, index: number) => {
                  if(index + 1 === images.length) {
                    return <div onClick={() => handleImageClick(image)} ref={mainLastImageRef} key={index} className="image-container">
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
              <span className="cancel-button" onClick={() => {setShowSearchResults({show: false, search: ""}); setSearch(""); setTotal(0)}}>Cancel X</span>
              <div className="main-images-container">
                {searchedImagesData.filter((data: SearchedImageData) => data.searchKey === showSearchResults.search).map((data: SearchedImageData, index: number) => {
                  if(index + 1 === searchedImagesData.filter((data: SearchedImageData) => data.searchKey === showSearchResults.search).length) {
                    return <div ref={searchLastImageRef} key={data.id} onClick={() => handleImageClick(data)} className="image-container">
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
        </div>
      </div>
      {showStats.show && 
        <div className="prompt">
          <div className="prompt-image-container">
            <img style={{objectFit: "contain", width: "100%"}} className="open-image" src={showStats.src} alt="beautiful image"/>
            <div style={{maxHeight: 300}} className="prompt-box">
              <div className="prompt-box-header">
                <span>Statistics</span>
                <span style={{cursor: "pointer"}} onClick={() => setShowStats({show: false, data: {}, src: ""})}>X</span>
              </div>
              <div className="statistics-data">
                <span>Views: {(showStats.data as ImageStatistics).views.total}</span>
                <span>Likes: {(showStats.data as ImageStatistics).likes.total}</span>
                <span>Downloads: {(showStats.data as ImageStatistics).downloads.total}</span>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default Main;