# Metadata Service — Lab 2.3

REST API документов с JWT-аутентификацией и ролями (user / admin).

## Подготовка

```
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@127.0.0.1:5432/metadata_service
PORT=3000
JWT_SECRET=replace_with_a_long_random_string
```

```bash
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev
```

Демо-пользователи из seed:

| Email | Пароль | Роль |
|-------|--------|------|
| admin@metadata.local | admin123 | admin |
| user@metadata.local | user123 | user |

## Auth

| Метод | URL | Описание | Токен |
|-------|-----|----------|-------|
| POST | `/auth/register` | Регистрация | нет |
| POST | `/auth/login` | Вход, JWT на 1 час | нет |
| GET | `/profile` | Текущий пользователь | Bearer |
| GET | `/api/users` | Список пользователей | Bearer + admin |
| GET/POST/PUT/DELETE | `/api/documents` | CRUD документов | Bearer |

Пользователь видит только свои документы, администратор — все.
