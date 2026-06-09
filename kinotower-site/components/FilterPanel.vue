<script setup>
defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  countries: {
    type: Array,
    default: () => [],
  },
});

const filters = defineModel({
  type: Object,
  required: true,
});

const emit = defineEmits(["apply"]);

function apply() {
  emit("apply");
}
</script>

<template>
  <aside class="filters-panel">
    <h1>Каталог фильмов</h1>
    <label>
      Жанр
      <select v-model.number="filters.category" @change="apply">
        <option :value="0">Все жанры</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }} ({{ category.filmCount }})
        </option>
      </select>
    </label>
    <label>
      Страна
      <select v-model.number="filters.country" @change="apply">
        <option :value="0">Все страны</option>
        <option v-for="country in countries" :key="country.id" :value="country.id">
          {{ country.name }} ({{ country.filmCount }})
        </option>
      </select>
    </label>
    <label>
      Сортировка
      <select v-model="filters.sortBy" @change="apply">
        <option value="name">Название</option>
        <option value="year">Год</option>
        <option value="rating">Рейтинг</option>
      </select>
    </label>
    <div class="segmented">
      <button :class="{ active: filters.sortDir === 'asc' }" type="button" @click="filters.sortDir = 'asc'; apply()">По возрастанию</button>
      <button :class="{ active: filters.sortDir === 'desc' }" type="button" @click="filters.sortDir = 'desc'; apply()">По убыванию</button>
    </div>
  </aside>
</template>
