<script setup lang="ts">
import { getName, getVersion } from '@tauri-apps/api/app';
import { onMounted, ref } from 'vue';

const name = ref('');
const version = ref('');

const init = async () => {
  name.value = await getName();
  version.value = await getVersion();
};

onMounted(() => {
  init();
});
</script>

<template>
  <div class="bw-version">
    <span :style="{marginRight: '10px'}">应用名称: {{ name }}</span>
    <span>版本: {{ version }}</span>
  </div>
</template>

<style lang="scss">
.bw-version {
  padding: 10px 0;
  text-align: center;
}
</style>
