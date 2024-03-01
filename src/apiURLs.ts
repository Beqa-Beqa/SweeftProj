import { REACT_APP_ACCESS_KEY } from "./keys";

const baseApiUrl = "https://api.unsplash.com";
export const pageApiUrl = (page: number) => `${baseApiUrl}/photos?page=${page}&client_id=${REACT_APP_ACCESS_KEY}&per_page=20&order_by=popular`;
export const photoApiUrl = (id: string) => `${baseApiUrl}/photos/${id}/statistics?client_id=${REACT_APP_ACCESS_KEY}`;
export const searchPhotosApiUrl = (search: string, page: number = 1) => `${baseApiUrl}/search/photos?client_id=${REACT_APP_ACCESS_KEY}&page=${page}&query=${search}`;