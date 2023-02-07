<script setup lang="ts">
import { ComponentInternalInstance, getCurrentInstance, watch } from 'vue';

const CLEAR_HIGHLIGHTED_TIMEOUT = 5000;

const instance = getCurrentInstance() as ComponentInternalInstance;

const props = defineProps({
  citations: { type: Object, required: true },
  texts: { type: Object, required: true }
});

let clearHighlightedTimeout: number = -1;

watch(
  () => props.citations.highlighted as string | null,
  highlighted => {
    if (instance.refs[highlighted as any] != null)
      (instance.refs[highlighted as any] as HTMLParagraphElement[])[0].scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      });

    clearTimeout(clearHighlightedTimeout);
    clearHighlightedTimeout = -1;

    if (highlighted == null) return;
    clearHighlightedTimeout = setTimeout(() => {
      props.citations.highlighted = null;
    }, CLEAR_HIGHLIGHTED_TIMEOUT);
  }
);
</script>

<template>
  <div class="citations">
    <div class="title">
      <h3>Citations</h3>
    </div>
    <div class="texts">
      <div
        class="text"
        v-for="textId in Object.keys(citations.texts).filter(key => Object.keys(citations.texts[key]).length > 0)"
      >
        <h3>{{ texts[textId].wikit_title }}</h3>
        <div class="text-citations">
          <p
            :ref="`${textId}:${citation.ref}`"
            :class="citations.highlighted === `${textId}:${citation.ref}` ? ['highlighted'] : []"
            v-for="citation in citations.texts[textId]"
          >
            [{{ citation.ref }}] {{ citation.title }} - <a target="_blank" :href="citation.url">{{ citation.url }}</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h2,
h3,
p,
a {
  margin: 0px;
  user-select: text !important;
}

.citations {
  margin-bottom: 10px;
}

.title {
  border-bottom: 1px solid var(--foreground-accent);
}

.texts {
  display: flex;
  flex-flow: column nowrap;
  margin-top: 10px;
  gap: 10px;
}

.text-citations {
  margin-left: 10px;
}

.highlighted {
  background-color: #eaf3ff;
}
</style>
