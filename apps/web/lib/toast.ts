// @repo/lib/toastUtils.ts
import { toast, ToastPosition } from 'react-toastify';

const toastConfig = {
  position: 'top-right' as ToastPosition,
  autoClose: 2000,
  theme: 'dark',
};

export const showSuccess = (msg: string) => {
  toast.success(msg, toastConfig);
};

export const showError = (msg: string) => {
  toast.error(msg, toastConfig);
};
