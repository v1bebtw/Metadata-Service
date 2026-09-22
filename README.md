# Metadata Service — Lab 2.2

REST API на Node.js + Express + Sequelize + PostgreSQL для управления документами и их метаданными.

## Подготовка базы

1. Создайте базу в PostgreSQL:

```sql
CREATE DATABASE metadata_service;
```

2. Скопируйте `.env.example` в `.env` и подставьте пароль пользователя `postgres`:

```
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@127.0.0.1:5432/metadata_service
PORT=3000
```

## Запуск

```bash
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev
```

Сервер: `http://localhost:3000`

## Модель Document

| Поле | Тип | Описание |
|------|-----|----------|
| id | INTEGER | Первичный ключ |
| fileName | STRING | Имя файла |
| fileType | STRING | pdf / docx / image |
| fileSizeBytes | INTEGER | Размер в байтах |
| uploadDate | DATE | Дата загрузки |
| metadata | JSONB | Автор, страницы и др. |
| status | STRING | Поле из миграции: uploaded / processing / ready |

## Маршруты

| Метод  | URL                    | Sequelize              | Успех | Ошибки   |
|--------|------------------------|------------------------|-------|----------|
| GET    | `/api/documents`       | `Document.findAll()`   | 200   | —        |
| GET    | `/api/documents/:id`   | `Document.findByPk()`  | 200   | 404      |
| POST   | `/api/documents`       | `Document.create()`    | 201   | 400      |
| PUT    | `/api/documents/:id`   | `Document.update()`    | 200   | 400, 404 |
| DELETE | `/api/documents/:id`   | `Document.destroy()`   | 200   | 404      |

Тестовые запросы: `test.http`.
