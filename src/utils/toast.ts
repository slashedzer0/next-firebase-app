import { toast as sonnerToast, type ToastT } from 'sonner';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  title: string;
  type?: ToastType;
}

function createToast(message: string, type?: ToastType, options?: Partial<ToastT>) {
  const baseOptions: Omit<ToastT, 'id'> = {
    ...options,
  };

  switch (type) {
    case 'success':
      return sonnerToast.success(message, baseOptions);
    case 'error':
      return sonnerToast.error(message, baseOptions);
    case 'warning':
      return sonnerToast.warning(message, baseOptions);
    default:
      return sonnerToast(message, baseOptions);
  }
}

// Detailed API
function toast({ title, type = 'info' }: ToastOptions) {
  return createToast(title, type);
}

// Simple API extensions
toast.success = (message: string) => createToast(message, 'success');
toast.error = (message: string) => createToast(message, 'error');
toast.warning = (message: string) => createToast(message, 'warning');
toast.info = (message: string) => createToast(message, 'info');

export { toast };
