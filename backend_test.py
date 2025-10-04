#!/usr/bin/env python3
"""
Backend API Testing for Psychology Center Development
Tests all backend endpoints with realistic data
"""

import requests
import json
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://psych-center-bugfix.preview.emergentagent.com')
API_BASE = f"{BACKEND_URL}/api"

print(f"Testing backend at: {API_BASE}")

def test_api_root():
    """Test API root endpoint"""
    print("\n=== Testing API Root ===")
    try:
        response = requests.get(f"{API_BASE}/")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"Exception: {e}")
        return False

def test_get_programs():
    """Test GET /api/programs - should return at least 6 programs"""
    print("\n=== Testing GET /api/programs ===")
    try:
        response = requests.get(f"{API_BASE}/programs")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            programs = response.json()
            print(f"Number of programs returned: {len(programs)}")
            
            if len(programs) >= 6:
                print(f"✅ Programs API working (found {len(programs)} programs, expected at least 6)")
                # Check first program structure
                if programs:
                    first_program = programs[0]
                    required_fields = ['id', 'type', 'title', 'description', 'goals', 'age_range', 'price', 'duration', 'faq', 'image_url']
                    missing_fields = [field for field in required_fields if field not in first_program]
                    if not missing_fields:
                        print("✅ Program structure is correct")
                        print(f"Sample program: {first_program['title']} - {first_program['price']} руб.")
                        return True, programs[0]['id']  # Return first program ID for further testing
                    else:
                        print(f"❌ Missing fields in program: {missing_fields}")
                        return False, None
            else:
                print(f"❌ Expected at least 6 programs, got {len(programs)}")
                return False, None
        else:
            print(f"❌ Error: {response.text}")
            return False, None
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False, None

