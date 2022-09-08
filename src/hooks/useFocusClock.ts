import config from '@/config';
import FocusClock, { FocusClockStatus } from '@/module/FocusClock';
import { zeroFill } from '@/utils';
import { WebviewWindow } from '@tauri-apps/api/window';
import { computed, onMounted, ref, unref, watch } from 'vue';

const useFocusClock = () => {
  const focusClock = ref<FocusClock>(new FocusClock(config.focusClock));
  const remainingTime = ref(0);
  const focusStatus = ref<FocusClockStatus>(focusClock.value.getState().status);
  const focusTime = ref(0);

  onMounted(() => {
    focusClock.value.on('init', (state: any) => {
      focusTime.value = state.focusTime;
      focusStatus.value = state.status;
      remainingTime.value = state.remainingTime;
    });
    focusClock.value.on('update', (state: any) => {
      focusStatus.value = state.status;
      remainingTime.value = state.remainingTime;
    });
    focusClock.value.on('end', (state: any) => {
      focusStatus.value = state.status;
      remainingTime.value = state.remainingTime;
      openRest();
    });
    focusClock.value.init();
  });

  watch(() => focusTime.value, () => {
    focusClock.value.setFocusTime(focusTime.value);
    remainingTime.value = focusClock.value.getState().remainingTime;
  });

  const showTime = computed(() => {
    const m = Math.floor(remainingTime.value / 60);
    const s = remainingTime.value % 60;
    return [zeroFill(m), zeroFill(s)];
  });

  const openRest = () => {
    new WebviewWindow('rest', {url: '/#/rest'});
  };

  return {
    focusClock: unref(focusClock),
    focusTime,
    focusStatus,
    remainingTime,
    showTime,
  };
};

export default useFocusClock;
