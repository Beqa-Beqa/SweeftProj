import { useContext } from "react";
import "./mainSearch.css";
import { MainContext } from "../../Contexts/MainContextProvider";
import { fetchSearchImages } from "../../Functions";

const MainSearch = (props: {
  setShowSearchResults: React.Dispatch<React.SetStateAction<{
    show: boolean;
    search: string;
  }>>,
  setTotal: React.Dispatch<React.SetStateAction<number>>
}) => {
  const {filteredHistory, setHistory, filteredSearchedImagesData, setSearchedImagesData, search, setSearch} = useContext(MainContext);

  const handleSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.code === "Enter") {
      const newHistory = [search, ...filteredHistory];
      setHistory(newHistory);
      window.localStorage.setItem("photo-gallery-history", JSON.stringify(newHistory));
      
      const existsData = filteredSearchedImagesData.filter((data: SearchedImageData) => data.searchKey === search);

      if(!existsData.length) {
        const res = await fetchSearchImages(filteredSearchedImagesData, setSearchedImagesData, search);
        props.setTotal(res.total);
      }
      
      props.setShowSearchResults({show: true, search})
    }
  }

  return (
    <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => handleSubmit(e)} placeholder="Search" className="main-search" />
  );
}

export default MainSearch;