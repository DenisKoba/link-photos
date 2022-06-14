<template>
  <div class="photo" @dragend="setDraggedPhoto(photo)" @drag="resolveCursor">
    <img :class="`photo-${photo?.id}`" :src="photo.src" alt="photo" draggable="true"/>
  </div>
</template>

<script lang="ts" setup>
import {
  PropType, defineProps, defineEmits, onMounted,
} from 'vue';
import { PhotosResponse } from '@/types';

const emit = defineEmits(['dragend', 'mounted']);

defineProps({
  photo: {
    type: Object as PropType<PhotosResponse>,
    required: true,
  },
});

function setDraggedPhoto(photo: PhotosResponse): void {
  emit('dragend', {
    photoId: photo.id,
    prevAlbumId: photo.album,
  });
}

onMounted(() => emit('mounted'));
</script>

<style scoped>
.photo img {
  width: 200px;
  border-radius: 10px;
  transition: .3s;
  cursor: grab;
}
</style>
