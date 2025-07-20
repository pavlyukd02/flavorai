# FlavorAI

**FlavorAI** — персональная платформа для поиска, добавления и управления рецептами с возможностью оценки и поиска. .

---


### 1. Клонирование репозитория

```bash
git clone <ваш-репозиторий>
cd flavorai-frontend # или flavorai-backend для backend
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Запуск PostgreSQL (Docker)

```bash
docker run --name flavorai-postgres -e POSTGRES_PASSWORD=? -p 5432:5432 -d postgres
```

### 4. Настройка переменных окружения

#### Backend (flavorai-backend/.env):
```
DATABASE_URL=postgresql:// (свой)
JWT_SECRET= (свой)
```


### 5. Миграции Prisma (Backend)

```bash
npx prisma migrate deploy


### 6. Запуск проектов

#### Backend:
```bash
npm run start:dev
```

#### Frontend:
```bash
npm run dev
```

