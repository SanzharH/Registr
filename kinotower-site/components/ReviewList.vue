<script setup>
import { formatDate } from "~/utils/format";

defineProps({
  reviews: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <section class="reviews-block">
    <h2>Отзывы</h2>
    <article v-for="review in reviews" :key="review.id" class="review-item">
      <strong>{{ review.user?.fio }}</strong>
      <time>{{ formatDate(review.created_at) }}</time>
      <p>{{ review.message }}</p>
    </article>
    <p v-if="!reviews.length" class="empty">Отзывов пока нет.</p>
  </section>
</template>
