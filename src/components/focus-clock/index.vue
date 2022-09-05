<script setup lang="ts">
import { Mode } from '@/components/focus-clock/types';
import { appWindow, LogicalSize, WebviewWindow } from '@tauri-apps/api/window';
import { computed, onMounted, ref } from 'vue';
import { zeroFill } from '@/utils';

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

const remainingTime = ref(0);
const focusTime = ref(1);

const setFocusTime = (e: InputEvent) => {
  const target = e.target as HTMLInputElement;
  const val = target.value;
  if (val) {
    const _val = Number(val);
    focusTime.value = _val;
    remainingTime.value = _val * 60;
  }
};

const focusStatus = ref(false);
const toggleFocus = () => {
  focusStatus.value = !focusStatus.value;
  if (focusStatus.value) {
    startFocus();
  } else {
    stopFocus();
  }
};

const focusTimer = ref<NodeJS.Timer>();

const startFocus = () => {
  appWindow.setAlwaysOnTop(true);
  focusTimer.value = setInterval(() => {
    if (remainingTime.value === 0) {
      focusStatus.value = false;
      stopFocus();
    } else {
      remainingTime.value--;
    }
  }, 20);
};

const initFocus = () => {
  remainingTime.value = focusTime.value * 60;
  appWindow.setAlwaysOnTop(false);
};

const stopFocus = () => {
  openRest()
  playAudio();
  initFocus();
  clearInterval(focusTimer.value);
};

const buttonText = computed(() => {
  return focusStatus.value ? '取消专注' : '开始专注';
});

const showTime = computed(() => {
  const m = Math.floor(remainingTime.value / 60);
  const s = remainingTime.value % 60;
  return [zeroFill(m), zeroFill(s)];
});

onMounted(() => {
  initFocus();
});

const playAudio = () => {
  const audio = new Audio();
  audio.src = '/src/assets/audio/bell.mp3';
  audio.play();
};

const openRest = () => {
  const webview = new WebviewWindow('rest', {
    url: 'src/windows/rest/index.html',
  });
  webview.setAlwaysOnTop(true)
};

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
    <Version />
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
