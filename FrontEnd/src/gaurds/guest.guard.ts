import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/Auth.service';
export const guestGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;
  }
  router.navigateByUrl("/access-denied")
  return false;
};
