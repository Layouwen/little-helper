<script setup lang="ts">
import useFocusClock from '@/hooks/useFocusClock';
import { FocusClockStatus } from '@/module/FocusClock';
import { Mode } from '@/views/focus-clock/types';
import { listen } from '@tauri-apps/api/event';
import { appWindow, LogicalSize, WebviewWindow } from '@tauri-apps/api/window';
import { computed, onMounted, ref } from 'vue';

const mode = ref(Mode.STANDARD);
const toggleMode = () => {
  if (mode.value === Mode.STANDARD) {
    mode.value = Mode.MINI;
    appWindow.setSize(new LogicalSize(160, 150));
  } else {
    mode.value = Mode.STANDARD;
    appWindow.setSize(new LogicalSize(400, 300));
  }
};

const {focusStatus, showTime, focusClock, focusTime} = useFocusClock();

const setFocusTime = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const val = target.value;
  if (val) {
    focusTime.value = Number(val);
  }
};

const toggleFocus = () => {
  if (focusClock.isStart()) {
    stopFocus();
  } else {
    startFocus();
  }
};

const startFocus = () => {
  appWindow.setAlwaysOnTop(true);
  focusClock.start();
};

const initFocus = () => {
  appWindow.setAlwaysOnTop(false);
};

const stopFocus = () => {
  initFocus();
  focusClock.stop();
};

const buttonText = computed(() => {
  return focusStatus.value === FocusClockStatus.START ? '取消专注' : '开始专注';
});

onMounted(() => {
  initFocus();
});

listen('resetTime', () => {
  focusClock.init();
});

</script>

<template>
  <div class="standard" v-if="mode === Mode.STANDARD">
    <div class="time-number">
      <span v-for="time in showTime" class="time-block">{{ time }}</span>
    </div>
    <div class="input-wrapper">
      <label>
        <span>专注时间：</span>
        <input type="number" placeholder="专注时间" :value="focusTime" @input="setFocusTime" />
      </label>
    </div>
    <div class="btn-controls">
      <button class="btn-start" @click="toggleFocus">{{ buttonText }}</button>
      <button class="btn-toggle" @click="toggleMode">切换模式</button>
    </div>
  </div>
  <div class="mini" v-if="mode === Mode.MINI">
    <div class="time-number">
      <span v-for="time in showTime" class="time-block">{{ time }}</span>
    </div>
    <div class="btn-controls">
      <button @click="toggleFocus">{{ buttonText }}</button>
      <button @click="toggleMode">切换模式</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.time-number {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #010101;
  .time-block {
    text-align: center;
    color: #b9b7ba;
    font-weight: bold;
    background: #2c2a2c;
  }
}

.standard {
  .time-number {
    font-size: 80px;
    padding: 30px 0;
    .time-block {
      --time-block-width: 100px;
      width: calc(var(--time-block-width) + 30px);
      height: var(--time-block-width);
      line-height: var(--time-block-width);
      border-radius: 10px;
      &:last-child {
        margin-left: 20px;
      }
    }
  }

  .input-wrapper {
    padding: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .btn-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    button {
      padding: 8px;
      font-size: 20px;
    }
  }
}

.mini {
  .time-number {
    font-size: 30px;
    padding: 10px;
    .time-block {
      --time-block-width: 50px;
      width: calc(var(--time-block-width) + 10px);
      height: var(--time-block-width);
      line-height: var(--time-block-width);
      border-radius: 10px;
      &:last-child {
        margin-left: 10px;
      }
    }
  }

  .btn-controls {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    button {
      width: 100%;
      padding: 4px;
      font-size: 16px;
    }
  }
}
</style>
