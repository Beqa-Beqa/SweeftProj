import { useContext } from "react";
import "./mainSearch.css";
import { MainContext } from "../../Contexts/MainContextProvider";
import { fetchSearchImages } from "../../Functions";

const MainSearch = (props: {
  search: string,
  setSearch: React.Dispatch<React.SetStateAction<string>>,
  setShowSearchResults: React.Dispatch<React.SetStateAction<{
    show: boolean;
    search: string;
  }>> 
}) => {
  const {search, setSearch} = props;
  const {history, setHistory, searchedImagesData, setSearchedImagesData} = useContext(MainContext);

  const handleSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.code === "Enter") {
      const newHistory = [search, ...history];
      setHistory(newHistory);
      window.localStorage.setItem("photo-gallery-history", JSON.stringify(newHistory));
      
      const existsData = searchedImagesData.filter((data: SearchedImageData) => data.searchKey === search);

      if(!existsData.length) {
        await fetchSearchImages(searchedImagesData, setSearchedImagesData, search);
      }
      
      props.setShowSearchResults({show: true, search})
      setSearch("");
    }
  }

  return (
    <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => handleSubmit(e)} placeholder="Search" className="main-search" />
  );
}

export default MainSearch;