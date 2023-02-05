<script setup lang="ts">
const props = defineProps({
  citations: { type: Object, required: true },
  texts: { type: Object, required: true }
});
</script>

<template>
  <div class="citations">
    <div class="title">
      <h3>Citations</h3>
    </div>
    <div class="texts">
      <div
        class="text"
        v-for="textId in Object.keys(props.citations).filter(key => Object.keys(props.citations[key]).length > 0)"
      >
        <h3>{{ texts[textId].wikit_title }}</h3>
        <div class="text-citations">
          <p v-for="citation in props.citations[textId]">
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
</style>
