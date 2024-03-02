import { pageApiUrl, photoApiUrl, searchPhotosApiUrl } from "../apiURLs"

export const fetchImages = async (curData: ImageInitialData[], setData: React.Dispatch<React.SetStateAction<ImageInitialData[]>>, page = 1) => {
  const fetchRes = await fetch(pageApiUrl(page));
  const data = await fetchRes.json();
  const newData = [...curData, ...data];
  window.localStorage.setItem("photo-gallery-images", JSON.stringify(newData));
  setData(newData);
  return data;
}

export const fetchImageStat = async (curData: ImageStatistics[], setData: React.Dispatch<React.SetStateAction<ImageStatistics[]>>, id: string) => {
  const fetchRes = await fetch(photoApiUrl(id));
  const data = await fetchRes.json();
  const newData = [...curData, data];
  window.localStorage.setItem("phot-gallery-images-statistics", JSON.stringify(newData));
  setData(newData);
  return data;
}

export const fetchSearchImages = async (curData: SearchedImageData[], setData: React.Dispatch<React.SetStateAction<SearchedImageData[]>>, search: string, page = 1) => {
  const fetchRes = await fetch(searchPhotosApiUrl(search, page));
  const data = await fetchRes.json();
  const modifiedData = data.results.map((img: ImageInitialData) => {return {searchKey: search, ...img}});
  const newData = [...curData, ...modifiedData];
  window.localStorage.setItem("photo-gallery-searched-images-data", JSON.stringify(newData));
  setData(newData);
  return {result: data.results, total: data.total};
}