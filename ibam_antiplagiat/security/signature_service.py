import hashlib
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.hazmat.backends import default_backend

def generate_key_pair():
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
        backend=default_backend()
    )
    public_key = private_key.public_key()
    return private_key, public_key

def sign_document(document_path, private_key):
    """Signature RSA-2048 + SHA-256 + PKCS#7"""
    with open(document_path, "rb") as f:
        document_data = f.read()
        
    hash_sha256 = hashlib.sha256(document_data).hexdigest()
    
    signature = private_key.sign(
        document_data,
        padding.PKCS1v15(),
        hashes.SHA256()
    )
    return signature.hex(), hash_sha256
