<script setup lang="ts">
import { useState } from '../state';
import Rater from './Rater.vue';

defineProps({
  title: { type: String, required: true },
  text: { type: String, required: true },
  level: { type: Number, required: true },
  wikitId: { type: String, required: true },
  textId: { type: String, required: true },
  relationId: { type: String, required: false }
});

const state = useState();
</script>

<template>
  <div class="wikit">
    <div class="header" :class="[level < 3 ? 'header-high-level' : 'header-low-level']">
      <h1 v-if="level === 1">{{ title }}</h1>
      <h2 v-if="level === 2">{{ title }}</h2>
      <h3 v-if="level === 3">{{ title }}</h3>
      <div class="header-extra" v-if="state.token">
        <Rater object-type="text" :object-id="textId" />
        <Rater object-type="relation" :object-id="relationId" v-if="relationId" />
        <router-link :to="`/add?wikit=${wikitId}`">Add</router-link>
      </div>
    </div>
    <p>{{ text }}</p>
    <slot></slot>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
}

.header:hover .header-extra {
  display: flex;
}

.header-high-level {
  border-bottom: 1px solid var(--foreground-accent);
  margin: 0px 0px 5px 0px;
}

h1,
h2,
h3 {
  margin: 0px;
}

h3 {
  color: var(--foreground-accent);
  font-weight: normal;
}

p {
  margin: 0px 0px 15px 0px;
}

.indent {
  margin-left: 15px;
}

.header-extra {
  display: none;
  flex-flow: row nowrap;
  align-items: center;
  gap: 20px;
}

.header-extra a {
  font-size: 18px;
}
</style>
