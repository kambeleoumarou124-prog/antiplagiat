import bleach

def sanitize_input(text: str) -> str:
    """Sanitisation entrées avec bleach."""
    if not text:
        return text
    return bleach.clean(text, tags=[], attributes={}, strip=True)
