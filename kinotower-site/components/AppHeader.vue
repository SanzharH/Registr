<script setup>
const { initSession, isAuthed, clearSession } = useSession();
const { request } = useApi();

onMounted(initSession);

async function signout() {
  try {
    await request("/auth/signout", { method: "POST" });
  } finally {
    clearSession();
    await navigateTo("/");
  }
}
</script>

<template>
  <header class="topbar">
    <NuxtLink class="brand" to="/">Kinotower</NuxtLink>
    <nav>
      <NuxtLink to="/">Фильмы</NuxtLink>
      <NuxtLink v-if="isAuthed" to="/profile">Профиль</NuxtLink>
      <NuxtLink v-if="!isAuthed" to="/signin">Вход</NuxtLink>
      <NuxtLink v-if="!isAuthed" class="accent" to="/signup">Регистрация</NuxtLink>
      <button v-else class="accent" type="button" @click="signout">Выход</button>
    </nav>
  </header>
</template>
