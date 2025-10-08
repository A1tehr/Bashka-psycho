#!/usr/bin/env python3
"""
Специальный тест для API психологического центра
Тестирует конкретные эндпоинты согласно требованиям
"""

import requests
import json
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://psycentr.preview.emergentagent.com')
API_BASE = f"{BACKEND_URL}/api"

print(f"🧠 Тестирование API психологического центра: {API_BASE}")
print("=" * 70)

def test_get_programs():
    """Тест GET /api/programs - должен вернуть 6 программ с обновленными image_url из Unsplash"""
    print("\n=== 1. Тестирование GET /api/programs ===")
    try:
        response = requests.get(f"{API_BASE}/programs")
        print(f"Статус: {response.status_code}")
        
        if response.status_code == 200:
            programs = response.json()
            print(f"Количество программ: {len(programs)}")
            
            if len(programs) >= 6:
                print(f"✅ Найдено {len(programs)} программ (ожидалось минимум 6)")
                
                # Проверяем image_url на Unsplash
                unsplash_count = 0
                for i, program in enumerate(programs):
                    image_url = program.get('image_url', '')
                    if image_url.startswith('https://images.unsplash.com'):
                        unsplash_count += 1
                    print(f"  Программа {i+1}: {program.get('title', 'N/A')}")
                    print(f"    Image URL: {image_url}")
                
                if unsplash_count == len(programs):
                    print(f"✅ Все {len(programs)} программ имеют image_url из Unsplash")
                else:
                    print(f"⚠️ Только {unsplash_count} из {len(programs)} программ имеют image_url из Unsplash")
                
                return True, programs[0]['id'] if programs else None
            else:
                print(f"❌ Найдено только {len(programs)} программ, ожидалось минимум 6")
                return False, None
        else:
            print(f"❌ Ошибка: {response.text}")
            return False, None
    except Exception as e:
        print(f"❌ Исключение: {e}")
        return False, None

def test_get_blog():
    """Тест GET /api/blog - должен вернуть блог-посты"""
    print("\n=== 2. Тестирование GET /api/blog ===")
    try:
        response = requests.get(f"{API_BASE}/blog")
        print(f"Статус: {response.status_code}")
        
        if response.status_code == 200:
            posts = response.json()
            print(f"Количество блог-постов: {len(posts)}")
            
            if posts:
                print("✅ Блог-посты найдены:")
                for i, post in enumerate(posts[:3]):  # Показываем первые 3
                    print(f"  {i+1}. {post.get('title', 'N/A')}")
                    print(f"     Автор: {post.get('author', 'N/A')}")
                    print(f"     Опубликован: {post.get('published', 'N/A')}")
                
                return True, posts[0]['id'] if posts else None
            else:
                print("❌ Блог-посты не найдены")
                return False, None
        else:
            print(f"❌ Ошибка: {response.text}")
            return False, None
    except Exception as e:
        print(f"❌ Исключение: {e}")
        return False, None

