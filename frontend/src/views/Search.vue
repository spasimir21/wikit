<script setup lang="ts">
import TextDifficultySelector from '../components/TextDifficultySelector.vue';
import { SearchRequest, SearchResult } from '../api/SearchRequest';
import { GetDataRequest } from '../api/GetDataRequest';
import Citations from '../components/Citations.vue';
import { useRoute, useRouter } from 'vue-router';
import { reactive, Ref, ref, watch } from 'vue';
import Wikit from '../components/Wikit.vue';
import { useRequest } from '../api/api';

let structure: Ref<Exclude<SearchResult['data']['search'], undefined>> = ref(null as any);
let texts: Ref<Record<string, { wikit_title: string; text: string; difficulty: number }>> = ref({} as any);
let images: Ref<Record<string, { wikit_title: string; description: string; hash: string }>> = ref({} as any);

const router = useRouter();
const route = useRoute();

const targetTextDifficulty = ref(3);

const citations = reactive({
  texts: {},
  highlighted: null
} as any);

const {
  loading: searchLoading,
  error: searchError,
  result: searchResult,
  after: afterSearch,
  send: sendSearch
} = useRequest(SearchRequest);

const {
  loading: dataLoading,
  error: dataError,
  result: dataResult,
  after: afterData,
  send: sendData
} = useRequest(GetDataRequest);

watch(() => [route.query, targetTextDifficulty.value], updateSearch);

afterSearch((error, result) => {
  if (error || !result || result?.errors || !result?.data.search) return;
  structure.value = result.data.search;

  // Remove duplicate wikits on page
  const wikits = new Set([structure.value.wikit]);

  structure.value.sub = structure.value.sub.filter(l2 => {
    if (wikits.has(l2.wikit)) return false;
    wikits.add(l2.wikit);
    return true;
  });

  for (const l2 of structure.value.sub) {
    l2.sub = l2.sub.filter(l3 => {
      if (wikits.has(l3.wikit)) return false;
      wikits.add(l3.wikit);
      return true;
    });
  }

  // prettier-ignore
  sendData({
    texts: [structure.value.text, ...structure.value.sub.map(l2 => [l2.text, ...l2.sub.map(l3 => l3.text)]).flat()],
    images: [structure.value.image, ...structure.value.sub.map(l2 => [l2.image, ...l2.sub.map(l3 => l3.image)]).flat()].filter(image => image != null) as string[]
  });
});

afterData((error, result) => {
  if (error || !result || result.errors) return;
  texts.value = Object.fromEntries(result.data.texts.map(text => [text.uuid, text]));
  images.value = Object.fromEntries((result.data.images ?? []).map(image => [image.uuid, image]));
  document.title = `Wikit - ${texts.value[structure.value.text].wikit_title}`;
});

function onDifficultyChange(difficulty: number) {
  targetTextDifficulty.value = difficulty;
}

function updateSearch() {
  if (route.path != '/search') return;

  if (typeof route.query.q != 'string' || route.query.q.trim().length == 0) {
    router.push({ path: '/', query: {} });
    return;
  }

  citations.texts = {};
  citations.highlighted = null;

  sendSearch({
    root: route.query.root as string | undefined,
    query: route.query.q as string,
    target_text_difficulty: targetTextDifficulty.value
  });
}

updateSearch();
</script>

<template>
  <div class="search-view">
    <div class="preferred-text-difficulty-selection">
      <p>Preferred text difficulty:</p>
      <TextDifficultySelector :on-difficulty-selected="onDifficultyChange" />
    </div>
    <p v-if="searchLoading" class="loading">Searching...</p>
    <p v-else-if="dataLoading" class="loading">Loading...</p>
    <p class="error" v-else-if="searchError || !searchResult || searchResult?.errors || !searchResult?.data.search">
      {{
        searchError?.data?.errors[0].message ||
        searchResult?.errors?.[0].message ||
        (searchResult?.data && searchResult?.data.search == null
          ? 'No results found for your search!'
          : 'Request failed!')
      }}
    </p>
    <p class="error" v-else-if="dataError || !dataResult || dataResult?.errors">
      {{ dataError?.data?.errors[0].message || dataResult?.errors?.[0].message || 'Request failed!' }}
    </p>
    <div class="search-container" v-else>
      <Wikit
        :title="texts[structure.text].wikit_title"
        :text="texts[structure.text].text"
        :difficulty="texts[structure.text].difficulty"
        :level="1"
        :wikit-id="structure.wikit"
        :text-id="structure.text"
        :image="structure.image ? images[structure.image] : undefined"
        :citations="citations"
      />
      <Wikit
        v-for="level2 in structure.sub"
        :key="level2.wikit"
        :title="texts[level2.text].wikit_title"
        :text="texts[level2.text].text"
        :difficulty="texts[level2.text].difficulty"
        :level="2"
        :wikit-id="level2.wikit"
        :text-id="level2.text"
        :relation-id="level2.relation"
        :image="level2.image ? images[level2.image] : undefined"
        :citations="citations"
      >
        <template v-slot>
          <div class="indent">
            <Wikit
              v-for="level3 in level2.sub"
              :key="level3.wikit"
              :title="texts[level3.text].wikit_title"
              :text="texts[level3.text].text"
              :difficulty="texts[level3.text].difficulty"
              :level="3"
              :wikit-id="level3.wikit"
              :text-id="level3.text"
              :relation-id="level3.relation"
              :image="level3.image ? images[level3.image] : undefined"
              :citations="citations"
            />
          </div>
        </template>
      </Wikit>
      <Citations
        v-if="
          Object.keys(citations.texts)
            .map(key => Object.keys(citations.texts[key]).length)
            .some(n => n != 0)
        "
        :texts="texts"
        :citations="citations"
      />
    </div>
  </div>
</template>

<style scoped>
.search-view {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  margin-top: 20px;
  gap: 20px;
}

.preferred-text-difficulty-selection {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 10px;
  height: fit-content;
}

.preferred-text-difficulty-selection p {
  font-size: 22px;
  margin: 0px;
  font-weight: bold;
}

.search-container {
  max-width: 750px;
  width: 90%;
}

.indent {
  margin-left: 15px;
}

.loading {
  color: var(--foreground-accent);
  font-size: 20px;
}
</style>
