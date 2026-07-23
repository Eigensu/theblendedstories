import React from 'react';
import { toast } from 'sonner';

export const handleApiError = (actionName: string, err: any) => {
  // Log to console for developer debugging
  console.error(`[API Error] ${actionName}:`, err);

  const responseData = err.response?.data;
  let detail = responseData?.detail;

  // Handle generic network or unknown errors
  if (!detail) {
    toast.error(actionName, {
      description: 'Reason: Network or unknown error occurred.',
      duration: 5000,
    });
    return;
  }

  // Handle Pydantic Validation Error array
  if (Array.isArray(detail)) {
    // Summarize the first error to keep it clean
    const firstErr = detail[0];
    const field = firstErr.loc ? firstErr.loc.slice(1).join('.') : 'Unknown Field';
    const message = firstErr.msg || 'Validation failed';
    
    toast.error(actionName, {
      description: `Reason: ${field} - ${message}`,
      duration: 5000,
    });
    return;
  }

  // Handle string detail (Business Logic / General Exceptions)
  if (typeof detail === 'string') {
    toast.error(actionName, {
      description: `Reason: ${detail}`,
      duration: 5000,
    });
    return;
  }

  // Fallback for unexpected format
  toast.error(`${actionName} failed`);
};
