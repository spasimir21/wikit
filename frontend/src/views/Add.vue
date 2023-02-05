<script setup lang="ts">
import TextDifficultySelector from '../components/TextDifficultySelector.vue';
import { AddDataArgs, AddDataRequest } from '../api/AddDataRequest';
import { UploadImageRequest } from '../api/UploadImageRequest';
import { FindWikitsRequest } from '../api/FindWikitsRequest';
import { GetWikitRequest } from '../api/GetWikitRequest';
import WikitText from '../components/WikitText.vue';
import { useRouter, useRoute } from 'vue-router';
import { reactive, ref, Ref } from 'vue';
import { useRequest } from '../api/api';
import { useState } from '../state';
import { id } from '../utils';

const { loading, result, error, send, after } = useRequest(AddDataRequest);
const router = useRouter();
const route = useRoute();
const state = useState();

const {
  loading: titleLoading,
  result: titleResult,
  error: titleError,
  after: afterTitle
} = useRequest(GetWikitRequest, { wikit: route.query.wikit as string });

if (state.token == null) router.push('/login');

afterTitle((error, result) => {
  if (error || !result || result.errors || !result.data.wikit) {
    router.push('/');
    return;
  }

  document.title = ` Wikit - Add - ${result.data.wikit.title}`;
});

interface Relation {
  id: string;
  title: string;
  uuid: string | null;
  valid: boolean;
  loading: Ref<boolean>;
}

const form = reactive({
  text: {
    text: '',
    difficulty: 3
  },
  relations: {
    parent: '',
    child: '',
    parents: [] as Relation[],
    children: [] as Relation[]
  },
  image: {
    dataUrl: null as string | null,
    file: null as File | null,
    description: ''
  }
});

function addData() {
  const sendAddData = (image_hash?: string) => {
    const requestArgs: AddDataArgs = {
      token: state.token?.raw as string,
      wikit: route.query.wikit as string,
      relations: {
        parents: form.relations.parents.filter(parent => parent.valid).map(parent => parent.uuid as string),
        children: form.relations.children.filter(child => child.valid).map(child => child.uuid as string)
      }
    };

    if (form.text.text.trim().length >= 10) {
      requestArgs.text = {
        text: form.text.text.trim(),
        difficulty: form.text.difficulty
      };
    }

    if (image_hash) {
      requestArgs.image = {
        hash: image_hash,
        description: form.image.description.trim()
      };
    }

    send(requestArgs);
  };

  if (form.image.file == null || form.image.dataUrl == null || form.image.description.trim().length <= 10) {
    if (form.relations.children.length > 0 || form.relations.parents.length > 0 || form.text.text.trim().length >= 10)
      sendAddData();
    return;
  }

  const { after: afterUpload } = useRequest(UploadImageRequest, {
    token: state.token?.raw as string,
    image: form.image.file as File
  });

  afterUpload((error, result) => {
    if (error || !result?.hash) return;
    sendAddData(result?.hash);
  });
}

after((error, result) => {
  if (error || !result || result.errors) return;
  router.push('/');
});

function addParent() {
  const parentName = form.relations.parent.trim();

  if (parentName.length == 0) return;
  const { loading, after } = useRequest(FindWikitsRequest, { title: parentName });

  const parent: Relation = {
    id: id(),
    title: parentName,
    uuid: null,
    valid: false,
    loading
  };

  form.relations.parents.push(parent as any);

  after((error, result) => {
    if (error || !result || result.errors || result.data.wikit == null) return;
    parent.uuid = result.data.wikit.uuid;
    parent.valid = true;
  });

  form.relations.parent = '';
}

function removeParent(parent: Relation) {
  if (parent.loading) return;

  const index = form.relations.parents.findIndex(p => parent.id == p.id);
  form.relations.parents.splice(index, 1);
}

function addChild() {
  const childName = form.relations.child.trim();

  if (childName.length == 0) return;
  const { loading, after } = useRequest(FindWikitsRequest, { title: childName });

  const child: Relation = {
    id: id(),
    title: childName,
    uuid: null,
    valid: false,
    loading
  };

  form.relations.children.push(child as any);

  after((error, result) => {
    if (error || !result || result.data.wikit == null) return;
    child.uuid = result.data.wikit.uuid;
    child.valid = true;
  });

  form.relations.child = '';
}

