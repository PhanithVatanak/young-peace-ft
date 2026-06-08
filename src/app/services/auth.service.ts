import { Injectable, signal, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export type UserRole = 'Administrator' | 'Admin' | 'User';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private sessionKey = 'yp_current_user';
  private isBrowser: boolean;

  currentUser = signal<AppUser | null>(null);
  users = signal<AppUser[]>([]);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.initDatabase();
  }

  private initDatabase() {
    if (!this.isBrowser) return;

    // Restore local session state immediately for visual responsiveness
    const savedSession = localStorage.getItem(this.sessionKey);
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        this.currentUser.set(parsed);
        if (parsed.role === 'Administrator') {
          this.loadAllUsers();
        }
      } catch (e) {
        localStorage.removeItem(this.sessionKey);
      }
    }

    const savedToken = localStorage.getItem('yp_token');
    if (savedToken) {
      // Validate session and fetch latest user profile from server
      this.http.get<any>('/api/auth/me').subscribe({
        next: (user) => {
          const mappedUser: AppUser = {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
          };
          this.currentUser.set(mappedUser);
          localStorage.setItem(this.sessionKey, JSON.stringify(mappedUser));
          
          if (mappedUser.role === 'Administrator') {
            this.loadAllUsers();
          }
        },
        error: () => {
          // Token is expired or invalid
          this.logout();
        }
      });
    }
  }

  loadAllUsers() {
    if (!this.isBrowser) return;
    this.http.get<any[]>('/api/users').subscribe({
      next: (usersList) => {
        const mappedUsers: AppUser[] = usersList.map(u => ({
          id: u.id.toString(),
          name: u.name,
          email: u.email,
          role: u.role
        }));
        this.users.set(mappedUsers);
      },
      error: (err) => {
        console.error('Failed to load users list from server:', err);
      }
    });
  }

  login(email: string, password: string): Observable<AppUser> {
    return this.http.post<any>('/api/auth/login', { email, password }).pipe(
      map(res => {
        const user: AppUser = {
          id: res.user.id.toString(),
          name: res.user.name,
          email: res.user.email,
          role: res.user.role
        };
        if (this.isBrowser) {
          localStorage.setItem('yp_token', res.token);
          localStorage.setItem(this.sessionKey, JSON.stringify(user));
        }
        this.currentUser.set(user);

        if (user.role === 'Administrator') {
          this.loadAllUsers();
        }

        return user;
      })
    );
  }

  logout() {
    this.currentUser.set(null);
    this.users.set([]);
    if (this.isBrowser) {
      localStorage.removeItem(this.sessionKey);
      localStorage.removeItem('yp_token');
    }
  }

  createUser(name: string, email: string, role: UserRole): Observable<any> {
    return this.http.post<any>('/api/users', { name, email, role }).pipe(
      tap(() => {
        // Refresh users list if current user is super admin
        if (this.currentUser()?.role === 'Administrator') {
          this.loadAllUsers();
        }
      })
    );
  }

  updateUserRole(userId: string, role: UserRole): Observable<any> {
    return this.http.patch<any>(`/api/users/${userId}/role`, { role }).pipe(
      tap(res => {
        // Refresh users list
        if (this.currentUser()?.role === 'Administrator') {
          this.loadAllUsers();
        }
        
        // If updating the active user's own role (e.g. self-demotion, though usually super-admin is locked)
        const current = this.currentUser();
        if (current && current.id === userId) {
          const updatedCurrent = { ...current, role };
          this.currentUser.set(updatedCurrent);
          if (this.isBrowser) {
            localStorage.setItem(this.sessionKey, JSON.stringify(updatedCurrent));
          }
        }
      })
    );
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`/api/users/${userId}`).pipe(
      tap(() => {
        // Refresh users list
        if (this.currentUser()?.role === 'Administrator') {
          this.loadAllUsers();
        }
        
        // If deleting oneself, logout
        const current = this.currentUser();
        if (current && current.id === userId) {
          this.logout();
        }
      })
    );
  }

  hasRole(roles: UserRole[]): boolean {
    const user = this.currentUser();
    return !!user && roles.includes(user.role);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }
}
