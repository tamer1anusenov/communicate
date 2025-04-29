# Керемет Диагностический Центр

Веб-приложение для медицинского центра "Керемет", предоставляющее функционал записи на прием, просмотра результатов анализов и управления медицинскими данными.

## Функциональность

- Регистрация и авторизация пациентов и врачей
- Запись на прием к врачам
- Просмотр результатов анализов
- Личный кабинет пациента
- Управление назначениями и результатами анализов для врачей
- Информация о клиниках и филиалах
- Интерактивная карта клиники

## Технологии

### Frontend
- React.js
- TypeScript
- Material-UI
- React Router
- Redux Toolkit
- Axios

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT для авторизации
- TypeScript

## Установка и запуск

### Предварительные требования
- Node.js (v14 или выше)
- PostgreSQL (v12 или выше)
- npm или yarn

### Установка

1. Клонируйте репозиторий:
```bash
git clone [repository-url]
cd keremet-clinic
```

2. Установите зависимости для frontend:
```bash
cd frontend
npm install
```

3. Установите зависимости для backend:
```bash
cd ../backend
npm install
```

4. Создайте файл .env в директории backend:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=keremet_db
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

### Запуск

1. Запустите backend:
```bash
cd backend
npm run dev
```

2. Запустите frontend:
```bash
cd frontend
npm start
```

Приложение будет доступно по адресу: http://localhost:3000

## Структура проекта

```
keremet-clinic/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   └── public/
├── backend/           # Node.js backend application
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── config/
└── README.md
```

## Лицензия

MIT 