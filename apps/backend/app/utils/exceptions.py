from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.utils.responses import error_response
from app.utils.logger import log_api_error
import traceback
import json

def _json_safe(value):
    """
    Coerce anything Pydantic hands back into something `JSONResponse` can render.

    Pydantic v2 puts the raw exception object in `ctx["error"]` whenever a custom
    validator raises, and `exc.body` is undecoded bytes when the request was not
    valid JSON. Serializing either one throws, and a throw *inside* an exception
    handler escapes past the CORS middleware — so the browser saw an opaque
    "Failed to fetch" instead of the 400 that was meant for it.
    """
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    if isinstance(value, dict):
        return {str(key): _json_safe(item) for key, item in value.items()}
    if isinstance(value, (list, tuple, set)):
        return [_json_safe(item) for item in value]
    return str(value)


def _field_path(err) -> str:
    """The offending field, with Pydantic's leading 'body'/'query' marker dropped."""
    return ".".join(str(part) for part in err.get("loc", ["body"])[1:]) or "request"


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    body = exc.body

    # We want to format the validation error for better logging
    error_details = exc.errors()
    formatted_errors = []
    summaries = []

    for err in error_details:
        loc = _field_path(err)
        formatted_errors.append(f"Field:\n{loc}\n\nExpected:\n{err.get('ctx', {}).get('expected', err.get('type'))}\n\nReceived:\n{repr(err.get('input'))}")
        # "Value error, " is Pydantic's own prefix on a raised ValueError; the text
        # after it is what the validator actually wrote for the reader.
        reason = str(err.get("msg", "is invalid")).removeprefix("Value error, ")
        summaries.append(f"{loc}: {reason}")

    message = "Validation Error\n\n" + "\n\n---\n\n".join(formatted_errors)

    log_api_error(
        method=request.method,
        endpoint=request.url.path,
        status_code=status.HTTP_400_BAD_REQUEST,
        category="Validation Error",
        message=message,
        payload=body
    )

    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            # `success` and `message` match the envelope every other response uses,
            # so a caller can read the reason without walking `detail`. `detail` and
            # `body` stay as they were — existing callers still parse them.
            "success": False,
            "message": "; ".join(summaries) or "Validation Error",
            "detail": _json_safe(error_details),
            "body": _json_safe(body),
        }
    )

async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    # Retrieve body only if available (like POST/PUT)
    body = None
    if request.method in ["POST", "PUT", "PATCH"]:
        try:
            body = await request.json()
        except Exception:
            pass

    log_api_error(
        method=request.method,
        endpoint=request.url.path,
        status_code=exc.status_code,
        category="Business Logic",
        message=str(exc.detail),
        payload=body
    )
    
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

async def global_exception_handler(request: Request, exc: Exception):
    import pymongo.errors
    
    body = None
    if request.method in ["POST", "PUT", "PATCH"]:
        try:
            body = await request.json()
        except Exception:
            pass
            
    if isinstance(exc, pymongo.errors.PyMongoError):
        category = "Database Error"
        message = str(exc)
    else:
        category = "Unexpected Error"
        message = str(exc)

    log_api_error(
        method=request.method,
        endpoint=request.url.path,
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        category=category,
        message=message,
        payload=body,
        stack_trace=traceback.format_exc()
    )
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=error_response(message="Internal Server Error")
    )

