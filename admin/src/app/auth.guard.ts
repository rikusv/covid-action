import { Injectable } from '@angular/core'
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { UserService } from './user.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  user$ = this.userService.user$

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.user$.pipe(
      map(user => {
        let allowed: boolean
        if (next.data.role) {
          allowed = user.roles[next.data.role]
        } else {
          allowed = user !== null
        }
        if (!allowed) {
          this.router.navigate(['/'])
        }
        return allowed
      })
    )
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.canActivate(next, state)
  }
}
