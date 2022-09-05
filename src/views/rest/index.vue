<script setup lang="ts">
import { currentMonitor } from '@tauri-apps/api/window';
import { onMounted } from 'vue';

const init = () => {
  const current = currentMonitor();
  console.log(current);
};

onMounted(() => {
  init();
});
</script>
<template>
  <div>时间到了，请注意休息哦</div>
</template>
