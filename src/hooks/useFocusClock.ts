import { zeroFill } from '@/utils';
import { computed, ref } from 'vue';

const useFocusClock = () => {
  const remainingTime = ref(0);
  const focusTime = ref(1);

  const showTime = computed(() => {
    const m = Math.floor(remainingTime.value / 60);
    const s = remainingTime.value % 60;
    return [zeroFill(m), zeroFill(s)];
  });

  const focusTimer = ref<NodeJS.Timer>();
  const focusStatus = ref(false);
  const init = () => {
    remainingTime.value = focusTime.value * 60;
  };

  const start = () => {
    return new Promise(resolve => {
      focusTimer.value = setInterval(() => {
        if (remainingTime.value === 0) {
          focusStatus.value = false;
          stop();
          resolve(undefined);
        } else {
          remainingTime.value--;
        }
      }, 1000);
    });
  };

  const stop = () => {
    clearInterval(focusTimer.value);
  };


  return {
    focusTime,
    remainingTime,
    showTime,
    start,
    stop,
    focusStatus,
    init,
  };
};

export default useFocusClock;
