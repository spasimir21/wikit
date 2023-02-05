<script setup lang="ts">
import { FindWikitsRequest } from '../api/FindWikitsRequest';
import { useRequest } from '../api/api';
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';

const props = defineProps({
  wikitTitle: { type: String, required: true }
});

const wikitUUID = ref<null | string>(null);
const route = useRoute();

const { loading, after, send } = useRequest(FindWikitsRequest, { title: props.wikitTitle });

after((error, result) => {
  if (error || !result || result.errors || result.data.wikit == null) return;
  wikitUUID.value = result.data.wikit.uuid;
});

function onClick() {
  if (wikitUUID.value == null) return;

  const urlQuery = new URLSearchParams({ q: props.wikitTitle, root: wikitUUID.value });
  const url = `${window.location.origin}/search?${urlQuery}`;

  window.open(url, '_blank');
}

watch(
  () => props.wikitTitle,
  () => send({ title: props.wikitTitle })
);
</script>

<template>
  <span
    @click="onClick"
    :style="{
      cursor: loading || wikitUUID == null ? 'default' : 'pointer',
      color: loading
        ? 'var(--foreground-accent)'
        : wikitUUID != null
        ? 'var(--foreground-vibrant-accent)'
        : 'var(--foreground-error-accent)'
    }"
    >{{ wikitTitle }}</span
  >
</template>

<style scoped></style>
