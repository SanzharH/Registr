<template>
  <div v-if="show" class="loader">Загрузка...</div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});
</script>
