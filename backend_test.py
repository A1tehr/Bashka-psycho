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
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://psych-admin.preview.emergentagent.com')
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
    """Test GET /api/programs - should return 6 programs"""
    print("\n=== Testing GET /api/programs ===")
    try:
        response = requests.get(f"{API_BASE}/programs")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            programs = response.json()
            print(f"Number of programs returned: {len(programs)}")
            
            if len(programs) == 6:
                print("✅ Correct number of programs (6)")
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
                print(f"❌ Expected 6 programs, got {len(programs)}")
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
    """Test GET /api/blog - should return 6 articles"""
    print("\n=== Testing GET /api/blog ===")
    try:
        response = requests.get(f"{API_BASE}/blog")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            posts = response.json()
            print(f"Number of blog posts returned: {len(posts)}")
            
            if len(posts) == 6:
                print("✅ Correct number of blog posts (6)")
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
                print(f"❌ Expected 6 blog posts, got {len(posts)}")
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

def main():
    """Run all backend tests"""
    print("🧠 Psychology Center Backend API Testing")
    print("=" * 50)
    
    results = {}
    
    # Test API root
    results['api_root'] = test_api_root()
    
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
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 50)
    
    passed = 0
    total = len(results)
    
    for test_name, success in results.items():
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{test_name}: {status}")
        if success:
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