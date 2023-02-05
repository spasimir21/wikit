<script setup="props" lang="ts">
import { RateRelationRequest } from '../api/RateRelationRequest';
import { RateImageRequest } from '../api/RateImageRequest';
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

  // prettier-ignore
  const request =
      props.objectType === 'text' ? RateTextRequest
    : props.objectType === 'relation' ? RateRelationRequest
    : RateImageRequest;

  useRequest(request, {
    token: state.token?.raw as string,
    object: props.objectId,
    rating: rating.value
  });
}
</script>

<template>
  <div class="rater" @mouseleave="hoveredRating = 0">
    <div
      :key="i"
      :class="[
        'rating-point',
        `${objectType}-rating-point`,
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

.text-rating-point,
.image-rating-point {
  --color: orange;
}

.relation-rating-point {
  --color: var(--foreground-vibrant-accent);
}
</style>
