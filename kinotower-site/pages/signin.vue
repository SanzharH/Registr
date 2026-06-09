<script setup>
const { initSession, saveSession } = useSession();
const { request } = useApi();

const form = reactive({
  email: "",
  password: "",
});

const state = reactive({
  loading: false,
  error: "",
});

onMounted(initSession);

async function submitSignin() {
  state.error = "";
  state.loading = true;

  try {
    const data = await request("/auth/signin", {
      method: "POST",
      body: { email: form.email, password: form.password },
    });
    saveSession({ token: data.token, id: data.id, fio: data.fio });
    await navigateTo("/profile");
  } catch (error) {
    state.error = error.message;
  } finally {
    state.loading = false;
  }
}
</script>

<template>
  <main>
    <AppMessage :error="state.error" />
    <section class="auth-card">
      <h1>Вход</h1>
      <form @submit.prevent="submitSignin">
        <label>Email <input v-model.trim="form.email" type="email" required /></label>
        <label>Пароль <input v-model="form.password" type="password" minlength="6" required /></label>
        <button type="submit">Войти</button>
      </form>
    </section>
    <LoadingBadge :show="state.loading" />
  </main>
</template>