function removeChild(child: Relation) {
  if (child.loading) return;

  const index = form.relations.children.findIndex(c => child.id == c.id);
  form.relations.children.splice(index, 1);
}

function openImageSelect() {
  const fileInput = document.createElement('input');
  fileInput.accept = 'image/*';
  fileInput.type = 'file';
  fileInput.click();

  fileInput.addEventListener('change', selectImage, { once: true });
}

function selectImage(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = (input.files as FileList)[0];
  if (file == null) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.addEventListener(
    'load',
    () => {
      if (typeof reader.result != 'string') return;
      form.image.dataUrl = reader.result as string;
      form.image.file = file;
    },
    { once: true }
  );
}
</script>

<template>
  <div class="create-view">
    <p v-if="titleLoading">Loading...</p>
    <p class="error" v-else-if="titleError || !titleResult || titleResult.errors || !titleResult.data.wikit">
      {{
        titleError?.data?.errors[0].message ||
        titleResult?.errors?.[0].message ||
        (titleResult && titleResult?.data.wikit == null ? 'Wikit not found!' : 'Request failed!')
      }}
    </p>
    <div class="add-container" v-else>
      <div class="add-forms">
        <div class="add-empty-form"></div>
        <div class="add-main-forum">
          <div class="section">
            <h1 class="section-header">Wikit</h1>
            <input type="text" placeholder="Title" class="title-input" :value="titleResult?.data.wikit?.title" disabled />
          </div>
          <div class="section">
            <h1 class="section-header">Text</h1>
            <textarea class="text-input" placeholder="Explain the theme in 3-4 sentences" v-model="form.text.text"></textarea>
            <p style="font-size: 20px; margin: 0px">Text preview:</p>
            <WikitText text-id="" :citations="{}" :text="form.text.text" />
            <div class="text-difficulty-selection">
              <p>Text difficulty:</p>
              <TextDifficultySelector :on-difficulty-selected="(difficulty: number) => (form.text.difficulty = difficulty)" />
            </div>
          </div>
          <div class="section">
            <h1 class="section-header">Parents</h1>
            <div class="relations">
              <p
                class="relation"
                v-for="parent in form.relations.parents"
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
              <input type="text" placeholder="Parent Wikit" class="relation-input" v-model="form.relations.parent" />
              <button class="relation-button" @click="addParent">Add Parent</button>
            </div>
          </div>
          <div class="section">
            <h1 class="section-header">Children</h1>
            <div class="relations">
              <p
                class="relation"
                v-for="child in form.relations.children"
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
              <input type="text" placeholder="Child Wikit" class="relation-input" v-model="form.relations.child" />
              <button class="relation-button" @click="addChild" style="width: 121px">Add Child</button>
            </div>
          </div>
        </div>
        <div class="add-image-form">
          <div class="section">
            <h1 class="section-header">Image</h1>
            <div
              class="image-select"
              @click="openImageSelect"
              :style="{ backgroundColor: form.image.dataUrl == null ? undefined : 'white' }"
            >
              <img v-if="form.image.dataUrl != null" :src="form.image.dataUrl" />
              <p v-else>Click to upload an image</p>
            </div>
          </div>
          <div class="section">
            <h1 class="section-header">Description</h1>
            <textarea
              class="text-input image-description-input"
              placeholder="A quick description of the image"
              v-model="form.image.description"
            ></textarea>
          </div>
        </div>
      </div>
      <p v-if="error != null || result?.errors" class="error">
        {{ result?.errors?.[0].message || error?.data?.errors[0].message || 'Request failed!' }}
      </p>
      <button class="create-button" :disabled="loading" @click="addData">Add</button>
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

.add-container {
  display: flex;
  flex-flow: column nowrap;
  width: 90%;
}

.add-forms {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: stretch;
  gap: 20px;
}

.add-main-forum {
  width: 100%;
  max-width: 750px;
}

.add-image-form {
  width: 100%;
  max-width: 300px;
  position: relative;
}

.image-select {
  border: 1px solid black;
  width: 100%;
  aspect-ratio: 1;
  background-color: rgb(240, 240, 240);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.image-select p {
  text-align: center;
  font-size: 20px;
}

.image-select img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.image-description-input {
  position: absolute;
}

.add-empty-form {
  width: 100%;
  max-width: 300px;
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
