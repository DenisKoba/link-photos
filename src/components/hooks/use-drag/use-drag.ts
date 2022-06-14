import { Ref, ref } from 'vue';

export default function useDrag(): {
  deactivate: () => void,
  activate: () => void,
  active: Ref<boolean>,
  } {
  const active = ref(false);

  function deactivate(): void {
    active.value = false;
  }

  function activate(): void {
    active.value = true;
  }

  return {
    deactivate,
    activate,
    active,
  };
}
