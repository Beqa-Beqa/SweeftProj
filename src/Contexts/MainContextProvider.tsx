import { createContext, useEffect, useState } from "react";

export const MainContext = createContext<{
  filteredImages: ImageInitialData[],
  setImages: React.Dispatch<React.SetStateAction<ImageInitialData[]>>,
  imagesStatistics: ImageStatistics[],
  setImagesStatistics: React.Dispatch<React.SetStateAction<ImageStatistics[]>>,
  filteredSearchedImagesData: SearchedImageData[],
  setSearchedImagesData: React.Dispatch<React.SetStateAction<SearchedImageData[]>>,
  search: string,
  setSearch: React.Dispatch<React.SetStateAction<string>>,
  filteredHistory: string[],
  setHistory:  React.Dispatch<React.SetStateAction<string[]>>
}>({
  filteredImages: [],
  setImages: () => {},
  imagesStatistics: [],
  setImagesStatistics: () => {},
  filteredSearchedImagesData: [],
  setSearchedImagesData: () => {},
  search: "",
  setSearch: () => {},
  filteredHistory: [],
  setHistory: () => {}
});

const MainContextProvider = (props: {children: React.ReactNode}) => {
  const [images, setImages] = useState<ImageInitialData[]>(JSON.parse(window.localStorage.getItem("photo-gallery-images") || "[]"));
  const [imagesStatistics, setImagesStatistics] = useState<ImageStatistics[]>(JSON.parse(window.localStorage.getItem("photo-gallery-images-statistics") || "[]"));
  const [searchedImagesData, setSearchedImagesData] = useState<SearchedImageData[]>(JSON.parse(window.localStorage.getItem("photo-gallery-searched-images-data") || "[]"));
  const [history, setHistory] = useState<string[]>(JSON.parse(window.localStorage.getItem("photo-gallery-history") || "[]"));
  const [search, setSearch] = useState<string>("");

  const [filteredImages, setFilteredImages] = useState<ImageInitialData[]>([]);
  const [filteredSearchedImagesData, setFilteredSearchedImagesData] = useState<SearchedImageData[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<string[]>([]);

  useEffect(() => {
    setFilteredImages(Array.from(new Set(images)));
    setFilteredSearchedImagesData(Array.from(new Set(searchedImagesData)));
    setFilteredHistory(Array.from(new Set(history)));
  }, [images, searchedImagesData, history]);

  return <MainContext.Provider value={{filteredImages, setImages, imagesStatistics, setImagesStatistics, filteredSearchedImagesData, setSearchedImagesData, search, setSearch, filteredHistory, setHistory}}>
    {props.children}
  </MainContext.Provider>
}

export default MainContextProvider;