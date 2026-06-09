<script setup>
const { request, apiPath } = useApi();

const filters = reactive({
  page: 1,
  size: 8,
  sortBy: "name",
  sortDir: "asc",
  category: 0,
  country: 0,
});

const state = reactive({
  films: [],
  categories: [],
  countries: [],
  total: 0,
  loading: false,
  error: "",
});

const pageCount = computed(() => Math.max(1, Math.ceil(state.total / filters.size)));

async function withLoading(action) {
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

async function loadDictionaries() {
  const [categoriesData, countriesData] = await Promise.all([
    request("/categories"),
    request("/countries"),
  ]);

  state.categories = categoriesData.categories || [];
  state.countries = countriesData.countries || [];
}

async function loadFilms() {
  await withLoading(async () => {
    const params = {
      ...filters,
      category: filters.category || undefined,
      country: filters.country || undefined,
    };
    const data = await request(apiPath("/films", params));
    state.films = data.films || [];
    state.total = data.total || 0;
  });
}

function applyFilters() {
  filters.page = 1;
  loadFilms();
}

function changePage(step) {
  filters.page = Math.min(pageCount.value, Math.max(1, filters.page + step));
  loadFilms();
}

onMounted(async () => {
  await withLoading(loadDictionaries);
  await loadFilms();
});
</script>

<template>
  <main>
    <AppMessage :error="state.error" />
    <section class="home-grid">
      <FilterPanel v-model="filters" :categories="state.categories" :countries="state.countries" @apply="applyFilters" />

      <section class="catalog">
        <div class="catalog-head">
          <p>{{ state.total }} фильмов</p>
          <div class="pager">
            <button type="button" :disabled="filters.page === 1" @click="changePage(-1)">Назад</button>
            <span>{{ filters.page }} / {{ pageCount }}</span>
            <button type="button" :disabled="filters.page === pageCount" @click="changePage(1)">Вперед</button>
          </div>
        </div>

        <div class="film-grid">
          <FilmCard v-for="film in state.films" :key="film.id" :film="film" />
        </div>
      </section>
    </section>
    <LoadingBadge :show="state.loading" />
  </main>
</template>
