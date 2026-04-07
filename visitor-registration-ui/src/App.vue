<script setup>
import { computed, onMounted, reactive } from "vue";
import api from "./api";

const roles = ["Operator", "Admin"];

const form = reactive({
  fullName: "",
  documentNumber: "",
  employeeId: "",
  purpose: "",
});

const state = reactive({
  selectedRole: "Operator",
  employees: [],
  currentVisitors: [],
  searchText: "",
  visitorHints: [],
  isSubmitting: false,
  isLoadingEmployees: false,
  isLoadingCurrent: false,
  isSearching: false,
  message: "",
  error: "",
});

const reportUrl = computed(() => {
  const query = state.searchText.trim();
  if (!query) {
    return `${api.defaults.baseURL}/visits/export`;
  }

  return `${api.defaults.baseURL}/visits/export?query=${encodeURIComponent(query)}`;
});

const isAdmin = computed(() => state.selectedRole === "Admin");

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("ru-RU");
}

function resetAlerts() {
  state.message = "";
  state.error = "";
}

async function loadEmployees() {
  state.isLoadingEmployees = true;

  try {
    const { data } = await api.get("/employees");
    state.employees = data;
  } catch {
    state.error = "Не удалось загрузить список сотрудников.";
  } finally {
    state.isLoadingEmployees = false;
  }
}

async function loadCurrentVisitors() {
  state.isLoadingCurrent = true;

  try {
    const { data } = await api.get("/visits/current");
    state.currentVisitors = data;
  } catch {
    state.error = "Не удалось загрузить текущих посетителей.";
  } finally {
    state.isLoadingCurrent = false;
  }
}

async function registerVisit() {
  resetAlerts();
  state.isSubmitting = true;

  try {
    const payload = {
      fullName: form.fullName,
      documentNumber: form.documentNumber,
      employeeId: Number(form.employeeId),
      purpose: form.purpose,
    };

    const { data } = await api.post("/visits", payload);
    state.message = `Посетитель зарегистрирован. Пропуск: ${data.passNumber}`;
    form.fullName = "";
    form.documentNumber = "";
    form.employeeId = "";
    form.purpose = "";
    state.visitorHints = [];
    await loadCurrentVisitors();
  } catch (error) {
    state.error = error.response?.data?.message || "Не удалось зарегистрировать посетителя.";
  } finally {
    state.isSubmitting = false;
  }
}

async function registerExit(visitId) {
  resetAlerts();

  try {
    await api.put(`/visits/${visitId}/exit`);
    state.message = "Выход посетителя зарегистрирован.";
    await loadCurrentVisitors();
  } catch (error) {
    state.error = error.response?.data?.message || "Не удалось зарегистрировать выход.";
  }
}

async function searchVisitors() {
  state.isSearching = true;

  try {
    const { data } = await api.get("/visitors/search", {
      params: { query: state.searchText },
    });
    state.visitorHints = data;
  } catch {
    state.error = "Не удалось выполнить поиск.";
  } finally {
    state.isSearching = false;
  }
}

// Подстановка найденного посетителя ускоряет повторную регистрацию на защите проекта.
function applyVisitorHint(visitor) {
  form.fullName = visitor.fullName;
  form.documentNumber = visitor.documentNumber;
}

onMounted(async () => {
  await Promise.all([loadEmployees(), loadCurrentVisitors()]);
});
</script>

