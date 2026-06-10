import sys
sys.path.append(r"c:\Users\ACER\Desktop\anytimellm\backend")

from pydantic import ValidationError
from app.schemas import UserRegister, GoogleAuthPayload, GoogleAuthResponse
from app.routers.users import verify_google_token
from app.database import SessionLocal
from app.models import User, Business
from app.services.security import create_access_token
import random
import secrets

def test_validation():
    print("==================================================")
    print("Test 1: In-Memory Email & Password Validation Rules")
    print("==================================================")

    # 1. Invalid Email
    print("\nSubmitting invalid email format ('invalidemail.com')...")
    try:
        UserRegister(
            business_name="Test Brand",
            email="invalidemail.com",
            password="SecurePassword123!"
        )
        print("[-] FAILED: Schema accepted invalid email.")
    except ValidationError as e:
        print("[SUCCESS] Correctly rejected invalid email format.")
        print(f"Error detail: {e.errors()[0]['msg']}")

    # 2. Weak password: short
    print("\nSubmitting short password ('Short1!')...")
    try:
        UserRegister(
            business_name="Test Brand",
            email="valid@example.com",
            password="Short1!"
        )
        print("[-] FAILED: Schema accepted short password.")
    except ValidationError as e:
        print("[SUCCESS] Correctly rejected short password.")
        print(f"Error detail: {e.errors()[0]['msg']}")

    # 3. Weak password: no number
    print("\nSubmitting password with no number ('SecurePassword!')...")
    try:
        UserRegister(
            business_name="Test Brand",
            email="valid@example.com",
            password="SecurePassword!"
        )
        print("[-] FAILED: Schema accepted password without numbers.")
    except ValidationError as e:
        print("[SUCCESS] Correctly rejected password without numbers.")
        print(f"Error detail: {e.errors()[0]['msg']}")

    # 4. Weak password: no special character
    print("\nSubmitting password with no special character ('SecurePassword123')...")
    try:
        UserRegister(
            business_name="Test Brand",
            email="valid@example.com",
            password="SecurePassword123"
        )
        print("[-] FAILED: Schema accepted password without special characters.")
    except ValidationError as e:
        print("[SUCCESS] Correctly rejected password without special characters.")
        print(f"Error detail: {e.errors()[0]['msg']}")

    # 5. Compliant password
    print("\nSubmitting fully compliant credentials ('SecurePassword123!')...")
    try:
        reg = UserRegister(
            business_name="Test Brand",
            email="valid@example.com",
            password="SecurePassword123!"
        )
        print("[SUCCESS] Compliant password accepted.")
    except ValidationError as e:
        print("[-] FAILED: Compliant password rejected.")
        print(f"Error details: {e}")


def test_google_auth_logic():
    print("\n==================================================")
    print("Test 2: Google Sign-In Logic & DB Ingestion")
    print("==================================================")

    rand_id = random.randint(1000, 9999)
    mock_email = f"google-inmemory-{rand_id}@example.com"
    mock_name = f"Google InMemory User {rand_id}"
    mock_token = f"mock_token_{mock_email}_{mock_name}"

    # Verify google token mock verification
    print(f"\n1. Testing verify_google_token helper with mock token: {mock_token}...")
    idinfo = verify_google_token(mock_token, "mock-google-client-id.apps.googleusercontent.com")
    print(f"Resolved Identity: {idinfo}")
    assert idinfo.get("email") == mock_email
    assert idinfo.get("name") == mock_name
    print("[SUCCESS] verify_google_token correctly parsed mock token information.")

    # Test DB creation loop
    db = SessionLocal()
    try:
        print(f"\n2. Simulating backend Google register step (creating user/business for email: {mock_email})...")
        
        # Verify user does not exist
        existing = db.query(User).filter(User.email == mock_email).first()
        assert existing is None
        print("Confirmed user does not exist yet.")

        # Create Business
        biz_name = f"Google In-Memory Brand {rand_id}"
        new_biz = Business(
            name=biz_name,
            api_settings={
                "system_prompt": f"You are an assistant for {biz_name}"
            }
        )
        db.add(new_biz)
        db.commit()
        db.refresh(new_biz)
        print(f"Created Business: ID={new_biz.id}, Name={new_biz.name}")

        # Create User
        from app.services.security import hash_password
        new_user = User(
            business_id=new_biz.id,
            email=mock_email,
            hashed_password=hash_password(secrets.token_urlsafe(32))
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print(f"Created User: ID={new_user.id}, Email={new_user.email}")

        # Generate JWT Access Token
        token_data = {
            "user_id": str(new_user.id),
            "business_id": str(new_biz.id)
        }
        access_token = create_access_token(token_data)
        print(f"Generated JWT Access Token: {access_token[:30]}...")

        # Clean up test records
        db.delete(new_user)
        db.delete(new_biz)
        db.commit()
        print("Cleaned up test database records.")
        print("[SUCCESS] Entire Google Auth DB creation flow works successfully in PostgreSQL!")

    except Exception as e:
        db.rollback()
        print(f"[-] FAILED: Database Google Auth flow failed: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    test_validation()
    test_google_auth_logic()
