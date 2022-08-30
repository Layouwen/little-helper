<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { zeroFill } from '@/utils';

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
};

const stopFocus = () => {
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
</script>

<template>
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
  </div>
</template>

<style scoped lang="scss">
.time-number {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 100px;
  padding: 80px 0;
  background: #010101;
  .time-block {
    --time-block-width: 130px;
    width: calc(var(--time-block-width) + 30px);
    height: var(--time-block-width);
    line-height: var(--time-block-width);
    text-align: center;
    color: #b9b7ba;
    font-weight: bold;
    background: #2c2a2c;
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
  .btn-start {
    font-size: 20px;
  }
}
</style>
