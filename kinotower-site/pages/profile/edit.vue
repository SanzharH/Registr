<script setup>
const { initSession, session } = useSession();
const { request } = useApi();

const form = reactive({
  fio: "",
  email: "",
  birthday: "",
  gender_id: "",
});

const state = reactive({
  genders: [],
  loading: false,
  notice: "",
  error: "",
});

async function loadData() {
  initSession();

  if (!session.value?.id) {
    await navigateTo("/signin");
    return;
  }

  state.loading = true;
  state.error = "";

  try {
    const [profileData, gendersData] = await Promise.all([
      request(`/users/${session.value.id}`),
      request("/genders"),
    ]);

    form.fio = profileData.fio || "";
    form.email = profileData.email || "";
    form.birthday = profileData.birthday || "";
    form.gender_id = profileData.gender?.id || "";
    state.genders = gendersData.genders || [];
  } catch (error) {
    state.error = error.message;
  } finally {
    state.loading = false;
  }
}

async function updateProfile() {
  state.loading = true;
  state.notice = "";
  state.error = "";

  try {
    await request("/users", {
      method: "PUT",
      body: {
        fio: form.fio,
        email: form.email,
        birthday: form.birthday,
        gender_id: Number(form.gender_id),
      },
    });
    state.notice = "Профиль обновлен.";
    await navigateTo("/profile");
  } catch (error) {
    state.error = error.message;
  } finally {
    state.loading = false;
  }
}

onMounted(loadData);
</script>

<template>
  <main>
    <AppMessage :notice="state.notice" :error="state.error" />
    <section class="auth-card">
      <h1>Редактирование профиля</h1>
      <form @submit.prevent="updateProfile">
        <label>ФИО <input v-model.trim="form.fio" minlength="2" maxlength="150" /></label>
        <label>Email <input v-model.trim="form.email" type="email" /></label>
        <label>Дата рождения <input v-model="form.birthday" type="date" /></label>
        <label>
          Пол
          <select v-model.number="form.gender_id">
            <option v-for="gender in state.genders" :key="gender.id" :value="gender.id">{{ gender.name }}</option>
          </select>
        </label>
        <button type="submit">Сохранить</button>
      </form>
    </section>
    <LoadingBadge :show="state.loading" />
  </main>
</template>
