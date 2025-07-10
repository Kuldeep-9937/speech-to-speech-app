from langdetect import detect

def detect_language(text):
    try:
        lang_code = detect(text)
        return lang_code
    except:
        return "en"

LANGUAGE_CODES = {
    "en": "en-US",
    "hi": "hi-IN",
    "or": "or-IN",
    "te": "te-IN"
}
