import { createContext, useState } from "react";

export const MainContext = createContext<{
  images: ImageInitialData[],
  setImages: React.Dispatch<React.SetStateAction<ImageInitialData[]>>,
  imagesStatistics: ImageStatistics[],
  setImagesStatistics: React.Dispatch<React.SetStateAction<ImageStatistics[]>>,
  searchedImagesData: SearchedImageData[],
  setSearchedImagesData: React.Dispatch<React.SetStateAction<SearchedImageData[]>>,
  search: string,
  setSearch: React.Dispatch<React.SetStateAction<string>>,
  history: string[],
  setHistory:  React.Dispatch<React.SetStateAction<string[]>>
}>({
  images: [],
  setImages: () => {},
  imagesStatistics: [],
  setImagesStatistics: () => {},
  searchedImagesData: [],
  setSearchedImagesData: () => {},
  search: "",
  setSearch: () => {},
  history: [],
  setHistory: () => {}
});

const MainContextProvider = (props: {children: React.ReactNode}) => {
  const [images, setImages] = useState<ImageInitialData[]>(JSON.parse(window.localStorage.getItem("photo-gallery-images") || "[]"));
  const [imagesStatistics, setImagesStatistics] = useState<ImageStatistics[]>(JSON.parse(window.localStorage.getItem("photo-gallery-images-statistics") || "[]"));
  const [searchedImagesData, setSearchedImagesData] = useState<SearchedImageData[]>(JSON.parse(window.localStorage.getItem("photo-gallery-searched-images-data") || "[]"));
  const [history, setHistory] = useState<string[]>(JSON.parse(window.localStorage.getItem("photo-gallery-history") || "[]"));
  const [search, setSearch] = useState<string>("");

  return <MainContext.Provider value={{images, setImages, imagesStatistics, setImagesStatistics, searchedImagesData, setSearchedImagesData, search, setSearch, history, setHistory}}>
    {props.children}
  </MainContext.Provider>
}

export default MainContextProvider;