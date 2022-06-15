<template>
  <div
    :class="['album', `album-${album.id}` , { active } ]"
    @dragover="overAlbum"
    @dragleave="deactivate"
  >
    <div class="album__name">{{ album.name }}</div>
  </div>
</template>

<script lang="ts" setup>
import {
  defineProps, PropType, defineEmits, onMounted,
} from 'vue';
import { AlbumsResponse } from '@/types';
import { debounce } from 'lodash';
import useDrag from '@/components/hooks/use-drag/use-drag';

const { activate, deactivate, active } = useDrag();
const props = defineProps({
  album: {
    type: Object as PropType<AlbumsResponse>,
    required: true,
  },
});

const emit = defineEmits(['dragover', 'mounted']);
const debouncedDragOver = debounce(() => emit('dragover', props.album.id), 500);

function overAlbum(): void {
  activate();
  debouncedDragOver();
}

onMounted(() => emit('mounted'));
</script>

<style scoped>
.album {
  width: 200px;
  padding: 20px 10px;
  background-color: #f2f2f2;
  border-radius: 10px;
  margin: 0 0 5px 0;
  transition: .3s;
  color: #fff;
}

.active {
  transform: scale(1.2);
}

.album-1 {
  background-color: #88B04B;
}

.album-2 {
  background-color: #6B5B95;
}

.album-3 {
  background-color: #FF6F61;
}
</style>
