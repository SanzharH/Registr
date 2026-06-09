const errorMessages = {
  400: "Запрос сформирован неверно. Проверьте введенные данные.",
  401: "API-токен недействителен или отсутствует. Введите новый токен.",
  403: "Квота исчерпана. Дождитесь следующего месяца или увеличьте лимит.",
  404: "Запрошенный ресурс не найден.",
  503: "Сервис временно недоступен. Повторите попытку позже.",
};

export function formatError(error) {
  const status = error.status;
  const fallback = status ? errorMessages[status] : "Не удалось выполнить запрос.";
  const detail = error.payload?.detail || error.payload?.title || "";

  return detail ? `${fallback} ${detail}` : fallback;
}
