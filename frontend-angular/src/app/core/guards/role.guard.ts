import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = (route.data?.['roles'] as string[]) || [];

  if (allowedRoles.length === 0 || auth.hasAnyRole(allowedRoles)) {
    return true;
  }

  router.navigateByUrl(auth.getDefaultRedirectUrl());
  return false;
};