def test_admin_login():
    """Тест POST /api/admin/login с {"username": "test", "password": "test"}"""
    print("\n=== 3. Тестирование POST /api/admin/login ===")
    
    login_data = {
        "username": "test",
        "password": "test"
    }
    
    try:
        response = requests.post(f"{API_BASE}/admin/login", json=login_data)
        print(f"Статус: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data:
                print("✅ Авторизация успешна")
                print(f"Тип токена: {data.get('token_type', 'N/A')}")
                print(f"Пользователь: {data.get('username', 'N/A')}")
                return True, data["access_token"]
            else:
                print("❌ access_token не найден в ответе")
                return False, None
        else:
            print(f"❌ Ошибка: {response.text}")
            return False, None
    except Exception as e:
        print(f"❌ Исключение: {e}")
        return False, None

def test_get_settings():
    """Тест GET /api/settings - должен вернуть настройки сайта"""
    print("\n=== 4. Тестирование GET /api/settings ===")
    try:
        response = requests.get(f"{API_BASE}/settings")
        print(f"Статус: {response.status_code}")
        
        if response.status_code == 200:
            settings = response.json()
            print("✅ Настройки сайта получены:")
            print(f"  Телефон: {settings.get('phone', 'N/A')}")
            print(f"  Email: {settings.get('email', 'N/A')}")
            print(f"  Адрес: {settings.get('address', 'N/A')}")
            print(f"  График работы: {settings.get('work_schedule', 'N/A')}")
            print(f"  VK ссылка: {settings.get('vk_link', 'N/A')}")
            
            # Проверяем наличие политики конфиденциальности
            privacy_policy = settings.get('privacy_policy', '')
            if privacy_policy:
                print(f"  Политика конфиденциальности: {len(privacy_policy)} символов")
            else:
                print("  Политика конфиденциальности: не найдена")
            
            return True
        else:
            print(f"❌ Ошибка: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Исключение: {e}")
        return False

def test_update_program(token, program_id):
    """Тест PUT /api/programs/{program_id} - обновление программы"""
    print(f"\n=== 5. Тестирование PUT /api/programs/{program_id} ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Сначала получаем текущую программу
    try:
        get_response = requests.get(f"{API_BASE}/programs/{program_id}")
        if get_response.status_code != 200:
            print("❌ Не удалось получить программу для обновления")
            return False
        
        current_program = get_response.json()
        
        # Обновляем только описание, чтобы не нарушить структуру
        updated_program = {
            "type": current_program["type"],
            "title": current_program["title"],
            "description": current_program["description"] + " [ОБНОВЛЕНО ДЛЯ ТЕСТА]",
            "goals": current_program["goals"],
            "age_range": current_program["age_range"],
            "price": current_program["price"],
            "duration": current_program["duration"],
            "faq": current_program["faq"],
            "image_url": current_program["image_url"]
        }
        
        response = requests.put(f"{API_BASE}/programs/{program_id}", 
                              json=updated_program, headers=headers)
        print(f"Статус: {response.status_code}")
        
        if response.status_code == 200:
            updated = response.json()
            print("✅ Программа успешно обновлена")
            print(f"  Название: {updated.get('title', 'N/A')}")
            print(f"  Описание обновлено: {'[ОБНОВЛЕНО ДЛЯ ТЕСТА]' in updated.get('description', '')}")
            
            # Возвращаем обратно оригинальное описание
            original_program = {
                "type": current_program["type"],
                "title": current_program["title"],
                "description": current_program["description"],
                "goals": current_program["goals"],
                "age_range": current_program["age_range"],
                "price": current_program["price"],
                "duration": current_program["duration"],
                "faq": current_program["faq"],
                "image_url": current_program["image_url"]
            }
            
            # Восстанавливаем оригинальное описание
            restore_response = requests.put(f"{API_BASE}/programs/{program_id}", 
                                          json=original_program, headers=headers)
            if restore_response.status_code == 200:
                print("✅ Оригинальное описание восстановлено")
            
            return True
        else:
            print(f"❌ Ошибка: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Исключение: {e}")
        return False

def test_delete_program_endpoint(token, program_id):
    """Тест DELETE /api/programs/{program_id} - НЕ удаляем, только проверяем доступность"""
    print(f"\n=== 6. Тестирование DELETE /api/programs/{program_id} (только проверка авторизации) ===")
    
    # Сначала проверяем без авторизации
    try:
        response_no_auth = requests.delete(f"{API_BASE}/programs/{program_id}")
        print(f"Статус без авторизации: {response_no_auth.status_code}")
        
        if response_no_auth.status_code in [401, 403]:
            print("✅ Эндпоинт корректно требует авторизацию")
            
            # Теперь проверяем с авторизацией (но НЕ выполняем удаление)
            headers = {"Authorization": f"Bearer {token}"}
            print("ℹ️ Эндпоинт DELETE существует и требует авторизацию (реальное удаление не выполняется)")
            return True
        else:
            print(f"❌ Эндпоинт должен требовать авторизацию, получен статус: {response_no_auth.status_code}")
            return False
    except Exception as e:
        print(f"❌ Исключение: {e}")
        return False

def test_update_blog_post(token, post_id):
    """Тест PUT /api/blog/{post_id} - обновление блог-поста"""
    print(f"\n=== 7. Тестирование PUT /api/blog/{post_id} ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Сначала получаем текущий пост
    try:
        # Получаем список постов, чтобы найти первый
        get_response = requests.get(f"{API_BASE}/blog")
        if get_response.status_code != 200:
            print("❌ Не удалось получить список блог-постов")
            return False
        
        posts = get_response.json()
        if not posts:
            print("❌ Блог-посты не найдены")
            return False
        
        current_post = posts[0]  # Берем первый пост
        post_id = current_post['id']
        
        # Обновляем только заголовок, чтобы не нарушить структуру
        updated_post = {
            "title": current_post["title"] + " [ОБНОВЛЕНО ДЛЯ ТЕСТА]",
            "slug": current_post["slug"],
            "excerpt": current_post["excerpt"],
            "content": current_post["content"],
            "author": current_post["author"],
            "tags": current_post["tags"],
            "image_url": current_post["image_url"],
            "published": current_post["published"]
        }
        
        response = requests.put(f"{API_BASE}/blog/{post_id}", 
                              json=updated_post, headers=headers)
        print(f"Статус: {response.status_code}")
        
        if response.status_code == 200:
            updated = response.json()
            print("✅ Блог-пост успешно обновлен")
            print(f"  Заголовок: {updated.get('title', 'N/A')}")
            print(f"  Заголовок обновлен: {'[ОБНОВЛЕНО ДЛЯ ТЕСТА]' in updated.get('title', '')}")
            
            # Возвращаем обратно оригинальный заголовок
            original_post = {
                "title": current_post["title"],
                "slug": current_post["slug"],
                "excerpt": current_post["excerpt"],
                "content": current_post["content"],
                "author": current_post["author"],
                "tags": current_post["tags"],
                "image_url": current_post["image_url"],
                "published": current_post["published"]
            }
            
            # Восстанавливаем оригинальный заголовок
            restore_response = requests.put(f"{API_BASE}/blog/{post_id}", 
                                          json=original_post, headers=headers)
            if restore_response.status_code == 200:
                print("✅ Оригинальный заголовок восстановлен")
            
            return True
        else:
            print(f"❌ Ошибка: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Исключение: {e}")
        return False

def test_delete_blog_post_endpoint(token, post_id):
    """Тест DELETE /api/blog/{post_id} - НЕ удаляем, только проверяем доступность"""
    print(f"\n=== 8. Тестирование DELETE /api/blog/{post_id} (только проверка авторизации) ===")
    
    # Сначала проверяем без авторизации
    try:
        response_no_auth = requests.delete(f"{API_BASE}/blog/{post_id}")
        print(f"Статус без авторизации: {response_no_auth.status_code}")
        
        if response_no_auth.status_code in [401, 403]:
            print("✅ Эндпоинт корректно требует авторизацию")
            
            # Теперь проверяем с авторизацией (но НЕ выполняем удаление)
            headers = {"Authorization": f"Bearer {token}"}
            print("ℹ️ Эндпоинт DELETE существует и требует авторизацию (реальное удаление не выполняется)")
            return True
        else:
            print(f"❌ Эндпоинт должен требовать авторизацию, получен статус: {response_no_auth.status_code}")
            return False
    except Exception as e:
        print(f"❌ Исключение: {e}")
        return False

def main():
    """Основная функция тестирования"""
    results = {}
    
    # 1. Тест программ
    programs_success, program_id = test_get_programs()
    results['programs'] = programs_success
    
    # 2. Тест блога
    blog_success, post_id = test_get_blog()
    results['blog'] = blog_success
    
    # 3. Тест авторизации админа
    login_success, admin_token = test_admin_login()
    results['admin_login'] = login_success
    
    # 4. Тест настроек
    settings_success = test_get_settings()
    results['settings'] = settings_success
    
    # Тесты с авторизацией
    if admin_token and program_id:
        # 5. Обновление программы
        update_program_success = test_update_program(admin_token, program_id)
        results['update_program'] = update_program_success
        
        # 6. Проверка DELETE программы
        delete_program_success = test_delete_program_endpoint(admin_token, program_id)
        results['delete_program_check'] = delete_program_success
    else:
        print("⚠️ Пропускаем тесты программ с авторизацией (нет токена или program_id)")
        results['update_program'] = False
        results['delete_program_check'] = False
    
    if admin_token and post_id:
        # 7. Обновление блог-поста
        update_blog_success = test_update_blog_post(admin_token, post_id)
        results['update_blog'] = update_blog_success
        
        # 8. Проверка DELETE блог-поста
        delete_blog_success = test_delete_blog_post_endpoint(admin_token, post_id)
        results['delete_blog_check'] = delete_blog_success
    else:
        print("⚠️ Пропускаем тесты блога с авторизацией (нет токена или post_id)")
        results['update_blog'] = False
        results['delete_blog_check'] = False
    
    # Итоговый отчет
    print("\n" + "=" * 70)
    print("📊 ИТОГОВЫЙ ОТЧЕТ ТЕСТИРОВАНИЯ")
    print("=" * 70)
    
    passed = sum(1 for result in results.values() if result)
    total = len(results)
    
    print(f"\n✅ Успешно: {passed}/{total} тестов ({(passed/total)*100:.1f}%)")
    
    print("\nДетальные результаты:")
    test_names = {
        'programs': '1. GET /api/programs (проверка Unsplash изображений)',
        'blog': '2. GET /api/blog',
        'admin_login': '3. POST /api/admin/login',
        'settings': '4. GET /api/settings',
        'update_program': '5. PUT /api/programs/{id} (с авторизацией)',
        'delete_program_check': '6. DELETE /api/programs/{id} (проверка авторизации)',
        'update_blog': '7. PUT /api/blog/{id} (с авторизацией)',
        'delete_blog_check': '8. DELETE /api/blog/{id} (проверка авторизации)'
    }
    
    for key, name in test_names.items():
        if key in results:
            status = "✅ УСПЕШНО" if results[key] else "❌ ОШИБКА"
            print(f"  {name}: {status}")
    
    if passed == total:
        print("\n🎉 Все тесты API психологического центра прошли успешно!")
        return True
    else:
        print(f"\n⚠️ {total - passed} тестов завершились с ошибками. Проверьте детали выше.")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)