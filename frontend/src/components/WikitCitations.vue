<script setup lang="ts">
import { ComponentInternalInstance, getCurrentInstance, onMounted, watch } from 'vue';

const CITATION_REGEXP = /\[\s*(.*?)\s*\]\s*(.*?)\s*\-\s*(\S*)/;

const props = defineProps({
  serializedCitations: { type: String, required: true },
  citations: { type: Object, required: true }
});

const instance = getCurrentInstance() as ComponentInternalInstance;

const commentNode = document.createComment('');

function parseCitations() {
  const citations = props.serializedCitations
    .split('\n')
    .map(line => line.match(CITATION_REGEXP))
    .filter(match => match != null)
    .map(match => ({
      ref: (match as any)[1].trim(),
      title: (match as any)[2].trim(),
      url: (match as any)[3].trim()
    }))
    .filter(citation => {
      try {
        new URL(citation.url);
        return true;
      } catch (err) {
        return false;
      }
    });

  commentNode.textContent = JSON.stringify(citations);

  for (const citation of citations) {
    props.citations[citation.ref] = citation;
  }
}

onMounted(() => {
  (instance.refs.placeholder as HTMLSpanElement).replaceWith(commentNode);
});

watch(() => props.serializedCitations, parseCitations);

parseCitations();
</script>

<template>
  <span ref="placeholder"></span>
</template>
