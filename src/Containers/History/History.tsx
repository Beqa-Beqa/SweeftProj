import { useContext, useEffect, useState } from "react";
import "../Main/Main.css";
import "./history.css";
import { MainContext } from "../../Contexts/MainContextProvider";
import { lastImageRef, newObserver } from "../../App";
import { fetchSearchImages, fetchImageStat } from "../../Functions";

const History = (props: {
  historyPage: number,
  setHistoryPage: React.Dispatch<React.SetStateAction<number>>,
  loading: boolean,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const {history, searchedImagesData, setSearchedImagesData, imagesStatistics, setImagesStatistics} = useContext(MainContext);
  const filteredHistoryKeys = Array.from(new Set(history));

  const [showImages, setShowImages] = useState<{show: boolean, searchKey: string}>({show: false, searchKey: ""});

  const [showStats, setShowStats] = useState<{show: boolean, data: ImageStatistics | {}, src: string}>({show: false, data: {}, src: ""});

  const historyObserver = newObserver();
  const historyLastImageRef = lastImageRef(historyObserver, props.loading, props.setHistoryPage);
  useEffect(() => {
    const fetch = async () => {
      props.setLoading(true);
      await fetchSearchImages(searchedImagesData, setSearchedImagesData, showImages.searchKey, props.historyPage)
      props.setLoading(false);
    }

    fetch();
  }, [props.historyPage])

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
      {!showImages.show ? 
        <div className="history-word-buttons">
          {history.length ? 
            filteredHistoryKeys.map((searchKey: string, key: number) => {
              return <span onClick={() => setShowImages({show: true, searchKey})} key={key}>{searchKey}</span>
            })
          : null}
        </div>
      :
        <div style={{display: "flex", flexFlow: "column", alignItems: "center"}}>
          <span style={{fontSize: 30, cursor: "pointer", marginBottom: 20}} onClick={() => setShowImages({show: false, searchKey: ""})} >Cancel X</span>
          <div className="main-images-container">
            {searchedImagesData.filter((imageData: SearchedImageData) => imageData.searchKey === showImages.searchKey).map((data: ImageInitialData, index: number) => {
              if(index + 1 === searchedImagesData.filter((imageData: SearchedImageData) => imageData.searchKey === showImages.searchKey).length) {
                return <div onClick={() => handleImageClick(data)} ref={historyLastImageRef} className="image-container" key={index}>
                  <img src={data.urls.regular} alt="previously searched image" />
                </div>
              } else {
                return <div onClick={() => handleImageClick(data)} className="image-container" key={index}>
                  <img src={data.urls.regular} alt="previously searched image" />
                </div>
              }
            })}
          </div>
          {props.loading && <span style={{fontSize: 30}}>Loading...</span>}
        </div>}
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

export default History;