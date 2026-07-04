from fastapi import Request, status
from fastapi.responses import JSONResponse
from app.utils.responses import error_response

async def global_exception_handler(request: Request, exc: Exception):
    import traceback
    traceback.print_exc() # In production, use proper logging
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=error_response(message="Internal Server Error")
    )
