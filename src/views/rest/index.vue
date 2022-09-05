<script setup lang="ts">
import useFocusClock from '@/hooks/useFocusClock';
import { playAudio } from '@/utils';
import { appWindow } from '@tauri-apps/api/window';
import { onMounted } from 'vue';

const {focusTime, init: initFocus, showTime, stop, start} = useFocusClock();

const init = () => {
  focusTime.value = 5;
  initFocus();
  start().then(()=>{
    playAudio()
  });

  appWindow.setAlwaysOnTop(true);
  appWindow.maximize();
};

const close = () => {
  stop();
  appWindow.close();
};

onMounted(() => {
  init();
});
</script>
<template>
  <div class="wrapper">
    <div>时间到了，请注意休息哦</div>
    <div v-for="time in showTime">{{ time }}</div>
    <button @click="close">休息结束</button>
  </div>
</template>

<style lang="scss">
.wrapper {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 100px;
  button {
    padding: 20px;
    font-size: 90px;
  }
}
</style>
