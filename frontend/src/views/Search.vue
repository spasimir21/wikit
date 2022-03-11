<script setup lang="ts">
import { GetWikitsAndTextsRequest } from '../api/GetWikitsAndTextsRequest';
import { SearchRequest, SearchResult } from '../api/SearchRequest';
import Wikit from '../components/Wikit.vue';
import { useRequest } from '../api/api';
import { useRoute } from 'vue-router';
import { watch } from 'vue';

let structure: Exclude<SearchResult['data']['search'], undefined>;
let wikits: Record<string, string>;
let texts: Record<string, string>;

const route = useRoute();

const {
  loading: searchLoading,
  error: searchError,
  result: searchResult,
  after: afterSearch,
  send: sendSearch
} = useRequest(SearchRequest, { query: route.query.q as string });

const {
  loading: dataLoading,
  error: dataError,
  result: dataResult,
  after: afterData,
  send: sendData
} = useRequest(GetWikitsAndTextsRequest);

watch(
  () => route.query.q,
  () => sendSearch({ query: route.query.q as string })
);

afterSearch((error, result) => {
  if (error || !result || result?.errors || !result?.data.search) return;
  structure = result.data.search;

  sendData({
    wikits: [structure.wikit, ...structure.sub.map(l2 => [l2.wikit, ...l2.sub.map(l3 => l3.wikit)]).flat()],
    texts: [structure.text, ...structure.sub.map(l2 => [l2.text, ...l2.sub.map(l3 => l3.text)]).flat()]
  });
});

afterData((error, result) => {
  if (error || !result || result.errors) return;
  wikits = Object.fromEntries(result.data.wikits.map(wikit => [wikit.uuid, wikit.title]));
  texts = Object.fromEntries(result.data.texts.map(text => [text.uuid, text.text]));
  document.title = `Wikit - ${wikits[structure.wikit]}`;
});
</script>

<template>
  <div class="search-view">
    <p v-if="searchLoading" class="loading">Searching...</p>
    <p v-else-if="dataLoading" class="loading">Loading...</p>
    <p class="error" v-else-if="searchError || !searchResult || searchResult?.errors || !searchResult?.data.search">
      {{
        searchError?.data?.errors[0].message ||
        searchResult?.errors?.[0].message ||
        (searchResult?.data && searchResult?.data.search == null ? 'No results found for your search!' : 'Request failed!')
      }}
    </p>
    <p class="error" v-else-if="dataError || !dataResult || dataResult?.errors">
      {{ dataError?.data?.errors[0].message || dataResult?.errors?.[0].message || 'Request failed!' }}
    </p>
    <div class="search-container" v-else>
      <Wikit
        :title="wikits[structure.wikit]"
        :text="texts[structure.text]"
        :level="1"
        :wikit-id="structure.wikit"
        :text-id="structure.text"
      />
      <Wikit
        v-for="level2 in structure.sub"
        :key="level2.wikit"
        :title="wikits[level2.wikit]"
        :text="texts[level2.text]"
        :level="2"
        :wikit-id="level2.wikit"
        :text-id="level2.text"
        :relation-id="level2.relation"
      >
        <template v-slot>
          <div class="indent">
            <Wikit
              v-for="level3 in level2.sub"
              :key="level3.wikit"
              :title="wikits[level3.wikit]"
              :text="texts[level3.text]"
              :level="3"
              :wikit-id="level3.wikit"
              :text-id="level3.text"
              :relation-id="level3.relation"
            />
          </div>
        </template>
      </Wikit>
    </div>
  </div>
</template>

<style scoped>
.search-view {
  min-height: calc(100vh - var(--navbar-height) - 15px);
  display: grid;
  justify-items: center;
  margin-top: calc(var(--navbar-height) + 15px);
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
