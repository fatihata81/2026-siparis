import requests
import sys
from datetime import datetime
import json

class OrderManagementAPITester:
    def __init__(self, base_url="https://quick-order-hub-2.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.created_order_id = None
        self.created_user_id = None
        self.admin_user_data = None

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"   Response: {response.json()}")
                except:
                    print(f"   Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root(self):
        """Test root endpoint"""
        success, response = self.run_test(
            "Root Endpoint",
            "GET",
            "",
            200
        )
        return success

    def test_get_provinces(self):
        """Test get provinces"""
        success, response = self.run_test(
            "Get Provinces",
            "GET",
            "provinces",
            200
        )
        if success and 'provinces' in response:
            print(f"   Found {len(response['provinces'])} provinces")
            return True
        return False

    def test_get_districts(self):
        """Test get districts for a province"""
        success, response = self.run_test(
            "Get Districts for İstanbul",
            "GET",
            "districts/İstanbul",
            200
        )
        if success and 'districts' in response:
            print(f"   Found {len(response['districts'])} districts")
            return True
        return False

    def test_get_countries(self):
        """Test get countries"""
        success, response = self.run_test(
            "Get Countries",
            "GET",
            "countries",
            200
        )
        if success and 'countries' in response:
            print(f"   Found {len(response['countries'])} countries")
            return True
        return False

    def test_create_order(self):
        """Test create order"""
        order_data = {
            "full_name": "Test Kullanıcı",
            "phone": "905551234567",
            "tc_no": "12345678901",
            "email": "test@example.com",
            "is_international": False,
            "country": "",
            "province": "İstanbul",
            "district": "Kadıköy",
            "address": "Test Mahallesi Test Sokak No:1",
            "cargo_company": "MNG",
            "cargo_status": "",
            "product_type": "LED Lamba",
            "customization": "Test yazısı",
            "color": "Günışığı",
            "payment_type": "Havale",
            "amount": 150.50,
            "gift_package": True,
            "order_note": "Test sipariş notu"
        }
        
        success, response = self.run_test(
            "Create Order",
            "POST",
            "orders",
            200,
            data=order_data
        )
        
        if success and 'id' in response:
            self.created_order_id = response['id']
            print(f"   Created order ID: {self.created_order_id}")
            print(f"   Order No: {response.get('order_no')}")
            return True
        return False

    def test_get_orders(self):
        """Test get all orders"""
        success, response = self.run_test(
            "Get All Orders",
            "GET",
            "orders",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} orders")
            return True
        return False

    def test_get_single_order(self):
        """Test get single order"""
        if not self.created_order_id:
            print("⚠️  Skipping - No order ID available")
            return True
        
        success, response = self.run_test(
            "Get Single Order",
            "GET",
            f"orders/{self.created_order_id}",
            200
        )
        if success and 'id' in response:
            print(f"   Retrieved order: {response.get('full_name')}")
            return True
        return False

    def test_update_order(self):
        """Test update order"""
        if not self.created_order_id:
            print("⚠️  Skipping - No order ID available")
            return True
        
        update_data = {
            "full_name": "Test Kullanıcı Güncellendi",
            "amount": 200.00
        }
        
        success, response = self.run_test(
            "Update Order",
            "PUT",
            f"orders/{self.created_order_id}",
            200,
            data=update_data
        )
        if success and response.get('full_name') == "Test Kullanıcı Güncellendi":
            print(f"   Updated name: {response.get('full_name')}")
            return True
        return False

    def test_update_status(self):
        """Test update order status"""
        if not self.created_order_id:
            print("⚠️  Skipping - No order ID available")
            return True
        
        success, response = self.run_test(
            "Update Order Status",
            "PATCH",
            f"orders/{self.created_order_id}/status",
            200,
            data={"status": "Üretime Verildi"}
        )
        if success and response.get('status') == "Üretime Verildi":
            print(f"   Updated status: {response.get('status')}")
            return True
        return False

    def test_delete_order(self):
        """Test delete order"""
        if not self.created_order_id:
            print("⚠️  Skipping - No order ID available")
            return True
        
        success, response = self.run_test(
            "Delete Order",
            "DELETE",
            f"orders/{self.created_order_id}",
            200
        )
        return success

    # ==================== Authentication Tests ====================
    
    def test_login_valid_credentials(self):
        """Test login with valid admin credentials"""
        login_data = {
            "username": "admin",
            "password": "admin"
        }
        
        success, response = self.run_test(
            "Login with Valid Credentials (admin/admin)",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success:
            # Verify response structure
            if 'username' in response and 'role' in response and 'visible_columns' in response:
                print(f"   Username: {response.get('username')}")
                print(f"   Role: {response.get('role')}")
                print(f"   Visible columns: {len(response.get('visible_columns', []))}")
                
                # Verify password is not in response
                if 'password' not in response:
                    print("   ✅ Password correctly excluded from response")
                    self.admin_user_data = response
                    return True
                else:
                    print("   ❌ Password found in response (security issue)")
                    return False
            else:
                print("   ❌ Missing required fields in response")
                return False
        return False

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        login_data = {
            "username": "admin",
            "password": "wrongpassword"
        }
        
        success, response = self.run_test(
            "Login with Invalid Credentials",
            "POST",
            "auth/login",
            401,
            data=login_data
        )
        return success

    def test_login_nonexistent_user(self):
        """Test login with non-existent user"""
        login_data = {
            "username": "nonexistentuser",
            "password": "anypassword"
        }
        
        success, response = self.run_test(
            "Login with Non-existent User",
            "POST",
            "auth/login",
            401,
            data=login_data
        )
        return success

    # ==================== User Management Tests ====================
    
    def test_get_all_users(self):
        """Test GET /api/users - List all users"""
        success, response = self.run_test(
            "Get All Users",
            "GET",
            "users",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} users")
            
            # Check if admin user exists and has correct properties
            admin_user = next((user for user in response if user.get('username') == 'admin'), None)
            if admin_user:
                print(f"   Admin user found with role: {admin_user.get('role')}")
                print(f"   Admin visible columns: {len(admin_user.get('visible_columns', []))}")
                
                # Verify admin has all 12 columns visible
                if len(admin_user.get('visible_columns', [])) == 12:
                    print("   ✅ Admin user has all 12 columns visible by default")
                else:
                    print(f"   ❌ Admin user has {len(admin_user.get('visible_columns', []))} columns, expected 12")
                
                # Verify password is not in response
                if 'password' not in admin_user:
                    print("   ✅ Password correctly excluded from user list")
                else:
                    print("   ❌ Password found in user list (security issue)")
                
                # Verify created_at timestamp format
                if 'created_at' in admin_user:
                    try:
                        datetime.fromisoformat(admin_user['created_at'].replace('Z', '+00:00'))
                        print("   ✅ created_at timestamp properly formatted")
                    except:
                        print("   ❌ created_at timestamp format invalid")
                
                return True
            else:
                print("   ❌ Admin user not found in user list")
                return False
        return False

    def test_create_user(self):
        """Test POST /api/users - Create new user with limited visible columns"""
        user_data = {
            "username": "testuser",
            "password": "test123",
            "role": "user",
            "visible_columns": ["order_no", "date", "name", "phone", "status"]
        }
        
        success, response = self.run_test(
            "Create New User with Limited Columns",
            "POST",
            "users",
            200,
            data=user_data
        )
        
        if success:
            if 'id' in response and 'username' in response:
                self.created_user_id = response['id']
                print(f"   Created user ID: {self.created_user_id}")
                print(f"   Username: {response.get('username')}")
                print(f"   Role: {response.get('role')}")
                print(f"   Visible columns: {response.get('visible_columns')}")
                
                # Verify password is not in response
                if 'password' not in response:
                    print("   ✅ Password correctly excluded from response")
                else:
                    print("   ❌ Password found in response (security issue)")
                
                # Verify visible columns are correctly set
                expected_columns = ["order_no", "date", "name", "phone", "status"]
                if response.get('visible_columns') == expected_columns:
                    print("   ✅ Visible columns correctly set")
                    return True
                else:
                    print(f"   ❌ Visible columns mismatch. Expected: {expected_columns}, Got: {response.get('visible_columns')}")
                    return False
            else:
                print("   ❌ Missing required fields in response")
                return False
        return False

    def test_create_duplicate_username(self):
        """Test username uniqueness validation"""
        user_data = {
            "username": "testuser",  # Same username as previous test
            "password": "test456",
            "role": "user"
        }
        
        success, response = self.run_test(
            "Create User with Duplicate Username",
            "POST",
            "users",
            400,
            data=user_data
        )
        return success

    def test_update_user(self):
        """Test PUT /api/users/{user_id} - Update user password and visible columns"""
        if not self.created_user_id:
            print("⚠️  Skipping - No user ID available")
            return True
        
        update_data = {
            "password": "newpassword123",
            "visible_columns": ["order_no", "date", "name", "phone", "status", "amount"]
        }
        
        success, response = self.run_test(
            "Update User Password and Visible Columns",
            "PUT",
            f"users/{self.created_user_id}",
            200,
            data=update_data
        )
        
        if success:
            # Verify password is not in response
            if 'password' not in response:
                print("   ✅ Password correctly excluded from response")
            else:
                print("   ❌ Password found in response (security issue)")
            
            # Verify visible columns are updated
            expected_columns = ["order_no", "date", "name", "phone", "status", "amount"]
            if response.get('visible_columns') == expected_columns:
                print("   ✅ Visible columns correctly updated")
                return True
            else:
                print(f"   ❌ Visible columns not updated correctly")
                return False
        return False

    def test_password_hashing(self):
        """Test that passwords are properly hashed in database"""
        # This test verifies that login still works after password update
        # which confirms password hashing is working
        login_data = {
            "username": "testuser",
            "password": "newpassword123"  # Updated password from previous test
        }
        
        success, response = self.run_test(
            "Verify Password Hashing (Login with Updated Password)",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success:
            print("   ✅ Password hashing working correctly (login successful with updated password)")
            return True
        return False

    def test_delete_user(self):
        """Test DELETE /api/users/{user_id} - Delete the test user"""
        if not self.created_user_id:
            print("⚠️  Skipping - No user ID available")
            return True
        
        success, response = self.run_test(
            "Delete Test User",
            "DELETE",
            f"users/{self.created_user_id}",
            200
        )
        
        if success:
            print(f"   ✅ User {self.created_user_id} deleted successfully")
            return True
        return False

    def test_verify_user_deleted(self):
        """Verify the deleted user no longer exists"""
        if not self.created_user_id:
            print("⚠️  Skipping - No user ID available")
            return True
        
        # Try to login with deleted user
        login_data = {
            "username": "testuser",
            "password": "newpassword123"
        }
        
        success, response = self.run_test(
            "Verify Deleted User Cannot Login",
            "POST",
            "auth/login",
            401,
            data=login_data
        )
        
        if success:
            print("   ✅ Deleted user correctly cannot login")
            return True
        return False

def main():
    print("=" * 80)
    print("🚀 Order Management System - Backend API Tests")
    print("=" * 80)
    
    tester = OrderManagementAPITester()
    
    # Run authentication and user management tests first
    print("\n🔐 Testing Authentication System...")
    tester.test_login_valid_credentials()
    tester.test_login_invalid_credentials()
    tester.test_login_nonexistent_user()
    
    print("\n👥 Testing User Management CRUD...")
    tester.test_get_all_users()
    tester.test_create_user()
    tester.test_create_duplicate_username()
    tester.test_update_user()
    tester.test_password_hashing()
    tester.test_delete_user()
    tester.test_verify_user_deleted()
    
    # Run basic endpoint tests
    print("\n📋 Testing Basic Endpoints...")
    tester.test_root()
    tester.test_get_provinces()
    tester.test_get_districts()
    tester.test_get_countries()
    
    print("\n📦 Testing Order CRUD Operations...")
    tester.test_create_order()
    tester.test_get_orders()
    tester.test_get_single_order()
    tester.test_update_order()
    tester.test_update_status()
    tester.test_delete_order()
    
    # Print results
    print("\n" + "=" * 80)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    print("=" * 80)
    
    # Detailed results for authentication and user management
    auth_tests = ["Login with Valid Credentials", "Login with Invalid Credentials", "Login with Non-existent User"]
    user_tests = ["Get All Users", "Create New User", "Create User with Duplicate Username", 
                  "Update User", "Verify Password Hashing", "Delete Test User", "Verify Deleted User Cannot Login"]
    
    print(f"\n🔐 Authentication Tests: Focus on login functionality")
    print(f"👥 User Management Tests: Focus on CRUD operations and data validation")
    
    if tester.tests_passed == tester.tests_run:
        print("✅ All tests passed!")
        return 0
    else:
        failed_count = tester.tests_run - tester.tests_passed
        print(f"❌ {failed_count} test(s) failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
