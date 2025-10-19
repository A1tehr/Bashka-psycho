# SEO Оптимизация - Документация

## Обзор изменений

Сайт психологического центра теперь полностью оптимизирован для поисковых систем и поддерживает многостраничную архитектуру.

## Реализованные функции

### 1. React Helmet Async - Динамические мета-теги
- ✅ Установлен пакет `react-helmet-async`
- ✅ Создан компонент `SEO.js` для управления мета-тегами
- ✅ Каждая страница имеет уникальные:
  - Title
  - Description
  - Keywords
  - Open Graph теги (для социальных сетей)
  - Twitter Card теги
  - Canonical URL
  - Schema.org разметку

### 2. Страницы с SEO оптимизацией

#### Приоритетные страницы (по требованию):
- **Главная страница** (`/`)
  - Priority: 1.0
  - Changefreq: daily
  - Schema.org: Organization/ProfessionalService
  
- **Программы** (`/programs`)
  - Priority: 0.9
  - Changefreq: weekly
  - Schema.org: ItemList с всеми программами

- **Детальные страницы программ** (`/programs/:id`)
  - Priority: 0.9
  - Changefreq: weekly
  - Schema.org: Service для каждой программы

#### Остальные страницы:
- **Блог** (`/blog`) - Priority: 0.8
- **Статьи блога** (`/blog/:slug`) - Priority: 0.7, Schema.org: BlogPosting
- **Контакты** (`/contacts`) - Priority: 0.7
- **Запись** (`/appointment`) - Priority: 0.8
- **Политика конфиденциальности** (`/privacy`) - Priority: 0.3

### 3. React Snap - Pre-rendering
- ✅ Настроен `react-snap` для генерации статических HTML файлов
- ✅ При сборке (`yarn build`) создаются реальные HTML страницы для каждого маршрута
- ✅ Поисковики могут индексировать контент без выполнения JavaScript
- ✅ Быстрая первая загрузка страницы (FCP)

**Настройка в package.json:**
```json
"reactSnap": {
  "inlineCss": true,
  "minifyHtml": {
    "collapseWhitespace": true,
    "removeComments": true
  },
  "crawl": true,
  "include": [
    "/",
    "/programs",
    "/blog",
    "/contacts",
    "/appointment",
    "/privacy"
  ]
}
```

### 4. Динамический Sitemap.xml
- ✅ Создан endpoint `/sitemap.xml` в backend
- ✅ Автоматически генерируется на основе:
  - Статических страниц
  - Всех программ из базы данных
  - Всех статей блога из базы данных
- ✅ Включает:
  - Priority (приоритет индексации)
  - Changefreq (частота изменений)
  - Lastmod (дата последнего изменения для блогов)

**Пример доступа:**
```
http://localhost:8001/sitemap.xml
https://vita-psy.com/sitemap.xml
```

### 5. Robots.txt
- ✅ Создан endpoint `/robots.txt` в backend
- ✅ Настроен для:
  - Разрешения индексации всех публичных страниц
  - Запрета индексации админ-панели
  - Ссылки на sitemap.xml

**Содержимое:**
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/admin/

Sitemap: https://vita-psy.com/sitemap.xml
```

### 6. Schema.org Structured Data
Каждая страница имеет правильную структурированную разметку:

- **Главная:** Organization/ProfessionalService
- **Программы:** ItemList
- **Программа:** Service
- **Блог:** Blog
- **Статья:** BlogPosting

## Как это работает

### Для разработчиков:

1. **Разработка (dev режим):**
   ```bash
   cd /app/frontend
   yarn start
   ```
   React Helmet динамически обновляет мета-теги при навигации.

2. **Production сборка:**
   ```bash
   cd /app/frontend
   yarn build
   ```
   React Snap автоматически генерирует статические HTML файлы.

### Для поисковых систем:

1. **Поисковик заходит на сайт** → получает готовый HTML с контентом
2. **Читает мета-теги** → понимает о чем страница
3. **Парсит Schema.org** → получает структурированные данные
4. **Читает sitemap.xml** → находит все страницы сайта
5. **Индексирует контент** → добавляет в поисковую выдачу

## Проверка SEO

### Локальная проверка:

1. **Sitemap:**
   ```bash
   curl http://localhost:8001/sitemap.xml
   ```

2. **Robots.txt:**
   ```bash
   curl http://localhost:8001/robots.txt
   ```

3. **Мета-теги страницы:**
   - Откройте сайт в браузере
   - Откройте DevTools (F12)
   - Вкладка Elements → найдите `<head>`
   - Проверьте теги `<title>`, `<meta>`, `<script type="application/ld+json">`

### Проверка в инструментах:

1. **Google Search Console**
   - https://search.google.com/search-console
   - Добавьте sitemap.xml
   - Проверьте индексацию страниц

2. **Yandex Вебмастер**
   - https://webmaster.yandex.ru/
   - Добавьте sitemap.xml
   - Проверьте индексацию

3. **Проверка мета-тегов:**
   - https://metatags.io/ - проверка OG тегов
   - https://cards-dev.twitter.com/validator - проверка Twitter Card

4. **Проверка Schema.org:**
   - https://validator.schema.org/ - валидация разметки
   - https://search.google.com/test/rich-results - Rich Results Test

## Важные заметки

### URL Configuration
- Backend использует переменную окружения `BACKEND_URL`
- Значение по умолчанию: `https://psycenter.ru`
- Для production обновите в `/app/backend/.env`

### Файлы изменены:
```
Frontend:
- src/components/SEO.js (новый)
- src/App.js
- src/index.js
- src/pages/HomePage.js
- src/pages/ProgramsPage.js
- src/pages/ProgramDetailPage.js
- src/pages/BlogPage.js
- src/pages/BlogPostPage.js
- src/pages/ContactPage.js
- src/pages/AppointmentPage.js
- src/pages/PrivacyPolicyPage.js
- package.json
- public/robots.txt (новый)

Backend:
- server.py (добавлены /sitemap.xml и /robots.txt endpoints)
- .env (добавлен BACKEND_URL)
```

### Зависимости добавлены:
```
- react-helmet-async: ^2.0.5
- react-snap: ^1.23.0 (dev)
```

## Результаты

✅ Сайт теперь многостраничный для поисковиков
✅ Каждая страница имеет уникальные мета-теги
✅ Sitemap.xml динамически генерируется из БД
✅ Robots.txt настроен правильно
✅ Schema.org разметка на всех страницах
✅ Pre-rendering для быстрой индексации
✅ Приоритет отдан главной странице и программам

## Следующие шаги (рекомендации)

1. **После деплоя:**
   - Добавьте сайт в Google Search Console
   - Добавьте сайт в Yandex Вебмастер
   - Отправьте sitemap.xml
   - Настройте Google Analytics (опционально)

2. **Мониторинг:**
   - Проверяйте индексацию раз в неделю
   - Следите за позициями в поиске
   - Анализируйте поисковые запросы

3. **Оптимизация контента:**
   - Добавляйте новые статьи в блог регулярно
   - Обновляйте мета-описания на основе метрик
   - Используйте правильные ключевые слова

## Поддержка

Если у вас есть вопросы по SEO оптимизации, обращайтесь к документации:
- React Helmet Async: https://github.com/staylor/react-helmet-async
- React Snap: https://github.com/stereobooster/react-snap
- Schema.org: https://schema.org/
- Google SEO Guide: https://developers.google.com/search/docs
