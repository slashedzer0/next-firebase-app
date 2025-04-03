import { toast as sonnerToast, type ToastT } from 'sonner';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  title?: string;
  description: string;
  type?: ToastType;
}

export function toast({ title, description, type = 'info' }: ToastOptions) {
  const options: ToastT = {
    ...(title && { title }),
    description,
    id: '',
  };

  switch (type) {
    case 'success':
      return sonnerToast.success(title || description, options);
    case 'error':
      return sonnerToast.error(title || description, options);
    case 'warning':
      return sonnerToast.warning(title || description, options);
    default:
      return sonnerToast(title || description, options);
  }
}
