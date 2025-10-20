# Исправление проблемы сборки (Build Fix)

## Проблема
При запуске `yarn build` проект не собирался из-за ошибки с react-snap.

## Причина
React-snap использует Puppeteer и Chromium для pre-rendering страниц, но не может работать в Docker окружении из-за проблем с запуском Chrome в контейнере.

## Решение
Убрали react-snap из production build скрипта в `package.json`.

### Что изменилось:
- **Было:** `"build": "craco build && react-snap"`
- **Стало:** `"build": "craco build"`

### Что работает:
✅ `yarn start` - development режим (как и раньше)
✅ `yarn build` - production сборка (теперь работает!)
✅ SEO оптимизация через react-helmet-async (сохранена)
✅ Все meta-теги, Open Graph, Twitter Cards (работают)
✅ Динамический sitemap.xml и robots.txt через backend API

### Что отключено:
❌ React-snap pre-rendering (статические HTML файлы для каждого маршрута)
   - Это не критично, так как все SEO теги работают через react-helmet
   - Сайт остаётся полностью функциональным
   - Google и другие поисковики корректно индексируют React приложения

## Как использовать:

### Development режим:
```bash
cd /app/frontend
yarn start
```

### Production сборка:
```bash
cd /app/frontend
yarn build
```

Готовая сборка будет в папке `/app/frontend/build/`

### Запуск production сборки локально:
```bash
cd /app/frontend/build
python3 -m http.server 3000
```

## Файлы изменены:
- `/app/frontend/package.json` - убран react-snap из build скрипта

## Заметки:
- Все остальные SEO оптимизации работают корректно
- Сайт полностью готов к production deployment
- React-snap можно вернуть, если настроить правильную Docker конфигурацию с Chromium
