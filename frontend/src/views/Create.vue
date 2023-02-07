<script setup lang="ts">
import TextDifficultySelector from '../components/TextDifficultySelector.vue';
import { CreateWikitRequest } from '../api/CreateWikitRequest';
import { FindWikitsRequest } from '../api/FindWikitsRequest';
import WikitText from '../components/WikitText.vue';
import { reactive, ref, Ref } from 'vue';
import { useRequest } from '../api/api';
import { useRouter } from 'vue-router';
import { useState } from '../state';
import { id } from '../utils';

const { loading, result, error, send, after } = useRequest(CreateWikitRequest);
const router = useRouter();
const state = useState();

if (state.token == null) router.push('/login');

interface Relation {
  id: string;
  title: string;
  uuid: string | null;
  valid: boolean;
  loading: Ref<boolean>;
}

const form = reactive({
  title: '',
  text: '',
  parent: '',
  child: '',
  parents: [] as Relation[],
  children: [] as Relation[]
});

const textDifficulty = ref(3);

function createWikit() {
  send({
    token: state.token?.raw as string,
    title: form.title,
    text: form.text,
    text_difficulty: textDifficulty.value,
    parents: form.parents.filter(parent => parent.valid).map(parent => parent.uuid as string),
    children: form.children.filter(child => child.valid).map(child => child.uuid as string)
  });
}

after((error, result) => {
  if (error || !result || result.errors) return;
  router.push('/');
});

function addParent() {
  if (form.parent.trim().length == 0) return;
  const { loading, after } = useRequest(FindWikitsRequest, { title: form.parent });

  const parent: Relation = {
    id: id(),
    title: form.parent,
    uuid: null,
    valid: false,
    loading
  };

  form.parents.push(parent as any);

  after((error, result) => {
    if (error || !result || result.errors || result.data.wikit == null) return;
    parent.uuid = result.data.wikit.uuid;
    parent.valid = true;
  });

  form.parent = '';
}

function removeParent(parent: Relation) {
  if (parent.loading) return;

  const index = form.parents.findIndex(p => parent.id == p.id);
  form.parents.splice(index, 1);
}

function addChild() {
  if (form.child.trim().length == 0) return;
  const { loading, after } = useRequest(FindWikitsRequest, { title: form.child });

  const child: Relation = {
    id: id(),
    title: form.child,
    uuid: null,
    valid: false,
    loading
  };

  form.children.push(child as any);

  after((error, result) => {
    if (error || !result || result.data.wikit == null) return;
    child.uuid = result.data.wikit.uuid;
    child.valid = true;
  });

  form.child = '';
}

function removeChild(child: Relation) {
  if (child.loading) return;

  const index = form.children.findIndex(c => child.id == c.id);
  form.children.splice(index, 1);
}
</script>

<template>
  <div class="create-view">
    <div class="create-container">
      <div class="section">
        <h1 class="section-header">Wikit</h1>
        <input type="text" placeholder="Title" class="title-input" v-model="form.title" />
      </div>
      <div class="section">
        <h1 class="section-header">Text</h1>
        <textarea class="text-input" placeholder="Explain the theme in 3-4 sentences" v-model="form.text"></textarea>
        <p style="font-size: 20px; margin: 0px">Text preview:</p>
        <WikitText text-id="" :citations="{ texts: {}, highlighted: null }" :text="form.text" />
        <div class="text-difficulty-selection">
          <p>Text difficulty:</p>
          <TextDifficultySelector :on-difficulty-selected="(difficulty: number) => (textDifficulty = difficulty)" />
        </div>
      </div>
      <div class="section">
        <h1 class="section-header">Parents</h1>
        <div class="relations">
          <p
            class="relation"
            v-for="parent in form.parents"
            :key="parent.id"
            :style="{
              cursor: parent.loading ? 'default' : 'pointer',
              color: parent.loading
                ? 'var(--foreground-accent)'
                : parent.valid
                ? 'var(--foreground-vibrant-accent)'
                : 'var(--foreground-error-accent)'
            }"
            @click="removeParent(parent as any)"
          >
            {{ parent.title }}
          </p>
        </div>
        <div class="add-relation">
          <input type="text" placeholder="Parent Wikit" class="relation-input" v-model="form.parent" />
          <button class="relation-button" @click="addParent">Add Parent</button>
        </div>
      </div>
      <div class="section">
        <h1 class="section-header">Children</h1>
        <div class="relations">
          <p
            class="relation"
            v-for="child in form.children"
            :key="child.id"
            :style="{
              cursor: child.loading ? 'default' : 'pointer',
              color: child.loading
                ? 'var(--foreground-accent)'
                : child.valid
                ? 'var(--foreground-vibrant-accent)'
                : 'var(--foreground-error-accent)'
            }"
            @click="removeChild(child as any)"
          >
            {{ child.title }}
          </p>
        </div>
        <div class="add-relation">
          <input type="text" placeholder="Child Wikit" class="relation-input" v-model="form.child" />
          <button class="relation-button" @click="addChild" style="width: 121px">Add Child</button>
        </div>
      </div>
      <p v-if="error != null || result?.errors" class="error">
        {{ result?.errors?.[0].message || error?.data?.errors[0].message || 'Request failed!' }}
      </p>
      <button class="create-button" :disabled="loading" @click="createWikit">Create</button>
    </div>
  </div>
</template>

<style scoped>
.create-view {
  margin-top: 50px;
  flex-grow: 1;
  display: grid;
  justify-items: center;
}

.create-container {
  display: flex;
  flex-flow: column nowrap;
  max-width: 750px;
  width: 90%;
}

.section {
  margin-bottom: 10px;
}

.section-header {
  margin: 0px 0px 10px 0px;
}

.title-input {
  font-size: 20px;
  width: 100%;
}

.text-input {
  width: 100%;
  resize: vertical;
  border: 1px solid var(--foreground-accent);
  outline: none;
  border-radius: 10px;
  padding: 5px 10px 5px 7px;
  font-size: 18px;
}

.text-difficulty-selection {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 10px;
  height: fit-content;
  margin-top: 5px;
}

.text-difficulty-selection p {
  font-size: 20px;
  margin: 0px;
}

.create-button {
  align-self: center;
  font-size: 18px;
  margin-top: 10px;
}

.add-relation {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.relation-input {
  font-size: 18px;
  flex-grow: 1;
}

.relation-button {
  font-size: 16px;
}

.relations {
  display: flex;
  flex-flow: column nowrap;
}

.relation {
  font-weight: normal;
  font-size: 24px;
  margin: 0px 0px 10px 0px;
}

.error {
  align-self: center;
}
</style>
