<script setup lang="ts">
import StampWorkspace from './components/editor/StampWorkspace.vue'
</script>

<template>
  <div class="app-root">
    <div class="demo-wrapper">
      <StampWorkspace />
    </div>
  </div>
</template>

<style scoped>
.app-root {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 24px;
  background-color: #f5f5f5;
  box-sizing: border-box;
}

.demo-wrapper {
  width: 100%;
  max-width: 1200px;
}
</style>
