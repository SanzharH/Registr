<script setup>
const { saveSession } = useSession();
const { request } = useApi();

const form = reactive({
  fio: "",
  email: "",
  password: "",
  birthday: "",
  gender_id: "",
});

const state = reactive({
  genders: [],
  loading: false,
  error: "",
});

async function loadGenders() {
  state.loading = true;
  state.error = "";

  try {
    const data = await request("/genders");
    state.genders = data.genders || [];
  } catch (error) {
    state.error = error.message;
  } finally {
    state.loading = false;
  }
}

async function submitSignup() {
  state.loading = true;
  state.error = "";

  try {
    const data = await request("/auth/signup", {
      method: "POST",
      body: {
        fio: form.fio,
        email: form.email,
        password: form.password,
        birthday: form.birthday,
        gender_id: Number(form.gender_id),
      },
    });
    saveSession({ token: data.token, id: data.id, fio: data.fio });
    await navigateTo("/profile");
  } catch (error) {
    state.error = error.message;
  } finally {
    state.loading = false;
  }
}

onMounted(loadGenders);
</script>

<template>
  <main>
    <AppMessage :error="state.error" />
    <section class="auth-card">
      <h1>Регистрация</h1>
      <form @submit.prevent="submitSignup">
        <label>ФИО <input v-model.trim="form.fio" minlength="2" maxlength="150" required /></label>
        <label>Email <input v-model.trim="form.email" type="email" required /></label>
        <label>Дата рождения <input v-model="form.birthday" type="date" required /></label>
        <label>
          Пол
          <select v-model.number="form.gender_id" required>
            <option disabled value="">Выберите пол</option>
            <option v-for="gender in state.genders" :key="gender.id" :value="gender.id">{{ gender.name }}</option>
          </select>
        </label>
        <label>Пароль <input v-model="form.password" type="password" minlength="6" required /></label>
        <button type="submit">Создать аккаунт</button>
      </form>
    </section>
    <LoadingBadge :show="state.loading" />
  </main>
</template>
