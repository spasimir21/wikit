<script setup lang="ts">
const props = defineProps({
  textId: { type: String, required: true },
  reference: { type: String, required: true }
});

function onClick() {}
</script>

<template>
  <p class="reference" @click="onClick">[{{ reference }}]</p>
</template>

<style scoped>
.reference {
  display: inline-block;
  color: var(--foreground-vibrant-accent);
  font-size: 12px;
  transform: translateY(-5px);
  margin: 0px;
  cursor: pointer;
  user-select: text !important;
}
</style>
