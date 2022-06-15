import { shallowMount } from '@vue/test-utils';
import Album from '../Album.vue';

describe('Album.vue', () => {
  const album = {
    id: '1',
    photos: ['1', '2'],
    name: 'all',
  };

  it('assigns correct class using props data', () => {
    const wrapper = shallowMount(Album, {
      props: { album },
    });
    expect(wrapper.classes().includes('album-1')).toBeTruthy();
  });

  it('change active state when drag over', async () => {
    const wrapper = shallowMount(Album, {
      props: { album },
    });
    await wrapper.find('.album').trigger('dragover');
    expect(wrapper.classes().includes('active')).toBeTruthy();
  });
});
