<script setup>
import { formatDate } from "~/utils/format";

const { initSession, session, clearSession } = useSession();
const { request } = useApi();

const state = reactive({
  profile: null,
  reviews: [],
  ratings: [],
  tab: "reviews",
  loading: false,
  error: "",
});

async function loadProfile() {
  initSession();

  if (!session.value?.id) {
    await navigateTo("/signin");
    return;
  }

  state.loading = true;
  state.error = "";

  try {
    const [profileData, reviewsData, ratingsData] = await Promise.all([
      request(`/users/${session.value.id}`),
      request(`/users/${session.value.id}/reviews`),
      request(`/users/${session.value.id}/ratings`),
    ]);

    state.profile = profileData;
    state.reviews = reviewsData.reviews || [];
    state.ratings = ratingsData.ratings || [];
  } catch (error) {
    state.error = error.message;
  } finally {
    state.loading = false;
  }
}

async function deleteProfile() {
  if (!confirm("Удалить аккаунт?")) {
    return;
  }

  state.loading = true;

  try {
    await request("/users", { method: "DELETE" });
    clearSession();
    await navigateTo("/");
  } catch (error) {
    state.error = error.message;
  } finally {
    state.loading = false;
  }
}

async function removeReview(id) {
  state.loading = true;

  try {
    await request(`/users/${session.value.id}/reviews/${id}`, { method: "DELETE" });
    await loadProfile();
  } catch (error) {
    state.error = error.message;
  } finally {
    state.loading = false;
  }
}

async function removeRating(id) {
  state.loading = true;

  try {
    await request(`/users/${session.value.id}/ratings/${id}`, { method: "DELETE" });
    await loadProfile();
  } catch (error) {
    state.error = error.message;
  } finally {
    state.loading = false;
  }
}

onMounted(loadProfile);
</script>

<template>
  <main>
    <AppMessage :error="state.error" />
    <section v-if="state.profile" class="profile-page">
      <div class="profile-head">
        <div>
          <h1>{{ state.profile.fio }}</h1>
          <p>{{ state.profile.email }}</p>
          <p>{{ formatDate(state.profile.birthday) }} · {{ state.profile.gender?.name }}</p>
        </div>
        <div class="profile-actions">
          <NuxtLink to="/profile/edit">Редактировать</NuxtLink>
          <button class="danger" type="button" @click="deleteProfile">Удалить</button>
        </div>
      </div>
      <div class="stats">
        <span>{{ state.profile.reviewCount }} отзывов</span>
        <span>{{ state.profile.ratingCount }} оценок</span>
      </div>
      <div class="tabs">
        <button :class="{ active: state.tab === 'reviews' }" type="button" @click="state.tab = 'reviews'">Отзывы</button>
        <button :class="{ active: state.tab === 'ratings' }" type="button" @click="state.tab = 'ratings'">Оценки</button>
      </div>
      <div v-if="state.tab === 'reviews'" class="list-panel">
        <article v-for="review in state.reviews" :key="review.id">
          <strong>{{ review.film?.name }}</strong>
          <span>{{ review.is_approved ? "одобрен" : "на модерации" }}</span>
          <p>{{ review.message }}</p>
          <button type="button" @click="removeReview(review.id)">Удалить</button>
        </article>
      </div>
      <div v-else class="list-panel">
        <article v-for="rating in state.ratings" :key="rating.id">
          <strong>{{ rating.film?.name }}</strong>
          <span>{{ rating.score }}/5</span>
          <button type="button" @click="removeRating(rating.id)">Удалить</button>
        </article>
      </div>
    </section>
    <LoadingBadge :show="state.loading" />
  </main>
</template>
