export type PhotosResponse = {
  id: string;
  src: string;
  album: string;
}

export type AlbumsResponse = {
  id: string;
  photos: string[];
  name: string;
}
