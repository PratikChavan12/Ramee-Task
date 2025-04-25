# Ramee-Task
# React (Vite) + Laravel API Integration

This project is a full-stack web application using React (Vite) for the frontend and Laravel PHP for the backend API.

---

## 🛠️ Tech Information

- Frontend: React (with Vite)
- Backend: Laravel PHP
- API: RESTful APIs using `fetch` or `tanstack/react-query`
- CORS Handling: Laravel CORS (`fruitcake`)

---

# 🔧 Backend Setup (Laravel)

```bash
cd task-laravel
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

```

# 🔧 Frontend Setup (React + Vite)

```
cd task-frontend
npm install
npm run dev

```