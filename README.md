# АС РП — Регистрация посетителей

Учебный MVP автоматизированной системы «Регистрация посетителей» для демонстрации в колледже.

## Стек
- Backend: ASP.NET Core Web API
- Frontend: Vue 3 + Vite
- База данных: SQLite
- Обмен данными: REST API

## Реализовано
- регистрация посетителя
- автоматическая фиксация времени входа
- контроль выхода кнопкой `Выход`
- таблица текущих посетителей
- поиск по ФИО или документу
- CSV-выгрузка отчёта
- упрощённые роли `Operator` и `Admin`
- уникальный номер пропуска

## Структура проекта
- `VisitorRegistration.Api` — серверная часть
- `visitor-registration-ui` — клиентская часть
- `docs/ТЗ_АС_РП.md` — упрощённое ТЗ по ГОСТ 34.602-89

## Запуск backend
```powershell
cd 'C:\Users\hosma\OneDrive\documents\New project\VisitorRegistration.Api'
$env:DOTNET_CLI_HOME='C:\Users\hosma\OneDrive\documents\New project\.dotnet'
$env:HOME='C:\Users\hosma\OneDrive\documents\New project\.dotnet'
dotnet run
```

API стартует на `http://localhost:5031`.

## Запуск frontend
```powershell
cd 'C:\Users\hosma\OneDrive\documents\New project\visitor-registration-ui'
npm run dev
```

Интерфейс стартует на `http://localhost:5173`.

## Основные API
- `GET /api/employees` — список сотрудников
- `POST /api/visits` — регистрация визита
- `PUT /api/visits/{id}/exit` — регистрация выхода
- `GET /api/visits/current` — текущие посетители
- `GET /api/visits?query=...` — поиск по визитам
- `GET /api/visits/export?query=...` — выгрузка CSV
- `GET /api/visitors/search?query=...` — поиск по посетителям
