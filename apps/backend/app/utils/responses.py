from typing import Any, Optional

def success_response(data: Any = None, message: str = "Success"):
    return {
        "success": True,
        "message": message,
        "data": data
    }

def error_response(message: str = "An error occurred", data: Any = None):
    return {
        "success": False,
        "message": message,
        "data": data
    }
