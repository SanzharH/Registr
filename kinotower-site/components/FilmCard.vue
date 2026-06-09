<script setup>
import { posterFor } from "~/utils/format";

defineProps({
  film: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <article class="film-card">
    <img :src="posterFor(film)" :alt="film.name" />
    <div>
      <NuxtLink class="film-title" :to="`/films/${film.id}`">{{ film.name }}</NuxtLink>
      <p>{{ film.year_of_issue }} · {{ film.duration }} мин · {{ film.age }}+</p>
      <p>{{ film.country?.name || "Страна не указана" }}</p>
      <div class="tags">
        <span v-for="category in film.categories" :key="category.id">{{ category.name }}</span>
      </div>
      <div class="rating-row">
        <strong>{{ Number(film.ratingAvg || 0).toFixed(1) }}/5</strong>
        <span>{{ film.reviewCount || 0 }} отзывов</span>
      </div>
    </div>
  </article>
</template>
