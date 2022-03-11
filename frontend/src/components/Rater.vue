<script setup="props" lang="ts">
import { RateRelationRequest } from '../api/RateRelationRequest';
import { RateTextRequest } from '../api/RateTextRequest';
import { useRequest } from '../api/api';
import { useState } from '../state';
import { ref } from 'vue';

const props = defineProps({
  objectType: { type: String, required: true },
  objectId: { type: String, required: true }
});

const state = useState();

let hoveredRating = ref(0);
let rating = ref(0);

function rate(i: number) {
  rating.value = i;

  if (props.objectType === 'text') {
    useRequest(RateTextRequest, {
      token: state.token?.raw as string,
      text: props.objectId,
      rating: rating.value
    });
  } else {
    useRequest(RateRelationRequest, {
      token: state.token?.raw as string,
      relation: props.objectId,
      rating: rating.value
    });
  }
}
</script>

<template>
  <div class="rater" @mouseleave="hoveredRating = 0">
    <div
      :class="[
        'rating-point',
        objectType === 'text' ? 'text-rating-point' : 'relation-rating-point',
        i <= hoveredRating ? 'hovered' : '',
        i <= rating ? 'filled' : 'empty'
      ]"
      @mouseenter="hoveredRating = i"
      @click="rate(i)"
      v-for="i in 5"
    ></div>
  </div>
</template>

<style scoped>
.rater {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 5px;
}

.rating-point {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: var(--color);
  cursor: pointer;
}

.rater:hover .rating-point.filled {
  filter: brightness(0.75);
}

.hovered {
  filter: none !important;
}

.empty {
  filter: contrast(0.25) brightness(0.75);
}

.text-rating-point {
  --color: orange;
}

.relation-rating-point {
  --color: var(--foreground-vibrant-accent);
}
</style>
