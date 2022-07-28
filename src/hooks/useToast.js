import { useRef } from 'react';
import { toast } from 'react-toastify';

export const useToast = () => {
  const toastId = useRef(null);

  const showToast = (status, message) => {
    if (status === 'error') {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error(message);
      }
    } else if (status === 'success') {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success(message);
      }
    }
  };

  return showToast;
};
