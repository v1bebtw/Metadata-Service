# Metadata Service — Lab 2.1

REST API на Node.js + Express для управления документами и их метаданными (предметная область курсового проекта).

## Запуск

```bash
npm install
npm run dev    # nodemon (режим разработки)
npm start      # обычный запуск
```

Сервер: `http://localhost:3000`

## Маршруты

| Метод  | URL                    | Описание              | Успех | Ошибки   |
|--------|------------------------|-----------------------|-------|----------|
| GET    | `/api/documents`       | Список всех документов| 200   | —        |
| GET    | `/api/documents/:id`   | Документ по ID        | 200   | 404      |
| POST   | `/api/documents`       | Создать документ      | 201   | 400      |
| PUT    | `/api/documents/:id`   | Полное обновление     | 200   | 400, 404 |
| DELETE | `/api/documents/:id`   | Удалить документ      | 200   | 404      |

## Пример создания документа

```http
POST http://localhost:3000/api/documents
Content-Type: application/json

{
  "fileName": "report.pdf",
  "fileType": "pdf",
  "fileSizeBytes": 1048576,
  "metadata": {
    "author": "Иванов И.И.",
    "pages": 24
  }
}
```

Допустимые `fileType`: `pdf`, `docx`, `image`.

Тестовые запросы также есть в файле `test.http` (REST Client для VS Code / Cursor).