<template>
  <div class="page-shell">
    <header class="hero">
      <div>
        <h1>Регистрация посетителей</h1>
        <p class="hero-text">
          Простая автоматизированная система для регистрации входа, контроля выхода,
          поиска посетителей и выгрузки отчёта.
        </p>
      </div>

      <div class="role-card">
        <span>Текущая роль</span>
        <select v-model="state.selectedRole">
          <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
        </select>
      </div>
    </header>

    <section class="alerts" v-if="state.message || state.error">
      <div v-if="state.message" class="alert success">{{ state.message }}</div>
      <div v-if="state.error" class="alert error">{{ state.error }}</div>
    </section>

    <main class="layout">
      <section class="card">
        <div class="section-heading">
          <h2>Регистрация</h2>
          <p>Добавление нового визита с автоматическим временем входа.</p>
        </div>

        <form class="form-grid" @submit.prevent="registerVisit">
          <label>
            ФИО
            <input v-model.trim="form.fullName" maxlength="150" required placeholder="Например, Петров Илья Сергеевич" />
          </label>

          <label>
            Номер документа
            <input v-model.trim="form.documentNumber" maxlength="50" required placeholder="ID1234567" />
          </label>

          <label>
            Принимающий сотрудник
            <select v-model="form.employeeId" required>
              <option disabled value="">Выберите сотрудника</option>
              <option v-for="employee in state.employees" :key="employee.id" :value="employee.id">
                {{ employee.fullName }} — {{ employee.position }}
              </option>
            </select>
          </label>

          <label>
            Цель визита
            <input v-model.trim="form.purpose" maxlength="200" required placeholder="Получение справки" />
          </label>

          <button class="primary-button" type="submit" :disabled="state.isSubmitting || state.isLoadingEmployees">
            {{ state.isSubmitting ? 'Сохранение...' : 'Зарегистрировать посетителя' }}
          </button>
        </form>
      </section>

      <section v-if="isAdmin" class="card">
        <div class="section-heading inline-heading">
          <div>
            <h2>Поиск</h2>
            <p>Поиск по ФИО или номеру документа.</p>
          </div>
          <button class="secondary-button" type="button" @click="searchVisitors" :disabled="state.isSearching">
            {{ state.isSearching ? 'Поиск...' : 'Найти' }}
          </button>
        </div>

        <div class="search-row">
          <input
            v-model.trim="state.searchText"
            placeholder="Введите ФИО или документ"
            @keyup.enter="searchVisitors"
          />
          <a class="link-button" :href="reportUrl">Скачать CSV</a>
        </div>

        <div class="hint-list" v-if="state.visitorHints.length">
          <button
            v-for="visitor in state.visitorHints"
            :key="visitor.id"
            class="hint-item"
            type="button"
            @click="applyVisitorHint(visitor)"
          >
            <strong>{{ visitor.fullName }}</strong>
            <span>{{ visitor.documentNumber }}</span>
          </button>
        </div>
        <p v-else class="empty-state">Результаты поиска появятся здесь.</p>
      </section>

      <section v-else class="card">
        <div class="section-heading">
          <h2>Роль Operator</h2>
          <p>
            Оператор может регистрировать посетителей и отмечать их выход.
            Поиск и выгрузка отчёта доступны в роли администратора.
          </p>
        </div>
      </section>
    </main>

    <section class="card visitors-card">
      <div class="section-heading inline-heading">
        <div>
          <h2>Текущие посетители</h2>
          <p>В таблице отображаются записи, у которых не заполнено время выхода.</p>
        </div>
        <button class="secondary-button" type="button" @click="loadCurrentVisitors" :disabled="state.isLoadingCurrent">
          {{ state.isLoadingCurrent ? 'Обновление...' : 'Обновить' }}
        </button>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Документ</th>
              <th>Сотрудник</th>
              <th>Цель</th>
              <th>Пропуск</th>
              <th>Вход</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="visitor in state.currentVisitors" :key="visitor.id">
              <td>{{ visitor.fullName }}</td>
              <td>{{ visitor.documentNumber }}</td>
              <td>{{ visitor.employeeName }}</td>
              <td>{{ visitor.purpose }}</td>
              <td>{{ visitor.passNumber }}</td>
              <td>{{ formatDate(visitor.entryTime) }}</td>
              <td>
                <button class="danger-button" type="button" @click="registerExit(visitor.id)">
                  Выход
                </button>
              </td>
            </tr>
            <tr v-if="!state.currentVisitors.length">
              <td colspan="7" class="empty-table">Сейчас активных посетителей нет.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
