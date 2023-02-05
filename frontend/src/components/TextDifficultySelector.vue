<script setup="props" lang="ts">
import { computed, ref } from 'vue';

const props = defineProps({ onDifficultySelected: { type: Function, required: true } });

const hoveredDifficulty = ref(-1);
const difficulty = ref(3);

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

function selectDifficulty(difficultyRating: number) {
  difficulty.value = difficultyRating;
  props.onDifficultySelected(difficulty.value);
}

props.onDifficultySelected(3);
</script>

<template>
  <div class="text-difficulty-selector" @mouseleave="hoveredDifficulty = -1">
    <div
      :class="['star', i <= (hoveredDifficulty == -1 ? difficulty : hoveredDifficulty) ? 'hovered' : 'empty']"
      :key="i"
      v-for="i in 5"
      :style="{ backgroundColor: color }"
      @mouseenter="hoveredDifficulty = i"
      @click="selectDifficulty(i)"
    ></div>
  </div>
</template>

<style scoped>
.text-difficulty-selector {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  position: relative;
  gap: 5px;
}

.text-difficulty-selector .star {
  width: 15px;
  height: 15px;
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