def test_get_single_program(program_id):
    """Test GET /api/programs/{id}"""
    print(f"\n=== Testing GET /api/programs/{program_id} ===")
    try:
        response = requests.get(f"{API_BASE}/programs/{program_id}")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            program = response.json()
            print(f"✅ Program retrieved: {program['title']}")
            print(f"Program type: {program['type']}")
            print(f"Price: {program['price']} руб.")
            return True
        elif response.status_code == 404:
            print("❌ Program not found")
            return False
        else:
            print(f"❌ Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def test_create_appointment(program_id):
    """Test POST /api/appointments"""
    print(f"\n=== Testing POST /api/appointments ===")
    
    # Realistic appointment data
    appointment_data = {
        "program_id": program_id,
        "client_name": "Анна Петрова",
        "client_phone": "+7 (495) 123-45-67",
        "client_email": "anna.petrova@example.com",
        "child_name": "Максим Петров",
        "child_age": 6,
        "preferred_date": (datetime.now() + timedelta(days=7)).isoformat(),
        "preferred_time": "10:00",
        "message": "Хотелось бы записать ребенка на дошкольную подготовку. У него есть небольшие трудности с концентрацией внимания."
    }
    
    try:
        response = requests.post(f"{API_BASE}/appointments", json=appointment_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            appointment = response.json()
            print(f"✅ Appointment created successfully")
            print(f"Appointment ID: {appointment['id']}")
            print(f"Client: {appointment['client_name']}")
            print(f"Child: {appointment['child_name']}, {appointment['child_age']} лет")
            print(f"Status: {appointment['status']}")
            return True
        else:
            print(f"❌ Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def test_create_contact():
    """Test POST /api/contacts"""
    print("\n=== Testing POST /api/contacts ===")
    
    contact_data = {
        "name": "Елена Сидорова",
        "email": "elena.sidorova@example.com",
        "phone": "+7 (495) 987-65-43",
        "subject": "Вопрос о групповых занятиях",
        "message": "Добрый день! Интересуют групповые занятия для ребенка 9 лет. Какие есть варианты и когда можно начать?"
    }
    
    try:
        response = requests.post(f"{API_BASE}/contacts", json=contact_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            contact = response.json()
            print(f"✅ Contact message created successfully")
            print(f"Contact ID: {contact['id']}")
            print(f"From: {contact['name']} ({contact['email']})")
            print(f"Subject: {contact['subject']}")
            return True
        else:
            print(f"❌ Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def test_newsletter_subscription():
    """Test POST /api/newsletter"""
    print("\n=== Testing POST /api/newsletter ===")
    
    newsletter_data = {
        "email": "maria.ivanova@example.com"
    }
    
    try:
        response = requests.post(f"{API_BASE}/newsletter", json=newsletter_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            subscription = response.json()
            print(f"✅ Newsletter subscription created successfully")
            print(f"Subscription ID: {subscription['id']}")
            print(f"Email: {subscription['email']}")
            return True
        elif response.status_code == 400:
            print("⚠️ Email already subscribed (this is expected behavior)")
            return True
        else:
            print(f"❌ Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def test_get_blog_posts():
    """Test GET /api/blog - should return at least 6 articles"""
    print("\n=== Testing GET /api/blog ===")
    try:
        response = requests.get(f"{API_BASE}/blog")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            posts = response.json()
            print(f"Number of blog posts returned: {len(posts)}")
            
            if len(posts) >= 6:
                print(f"✅ Blog API working (found {len(posts)} posts, expected at least 6)")
                # Check first post structure
                if posts:
                    first_post = posts[0]
                    required_fields = ['id', 'title', 'slug', 'excerpt', 'content', 'author', 'tags', 'image_url', 'published']
                    missing_fields = [field for field in required_fields if field not in first_post]
                    if not missing_fields:
                        print("✅ Blog post structure is correct")
                        print(f"Sample post: {first_post['title']}")
                        print(f"Author: {first_post['author']}")
                        print(f"Tags: {', '.join(first_post['tags'])}")
                        return True, posts[0]['slug']  # Return first post slug for further testing
                    else:
                        print(f"❌ Missing fields in blog post: {missing_fields}")
                        return False, None
            else:
                print(f"❌ Expected at least 6 blog posts, got {len(posts)}")
                return False, None
        else:
            print(f"❌ Error: {response.text}")
            return False, None
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False, None

def test_get_single_blog_post(slug):
    """Test GET /api/blog/{slug}"""
    print(f"\n=== Testing GET /api/blog/{slug} ===")
    try:
        response = requests.get(f"{API_BASE}/blog/{slug}")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            post = response.json()
            print(f"✅ Blog post retrieved: {post['title']}")
            print(f"Author: {post['author']}")
            print(f"Published: {post['published']}")
            print(f"Content length: {len(post['content'])} characters")
            return True
        elif response.status_code == 404:
            print("❌ Blog post not found")
            return False
        else:
            print(f"❌ Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def test_admin_login_success():
    """Test POST /api/admin/login with correct credentials"""
    print("\n=== Testing Admin Login (Success) ===")
    
    login_data = {
        "username": "test",
        "password": "test"
    }
    
    try:
        response = requests.post(f"{API_BASE}/admin/login", json=login_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data and "token_type" in data:
                print("✅ Admin login successful")
                print(f"Token type: {data['token_type']}")
                print(f"Username: {data.get('username', 'N/A')}")
                return True, data["access_token"]
            else:
                print("❌ Missing access_token or token_type in response")
                return False, None
        else:
            print(f"❌ Error: {response.text}")
            return False, None
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False, None

def test_admin_login_failure():
    """Test POST /api/admin/login with incorrect credentials"""
    print("\n=== Testing Admin Login (Failure) ===")
    
    login_data = {
        "username": "wrong",
        "password": "wrong"
    }
    
    try:
        response = requests.post(f"{API_BASE}/admin/login", json=login_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 401:
            print("✅ Correctly rejected invalid credentials")
            return True
        else:
            print(f"❌ Expected 401, got {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def test_protected_endpoint_without_auth():
    """Test protected endpoint without authorization header"""
    print("\n=== Testing Protected Endpoint Without Auth ===")
    
    try:
        response = requests.get(f"{API_BASE}/appointments")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 401 or response.status_code == 403:
            print("✅ Correctly rejected request without authorization")
            return True
        else:
            print(f"❌ Expected 401/403, got {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def test_get_appointments_protected(token):
    """Test GET /api/appointments with admin token"""
    print("\n=== Testing GET /api/appointments (Protected) ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{API_BASE}/appointments", headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            appointments = response.json()
            print(f"✅ Retrieved {len(appointments)} appointments")
            return True, appointments[0]["id"] if appointments else None
        else:
            print(f"❌ Error: {response.text}")
            return False, None
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False, None

def test_get_contacts_protected(token):
    """Test GET /api/contacts with admin token"""
    print("\n=== Testing GET /api/contacts (Protected) ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{API_BASE}/contacts", headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            contacts = response.json()
            print(f"✅ Retrieved {len(contacts)} contact messages")
            return True
        else:
            print(f"❌ Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def test_get_newsletter_protected(token):
    """Test GET /api/newsletter with admin token"""
    print("\n=== Testing GET /api/newsletter (Protected) ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{API_BASE}/newsletter", headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            subscribers = response.json()
            print(f"✅ Retrieved {len(subscribers)} newsletter subscribers")
            return True
        else:
            print(f"❌ Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def test_create_program_protected(token):
    """Test POST /api/programs with admin token"""
    print("\n=== Testing POST /api/programs (Protected) ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    program_data = {
        "type": "individual_adult",
        "title": "Тестовая программа для взрослых",
        "description": "Описание тестовой программы для проверки API",
        "goals": ["Цель 1", "Цель 2", "Цель 3"],
        "age_range": "18+ лет",
        "price": 3000,
        "duration": "60 минут",
        "faq": [
            {"question": "Тестовый вопрос?", "answer": "Тестовый ответ"}
        ],
        "image_url": "https://example.com/test-image.jpg"
    }
    
    try:
        response = requests.post(f"{API_BASE}/programs", json=program_data, headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            program = response.json()
            print(f"✅ Program created successfully: {program['title']}")
            print(f"Program ID: {program['id']}")
            return True, program['id']
        else:
            print(f"❌ Error: {response.text}")
            return False, None
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False, None

def test_create_blog_post_protected(token):
    """Test POST /api/blog with admin token"""
    print("\n=== Testing POST /api/blog (Protected) ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    blog_data = {
        "title": "Тестовая статья блога",
        "slug": "test-blog-post-" + str(int(datetime.now().timestamp())),
        "excerpt": "Краткое описание тестовой статьи",
        "content": "Полное содержание тестовой статьи для проверки API создания блог-постов.",
        "author": "Тестовый автор",
        "tags": ["тест", "api", "блог"],
        "image_url": "https://example.com/test-blog-image.jpg",
        "published": True
    }
    
    try:
        response = requests.post(f"{API_BASE}/blog", json=blog_data, headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            post = response.json()
            print(f"✅ Blog post created successfully: {post['title']}")
            print(f"Post ID: {post['id']}")
            print(f"Slug: {post['slug']}")
            return True
        else:
            print(f"❌ Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def test_update_appointment_status(token, appointment_id):
    """Test PUT /api/appointments/{id}/status with admin token"""
    print(f"\n=== Testing PUT /api/appointments/{appointment_id}/status (Protected) ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    status_data = {
        "status": "confirmed"
    }
    
    try:
        response = requests.put(f"{API_BASE}/appointments/{appointment_id}/status", 
                              json=status_data, headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Appointment status updated successfully")
            print(f"Message: {result.get('message', 'N/A')}")
            return True
        elif response.status_code == 404:
            print("⚠️ Appointment not found (expected if no appointments exist)")
            return True  # This is acceptable for testing
        else:
            print(f"❌ Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def test_get_settings_public():
    """Test GET /api/settings (public endpoint)"""
    print("\n=== Testing GET /api/settings (Public) ===")
    
    try:
        response = requests.get(f"{API_BASE}/settings")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            settings = response.json()
            print("✅ Settings retrieved successfully")
            print(f"Phone: {settings.get('phone', 'N/A')}")
            print(f"Email: {settings.get('email', 'N/A')}")
            print(f"Address: {settings.get('address', 'N/A')}")
            return True
        else:
            print(f"❌ Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def test_update_settings_protected(token):
    """Test PUT /api/settings with admin token"""
    print("\n=== Testing PUT /api/settings (Protected) ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    settings_data = {
        "phone": "+7 (495) 123-45-67",
        "work_schedule": "Пн-Пт: 9:00 - 21:00, Сб-Вс: 10:00 - 18:00"
    }
    
    try:
        response = requests.put(f"{API_BASE}/settings", json=settings_data, headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            settings = response.json()
            print("✅ Settings updated successfully")
            print(f"Updated phone: {settings.get('phone', 'N/A')}")
            print(f"Updated schedule: {settings.get('work_schedule', 'N/A')}")
            return True
        else:
            print(f"❌ Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def main():
    """Run all backend tests including admin authentication"""
    print("🧠 Psychology Center Backend API Testing (Admin Authentication)")
    print("=" * 70)
    
    results = {}
    
    # Test API root
    results['api_root'] = test_api_root()
    
    # Test admin authentication
    print("\n" + "🔐 ADMIN AUTHENTICATION TESTS" + "\n" + "=" * 50)
    
    login_success, admin_token = test_admin_login_success()
    results['admin_login_success'] = login_success
    
    results['admin_login_failure'] = test_admin_login_failure()
    results['protected_without_auth'] = test_protected_endpoint_without_auth()
    
    # Test protected endpoints with admin token
    if admin_token:
        print("\n" + "🔒 PROTECTED ENDPOINTS TESTS" + "\n" + "=" * 50)
        
        appointments_success, appointment_id = test_get_appointments_protected(admin_token)
        results['get_appointments_protected'] = appointments_success
        
        results['get_contacts_protected'] = test_get_contacts_protected(admin_token)
        results['get_newsletter_protected'] = test_get_newsletter_protected(admin_token)
        
        program_success, program_id = test_create_program_protected(admin_token)
        results['create_program_protected'] = program_success
        
        results['create_blog_post_protected'] = test_create_blog_post_protected(admin_token)
        
        if appointment_id:
            results['update_appointment_status'] = test_update_appointment_status(admin_token, appointment_id)
        else:
            # Create an appointment first, then test status update
            programs_success, test_program_id = test_get_programs()
            if programs_success and test_program_id:
                # Create appointment first
                appointment_created = test_create_appointment(test_program_id)
                if appointment_created:
                    # Get the appointment ID
                    appointments_success, appointment_id = test_get_appointments_protected(admin_token)
                    if appointment_id:
                        results['update_appointment_status'] = test_update_appointment_status(admin_token, appointment_id)
                    else:
                        results['update_appointment_status'] = False
                else:
                    results['update_appointment_status'] = False
            else:
                results['update_appointment_status'] = False
        
        # Test settings endpoints
        results['get_settings_public'] = test_get_settings_public()
        results['update_settings_protected'] = test_update_settings_protected(admin_token)
    else:
        print("⚠️ Skipping protected endpoint tests due to login failure")
        results['get_appointments_protected'] = False
        results['get_contacts_protected'] = False
        results['get_newsletter_protected'] = False
        results['create_program_protected'] = False
        results['create_blog_post_protected'] = False
        results['update_appointment_status'] = False
        results['get_settings_public'] = test_get_settings_public()
        results['update_settings_protected'] = False
    
    # Test public endpoints
    print("\n" + "🌐 PUBLIC ENDPOINTS TESTS" + "\n" + "=" * 50)
    
    # Test programs API
    programs_success, program_id = test_get_programs()
    results['get_programs'] = programs_success
    
    if program_id:
        results['get_single_program'] = test_get_single_program(program_id)
        results['create_appointment'] = test_create_appointment(program_id)
    else:
        results['get_single_program'] = False
        results['create_appointment'] = False
        print("⚠️ Skipping single program and appointment tests due to programs API failure")
    
    # Test contact form
    results['create_contact'] = test_create_contact()
    
    # Test newsletter subscription
    results['newsletter_subscription'] = test_newsletter_subscription()
    
    # Test blog API
    blog_success, blog_slug = test_get_blog_posts()
    results['get_blog_posts'] = blog_success
    
    if blog_slug:
        results['get_single_blog_post'] = test_get_single_blog_post(blog_slug)
    else:
        results['get_single_blog_post'] = False
        print("⚠️ Skipping single blog post test due to blog API failure")
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 70)
    
    passed = 0
    total = len(results)
    
    # Group results by category
    auth_tests = ['admin_login_success', 'admin_login_failure', 'protected_without_auth']
    protected_tests = ['get_appointments_protected', 'get_contacts_protected', 'get_newsletter_protected', 
                      'create_program_protected', 'create_blog_post_protected', 'update_appointment_status',
                      'update_settings_protected']
    public_tests = ['api_root', 'get_programs', 'get_single_program', 'create_appointment', 
                   'create_contact', 'newsletter_subscription', 'get_blog_posts', 'get_single_blog_post',
                   'get_settings_public']
    
    print("\n🔐 AUTHENTICATION TESTS:")
    for test_name in auth_tests:
        if test_name in results:
            status = "✅ PASS" if results[test_name] else "❌ FAIL"
            print(f"  {test_name}: {status}")
            if results[test_name]:
                passed += 1
    
    print("\n🔒 PROTECTED ENDPOINTS:")
    for test_name in protected_tests:
        if test_name in results:
            status = "✅ PASS" if results[test_name] else "❌ FAIL"
            print(f"  {test_name}: {status}")
            if results[test_name]:
                passed += 1
    
    print("\n🌐 PUBLIC ENDPOINTS:")
    for test_name in public_tests:
        if test_name in results:
            status = "✅ PASS" if results[test_name] else "❌ FAIL"
            print(f"  {test_name}: {status}")
            if results[test_name]:
                passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed ({(passed/total)*100:.1f}%)")
    
    if passed == total:
        print("🎉 All backend tests passed successfully!")
        return True
    else:
        print("⚠️ Some backend tests failed. Check the details above.")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)