<template>
  <div class="container">
    <div class="container__albums" id="album" v-if="albums.length">
      <Album
        v-for="album in albums"
        :class="`album-${album.id}`"
        :album="album"
        :key="album?.id"
        @dragover="setAlbum"
        @dragleave="setAlbum"
        @mounted="updateConnectors"
      />
    </div>
    <div class="container__photos" id="photos" v-if="photos.length">
      <Photo
        v-for="photo in photos"
        :photo="photo"
        :key="photo?.id"
        @dragend="debouncedPhotoDrag"
        @mounted="updateConnectors"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { debounce } from 'lodash';
import useConnectors from '@/components/hooks/use-connectors/use-connectors';
import Album from './components/album/Album.vue';
import Photo from './components/photo/Photo.vue';
import { AlbumsResponse, PhotosResponse } from './types';

const albums = ref<AlbumsResponse[]>([]);
const photos = ref<PhotosResponse[]>([]);
const album = ref('');

const {
  createConnectors, updateConnectors, replaceConnector, createConnector,
} = useConnectors(photos);

function setAlbum(value: string): void {
  album.value = value;
}

function linkPhotoWithAlbum(payload: {
  photoId: string,
  prevAlbumId: string,
}): void {
  if (!album.value || payload.prevAlbumId === album.value) return;

  const currentAlbum = albums.value.find((item) => item.id === album.value);
  const prevAlbum = albums.value.find((item) => item.id === payload.prevAlbumId);
  const photo = photos.value.find((item: PhotosResponse) => item.id === payload.photoId);

  const removeOldPhotoLinkWithAlbum = (): void => {
    if (prevAlbum && photo) {
      const index = prevAlbum?.photos.findIndex((item: string) => item === payload.photoId);
      replaceConnector(photo);
      prevAlbum.photos.splice(index, 1);
    }
  };

  if (currentAlbum) {
    currentAlbum.photos.push(payload.photoId);
    removeOldPhotoLinkWithAlbum();
  }

  if (photo) {
    photo.album = currentAlbum?.id ?? '';
    createConnector(photo);
    updateConnectors();
    album.value = '';
  }
}

const debouncedPhotoDrag = debounce(
  (payload: {
    photoId: string, prevAlbumId: string
  }) => linkPhotoWithAlbum(payload),
  500,
);

function fetchPhotos(): Promise<PhotosResponse[]> {
  return window.fetch('http://myjson.dit.upm.es/api/bins/b9jh')
    .then((data) => data.json())
    .then((data) => data?.data);
}

function fetchAlbums(): Promise<AlbumsResponse[]> {
  return window.fetch('http://myjson.dit.upm.es/api/bins/6s75')
    .then((data) => data.json())
    .then((data) => data?.data);
}

async function fetchData(): Promise<void> {
  try {
    const [photosData, albumsData] = await Promise.all([fetchPhotos(), fetchAlbums()]);
    albums.value = albumsData;
    photos.value = photosData;
  } catch (error) {
    console.log(error);
  }
}

watch([photos, albums], ([photosValue, albumsValue]) => {
  if (photosValue.length && albumsValue.length) {
    createConnectors();
  }
});

fetchData();
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.container {
  display: flex;

  &__photos {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
}

connection-line, .connection-line-end, .connection-line-start {
  position: absolute;
  z-index: -1;
}

.album-1 {
  & > svg {
    & > path {
      stroke: #88B04B !important;
    }
  }
}

.album-2 {
  & > svg {
    & > path {
      stroke: #6B5B95 !important;
    }
  }
}

.album-3 {
  & > svg {
    & > path {
      stroke: #FF6F61 !important;
    }
  }
}
</style>
