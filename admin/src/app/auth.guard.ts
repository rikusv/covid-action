import { Injectable } from '@angular/core'
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

import { UserService } from './user.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  authUser$ = this.userService.authUser$
  user$ = this.userService.user$

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    this.userService.setTargetUrl(state.url)
    return this.authUser$.pipe(
      switchMap(authUser => {
        if (!authUser) {
          return of(false)
        } else if (!next.data.role) {
          return of(true)
        } else {
          return this.user$
        }
      }),
      map(userOrResult => {
        let allowed: boolean
        if (userOrResult === true || userOrResult === false) {
          allowed = userOrResult
        } else {
          allowed = userOrResult.roles && userOrResult.roles[next.data.role]
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
