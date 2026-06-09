<template>
  <section v-if="notice || error" class="messages">
    <p v-if="notice" class="notice">{{ notice }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </section>
</template>

<script setup>
defineProps({
  notice: {
    type: String,
    default: "",
  },
  error: {
    type: String,
    default: "",
  },
});
</script>
