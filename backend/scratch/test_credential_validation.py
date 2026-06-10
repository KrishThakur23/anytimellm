import sys
sys.path.append(r"c:\Users\ACER\Desktop\anytimellm\backend")

import requests
import json

BASE_URL = "http://localhost:8000/api/auth"

def run_tests():
    print("==================================================")
    print("Testing Backend Email & Password Validation Rules")
    print("==================================================\n")

    # Test Case 1: Register with Invalid Email Format
    payload_invalid_email = {
        "business_name": "Test Brand",
        "email": "invalidemail.com",
        "password": "Password123!"
    }
    print("Test 1: Register with invalid email format ('invalidemail.com')...")
    res = requests.post(f"{BASE_URL}/register", json=payload_invalid_email)
    print(f"Status Code: {res.status_code}")
    print(f"Response Body: {res.text}\n")

    # Test Case 2: Register with Weak Password (no number/special char)
    payload_weak_password = {
        "business_name": "Test Brand",
        "email": "valid-email@example.com",
        "password": "Short"
    }
    print("Test 2: Register with weak password ('Short')...")
    res = requests.post(f"{BASE_URL}/register", json=payload_weak_password)
    print(f"Status Code: {res.status_code}")
    print(f"Response Body: {res.text}\n")

    # Test Case 3: Register with Compliant Credentials
    import random
    rand_id = random.randint(1000, 9999)
    payload_valid = {
        "business_name": f"Valid Brand {rand_id}",
        "email": f"valid-{rand_id}@example.com",
        "password": "SecurePassword123!"
    }
    print(f"Test 3: Register with compliant credentials (email: 'valid-{rand_id}@example.com')...")
    res = requests.post(f"{BASE_URL}/register", json=payload_valid)
    print(f"Status Code: {res.status_code}")
    print(f"Response Body: {res.text}\n")
    if res.status_code == 201:
        print("SUCCESS: Registered successfully!\n")
    else:
        print("FAILED: Compliant registration rejected.\n")

    print("==================================================")
    print("Testing Google Sign-In Exchange and Flow")
    print("==================================================\n")

    # Test Case 4: Google Auth with Mock Token (Not yet registered)
    mock_email = f"google-user-{rand_id}@example.com"
    mock_name = f"Google User {rand_id}"
    mock_token = f"mock_token_{mock_email}_{mock_name}"

    print(f"Test 4: Google auth mock token for new user ({mock_email})...")
    payload_google_new = {
        "credential": mock_token
    }
    res = requests.post(f"{BASE_URL}/google", json=payload_google_new)
    print(f"Status Code: {res.status_code}")
    print(f"Response Body: {res.text}\n")
    data = res.json()
    if res.status_code == 200 and not data.get("is_registered"):
        print("SUCCESS: Google user not registered. Correctly prompted for Business Name!\n")
    else:
        print("FAILED: Google user not prompted for business name.\n")

    # Test Case 5: Google Auth with Mock Token + Business Name (Registering)
    print("Test 5: Completing Google registration by submitting Business Name...")
    payload_google_register = {
        "credential": mock_token,
        "business_name": f"Google Brand {rand_id}"
    }
    res = requests.post(f"{BASE_URL}/google", json=payload_google_register)
    print(f"Status Code: {res.status_code}")
    print(f"Response Body: {res.text}\n")
    data = res.json()
    if res.status_code == 200 and data.get("is_registered") and data.get("access_token"):
        print("SUCCESS: Google user registered successfully, returned standard JWT access token!\n")
    else:
        print("FAILED: Google registration failed.\n")

    # Test Case 6: Google Auth with Mock Token (Subsequent Login)
    print("Test 6: Google login for already registered user...")
    res = requests.post(f"{BASE_URL}/google", json=payload_google_new)
    print(f"Status Code: {res.status_code}")
    print(f"Response Body: {res.text}\n")
    data = res.json()
    if res.status_code == 200 and data.get("is_registered") and data.get("access_token"):
        print("SUCCESS: Already registered Google user logged in successfully!\n")
    else:
        print("FAILED: Google login failed.\n")

if __name__ == "__main__":
    run_tests()
