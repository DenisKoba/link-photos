import { PhotosResponse } from '@/types';
import Connector from 'connection-line';
import { Ref, ref } from 'vue';

export default function useConnectors(photos: Ref<PhotosResponse[]>): {
  updateConnectors: () => void,
  createConnectors: () => void,
  createConnector: (photo: PhotosResponse) => void,
  replaceConnector: (photo: PhotosResponse) => void,
} {
  const connectors = ref<{
    id: string,
    connector: unknown,
  }[]>([]);

  function createConnectorId(photo: PhotosResponse): string {
    return `${photo.album}-${photo.id}`;
  }

  function updateConnectors(): void {
    // @ts-expect-error: any
    connectors.value.forEach((item) => item.connector.update());
  }

  function createConnector(photo: PhotosResponse): void {
    const id = createConnectorId(photo);
    const connector = new Connector({
      from: `.album-${photo.album}`,
      to: `.photo-${photo.id}`,
      smoothness: 1,
      lineEnd: '•',
      lineStart: '•',
      fromDirection: 'right',
      toDirection: 'left',
      padding: 20,
    });

    connector.element.classList.add(`album-${photo.album}`);
    connectors.value.push({
      id,
      connector,
    });

    document.body.appendChild(connector.element);
    window.addEventListener('resize', () => {
      connector.update();
    });
  }

  function replaceConnector(photo: PhotosResponse): void {
    const id = createConnectorId(photo);
    const index = connectors.value
      .findIndex((connector) => connector.id === id);
    const connector = connectors.value.find((item) => item.id === id);
    if (connector) {
      // @ts-expect-error: unknown
      connector.connector.element.remove();
    }
    connectors.value.splice(index, 1);
  }

  function createConnectors(): void {
    photos.value.forEach((photo: PhotosResponse) => {
      createConnector(photo);
    });
  }

  return {
    updateConnectors,
    createConnectors,
    replaceConnector,
    createConnector,
  };
}
