import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Check if we are running in the browser and have access to localStorage
  let token: string | null = null;
  if (typeof window !== 'undefined' && window.localStorage) {
    token = localStorage.getItem('yp_token');
  }

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};
