<script setup lang="ts">
import { MathJaxConfig } from '../constants';
import { watch, onMounted, ref } from 'vue';

const props = defineProps({
  formula: { type: String, required: true }
});

const displayLatexElement = ref(null as any);

function renderLaTeX() {
  if (!(window as any).MathJax.Hub.config.$wikitConfig) (window as any).MathJax.Hub.Config(MathJaxConfig);

  const tempSpan = document.createElement('span');
  tempSpan.textContent = props.formula;

  (window as any).MathJax.Hub.Queue(['Typeset', (window as any).MathJax.Hub, tempSpan], () => {
    if (displayLatexElement.value == null) return;

    for (const child of Array.from(displayLatexElement.value.childNodes)) {
      (child as any).remove();
    }

    for (const child of Array.from(tempSpan.childNodes)) {
      displayLatexElement.value.appendChild(child);
    }

    tempSpan.remove();
  });
}

watch(() => props.formula, renderLaTeX);

onMounted(renderLaTeX);
</script>

<template>
  <span ref="displayLatexElement"></span>
</template>
