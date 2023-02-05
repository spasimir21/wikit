<script setup lang="ts">
import TextDifficultyRater from './TextDifficultyRater.vue';
import { useRoute, useRouter } from 'vue-router';
import { DOMAIN, Service } from '../constants';
import WikitText from './WikitText.vue';
import { useState } from '../state';
import Rater from './Rater.vue';

const props = defineProps({
  title: { type: String, required: true },
  text: { type: String, required: true },
  difficulty: { type: Number, required: true },
  level: { type: Number, required: true },
  wikitId: { type: String, required: true },
  textId: { type: String, required: true },
  relationId: { type: String, required: false },
  image: { type: Object, required: false },
  citations: { type: Object, required: true }
});

const router = useRouter();
const route = useRoute();
const state = useState();

if (props.citations[props.textId] == null) props.citations[props.textId] = {};
</script>

<template>
  <div class="wikit">
    <div class="header" :class="[level < 3 ? 'header-high-level' : 'header-low-level']">
      <div class="header-right">
        <TextDifficultyRater :text-id="props.textId" :difficulty="props.difficulty" />
        <div class="title" @click="router.push({ path: '/search', query: { ...route.query, root: props.wikitId } })">
          <h1 v-if="level === 1">{{ title }}</h1>
          <h2 v-if="level === 2">{{ title }}</h2>
          <h3 v-if="level === 3">{{ title }}</h3>
        </div>
      </div>
      <div class="header-extra" v-if="state.token">
        <Rater object-type="text" :object-id="textId" />
        <Rater object-type="relation" :object-id="relationId" v-if="relationId" />
        <router-link :to="`/add?wikit=${wikitId}`">Add</router-link>
      </div>
    </div>
    <div class="content">
      <div class="image-content" v-if="image != null">
        <div class="image">
          <img :src="`http://${Service.IMAGE}.${DOMAIN}/${image.hash}`" />
          <Rater :class="['image-rater', state.token != null ? 'usable' : '']" object-type="image" :object-id="image.uuid" />
        </div>
        <p>
          {{ image.description }}
        </p>
      </div>
      <div class="text-content">
        <WikitText :text-id="textId" :text="text" :citations="citations[textId]" />
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<style scoped>
h1,
h2,
h3,
p {
  user-select: text !important;
}

.header {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
}

.header-right {
  display: flex;
  flex-flow: row nowrap;
  gap: 5px;
  align-items: center;
}

.header:hover .header-extra {
  display: flex;
}

.header-high-level {
  border-bottom: 1px solid var(--foreground-accent);
  margin: 0px 0px 5px 0px;
}

.header-low-level {
  border-bottom: 1px solid var(--foreground-accent);
  margin: 0px 0px 2px 0px;
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

.title {
  cursor: pointer;
}

.content {
  display: flex;
  flex-flow: row nowrap;
  gap: 20px;
}

.image-content {
  margin-top: 5px;
  display: flex;
  flex-flow: column nowrap;
  gap: 10px;
  align-items: center;
  text-align: center;
  /* justify-content: center; */
}

.image-content p {
  font-size: 14px !important;
}

.image {
  position: relative;
}

.image:hover .image-rater.usable {
  display: flex !important;
}

.image-rater {
  display: none;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%, 0%);
}

img {
  display: block;
  object-fit: contain;
  width: 200px;
}

p {
  margin: 0px 0px 15px 0px;
}

.indent {
  margin-left: 30px;
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
