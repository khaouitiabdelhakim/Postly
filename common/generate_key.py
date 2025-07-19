import secrets
import base64

def generate_jwt_secret_key(key_length=128):
    """
    Generate a secure random secret key for JWT.
    
    Args:
        key_length (int): Length of the key in bytes. Default is 128.
        
    Returns:
        str: A URL-safe base64-encoded secret key
    """
    if key_length < 32:
        print("Warning: For JWT, it's recommended to use at least 256-bit (32-byte) keys for HS256")
    
    # Generate random bytes
    random_bytes = secrets.token_bytes(key_length)
    
    # Encode in URL-safe base64 without padding
    secret_key = base64.urlsafe_b64encode(random_bytes).decode('utf-8').rstrip('=')
    
    return secret_key

if __name__ == "__main__":
    # Generate a 32-byte (256-bit) secret key by default
    secret_key = generate_jwt_secret_key()
    
    print("Generated JWT Secret Key:")
    print(secret_key)
    print("\nNote: Keep this key secure and don't expose it in your code or version control.")