<script setup>
import { posterFor } from "~/utils/format";

const route = useRoute();
const { initSession, isAuthed, session } = useSession();
const { request } = useApi();

const filmId = computed(() => Number(route.params.id));

const state = reactive({
  film: null,
  reviews: [],
  loading: false,
  notice: "",
  error: "",
});

const reviewForm = reactive({ message: "" });
const ratingForm = reactive({ ball: 5 });

async function withLoading(action) {
  state.notice = "";
  state.error = "";
  state.loading = true;

  try {
    await action();
  } catch (error) {
    state.error = error.message;
  } finally {
    state.loading = false;
  }
}

async function loadFilm() {
  await withLoading(async () => {
    const [filmData, reviewsData] = await Promise.all([
      request(`/films/${filmId.value}`),
      request(`/films/${filmId.value}/reviews`),
    ]);

    state.film = filmData;
    state.reviews = reviewsData.reviews || [];
  });
}

async function createReview() {
  await withLoading(async () => {
    await request(`/users/${session.value.id}/reviews`, {
      method: "POST",
      body: { film_id: filmId.value, message: reviewForm.message },
    });
    reviewForm.message = "";
    state.notice = "Отзыв отправлен на модерацию.";
    await loadFilm();
  });
}

async function createRating() {
  await withLoading(async () => {
    await request(`/users/${session.value.id}/ratings`, {
      method: "POST",
      body: { film_id: filmId.value, ball: Number(ratingForm.ball) },
    });
    state.notice = "Оценка сохранена.";
    await loadFilm();
  });
}

onMounted(async () => {
  initSession();
  await loadFilm();
});
</script>

<template>
  <main>
    <AppMessage :notice="state.notice" :error="state.error" />
    <section v-if="state.film" class="film-page">
      <img class="poster" :src="posterFor(state.film)" :alt="state.film.name" />
      <div class="film-details">
        <NuxtLink class="ghost-link" to="/">К каталогу</NuxtLink>
        <h1>{{ state.film.name }}</h1>
        <p class="lead">{{ state.film.year_of_issue }} · {{ state.film.duration }} мин · {{ state.film.age }}+</p>
        <div class="meta-list">
          <span>{{ state.film.country?.name }}</span>
          <span v-for="category in state.film.categories" :key="category.id">{{ category.name }}</span>
        </div>
        <div class="score-panel">
          <strong>{{ Number(state.film.ratingAvg || 0).toFixed(1) }}</strong>
          <span>средняя оценка</span>
          <span>{{ state.film.reviewCount || 0 }} отзывов</span>
        </div>
        <div class="actions">
          <a v-if="state.film.link_video" :href="state.film.link_video" target="_blank" rel="noreferrer">Трейлер</a>
          <a v-if="state.film.link_kinopoisk" :href="state.film.link_kinopoisk" target="_blank" rel="noreferrer">Кинопоиск</a>
        </div>

        <div v-if="isAuthed" class="interaction-panel">
          <form @submit.prevent="createRating">
            <label>
              Оценка
              <input v-model.number="ratingForm.ball" min="1" max="5" type="number" />
            </label>
            <button type="submit">Оценить</button>
          </form>
          <form @submit.prevent="createReview">
            <label>
              Отзыв
              <textarea v-model.trim="reviewForm.message" minlength="4" maxlength="1024" required placeholder="Ваш отзыв"></textarea>
            </label>
            <button type="submit">Отправить</button>
          </form>
        </div>
      </div>

      <ReviewList :reviews="state.reviews" />
    </section>
    <LoadingBadge :show="state.loading" />
  </main>
</template>
