import logging
import json
from typing import Any, Dict

# Define keys to mask
SENSITIVE_KEYS = {"password", "token", "refresh_token", "access_token", "authorization", "cookie", "secret"}

def mask_sensitive_data(payload: Any) -> Any:
    if isinstance(payload, dict):
        masked = {}
        for k, v in payload.items():
            if k.lower() in SENSITIVE_KEYS:
                masked[k] = "******"
            else:
                masked[k] = mask_sensitive_data(v)
        return masked
    elif isinstance(payload, list):
        return [mask_sensitive_data(item) for item in payload]
    return payload

def setup_logger():
    logger = logging.getLogger("tbs_backend")
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
    return logger

logger = setup_logger()

def log_api_error(
    method: str,
    endpoint: str,
    status_code: int,
    category: str,
    message: str,
    payload: Any = None,
    stack_trace: str = None
):
    log_lines = [
        f"{method} {endpoint}",
        f"Status: {status_code}",
        "",
        f"Category: {category}",
        f"Message: {message}"
    ]

    if payload is not None:
        try:
            if isinstance(payload, bytes):
                # Attempt to parse json bytes
                parsed_payload = json.loads(payload.decode('utf-8'))
            elif isinstance(payload, str):
                parsed_payload = json.loads(payload)
            else:
                parsed_payload = payload
                
            masked_payload = mask_sensitive_data(parsed_payload)
            formatted_payload = json.dumps(masked_payload, indent=2)
            log_lines.extend(["", "Payload:", formatted_payload])
        except Exception:
            # If payload is not JSON parseable, just stringify it (without masking, but typically safe if not dict)
            if isinstance(payload, bytes):
                log_lines.extend(["", "Payload:", payload.decode('utf-8', errors='ignore')])
            else:
                log_lines.extend(["", "Payload:", str(payload)])

    if stack_trace:
        log_lines.extend(["", "Stack Trace:", stack_trace])

    logger_message = "\n".join(log_lines)
    logger.error("\n" + logger_message + "\n")
