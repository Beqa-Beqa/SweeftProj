declare interface ImageInitialData {
  id: string,
  urls: {
    raw: string,
    full: string,
    regular: string,
    small: string,
    thumb: string
  }
}

declare interface ImageStatistics {
  id: string,
  downloads: {
    total: number
  },
  views: {
    total: number
  },
  likes: {
    total: number
  }
}

declare interface SearchedImageData extends ImageInitialData {
  searchKey: string,
}