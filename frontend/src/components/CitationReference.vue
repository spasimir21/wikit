<script setup lang="ts">
const props = defineProps({
  citations: { type: Object, required: true },
  textId: { type: String, required: true },
  reference: { type: String, required: true }
});

function onClick() {
  props.citations.highlighted = `${props.textId}:${props.reference}`;
}
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
