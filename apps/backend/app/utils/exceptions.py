from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.utils.responses import error_response
from app.utils.logger import log_api_error
import traceback
import json

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    body = exc.body
    
    # We want to format the validation error for better logging
    error_details = exc.errors()
    formatted_errors = []
    
    for err in error_details:
        loc = ".".join(str(l) for l in err.get("loc", ["body"])[1:]) # skip 'body'
        formatted_errors.append(f"Field:\n{loc}\n\nExpected:\n{err.get('ctx', {}).get('expected', err.get('type'))}\n\nReceived:\n{repr(err.get('input'))}")

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
        content={"detail": error_details, "body": body}
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

