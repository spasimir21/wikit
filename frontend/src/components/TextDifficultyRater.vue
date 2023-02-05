<script setup="props" lang="ts">
import { RateTextDifficultyRequest } from '../api/RateTextDifficultyRequest';
import { useRequest } from '../api/api';
import { computed, ref } from 'vue';
import { useState } from '../state';

const props = defineProps({
  textId: { type: String, required: true },
  difficulty: { type: Number, required: true }
});

const state = useState();

const difficulty = ref(props.difficulty);
const hoveredDifficulty = ref(-1);
const hovered = ref(false);

const color = computed(() => {
  // prettier-ignore
  switch (hoveredDifficulty.value == -1 ? difficulty.value : hoveredDifficulty.value) {
    case 1: return 'lime';
    case 2: return 'yellowgreen';
    case 3: return 'yellow';
    case 4: return 'orange';
    case 5: return 'red';
    default: return 'gray';
  }
});

function rateDifficulty(difficultyRating: number) {
  difficulty.value = difficultyRating;

  useRequest(RateTextDifficultyRequest, {
    token: state.token?.raw as string,
    text: props.textId,
    difficulty: difficulty.value
  });
}
</script>

<template>
  <div
    class="text-difficulty-rater"
    @mouseenter="hovered = true"
    @mouseleave="
      hoveredDifficulty = -1;
      hovered = false;
    "
  >
    <div class="strip" :style="{ backgroundColor: color, display: hovered && state.token ? 'none' : undefined }"></div>
    <div class="rate" :style="{ display: hovered && state.token ? 'flex' : undefined }">
      <div
        :class="['star', i <= (hoveredDifficulty == -1 ? difficulty : hoveredDifficulty) ? 'hovered' : 'empty']"
        :key="i"
        v-for="i in 5"
        :style="{ backgroundColor: color }"
        @mouseenter="hoveredDifficulty = i"
        @click="rateDifficulty(i)"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.text-difficulty-rater {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  align-self: stretch;
  margin-bottom: 5px;
  position: relative;
}

.strip {
  width: 5px;
  height: 100%;
}

.rate {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 5px;
  display: none;
  padding-right: 5px;
}

.rate .star {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background-color: gray;
  cursor: pointer;
}

.hovered {
  filter: none !important;
}

.empty {
  filter: contrast(0.25) brightness(0.75);
}
</style>
