import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white dark:bg-team-navy border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl">
        
        <!-- Header -->
        <div class="text-center">
          <div class="mx-auto h-12 w-12 rounded-full bg-team-gold text-team-navy flex items-center justify-center font-display font-bold text-2xl">
            FT
          </div>
          <h2 class="mt-6 text-3xl font-display font-bold text-team-navy dark:text-white">
            Sign In
          </h2>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Access Young Peace FT Management Portal
          </p>
        </div>

        <!-- Error Message -->
        @if (errorMessage()) {
          <div class="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 p-4 rounded-r-lg text-sm text-red-700 dark:text-red-400">
            <div class="flex">
              <span class="material-icons mr-2 text-base">error</span>
              <span>{{ errorMessage() }}</span>
            </div>
          </div>
        }

        <!-- Form -->
        <form class="mt-8 space-y-6" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div>
              <label for="email-address" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                [(ngModel)]="email"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-team-gold/50 focus:border-team-gold transition-colors"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                [(ngModel)]="password"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-team-gold/50 focus:border-team-gold transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-team-navy bg-team-gold hover:bg-team-gold-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-team-gold transition-colors"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <span class="material-icons text-team-navy group-hover:scale-110 transition-transform">lock</span>
              </span>
              Sign In
            </button>
          </div>
        </form>

        <!-- Quick Logins for Demo -->
        <div class="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 text-center">
            Demo Accounts for Evaluation
          </h3>
          <div class="grid grid-cols-2 gap-2">
            <button
              (click)="quickLogin('admin@youngpeace.com', 'admin123')"
              class="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
            >
              <span class="text-xs font-bold text-team-navy dark:text-white">Administrator</span>
              <span class="text-[10px] text-slate-500">Full Access (Super)</span>
            </button>
            
            <button
              (click)="quickLogin('coach@youngpeace.com', 'coach123')"
              class="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
            >
              <span class="text-xs font-bold text-team-navy dark:text-white">Coach Tommy</span>
              <span class="text-[10px] text-slate-500">Admin Role (Assigned)</span>
            </button>
            
            <button
              (click)="quickLogin('editor@youngpeace.com', 'editor123')"
              class="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
            >
              <span class="text-xs font-bold text-team-navy dark:text-white">Editor Alex</span>
              <span class="text-[10px] text-slate-500">User Role (Unassigned)</span>
            </button>

            <button
              (click)="quickLogin('user@youngpeace.com', 'user123')"
              class="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
            >
              <span class="text-xs font-bold text-team-navy dark:text-white">Regular Fan</span>
              <span class="text-[10px] text-slate-500">User Role (Unassigned)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = signal<string | null>(null);

  onSubmit() {
    this.errorMessage.set(null);

    if (!this.email || !this.password) {
      this.errorMessage.set('Please fill out all fields.');
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        if (user && (user.role === 'Administrator' || user.role === 'Admin')) {
          this.router.navigate(['/admin']);
        } else {
          // Logged in but has no admin privileges
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMessage.set(err.error?.message || 'Invalid email or password.');
      }
    });
  }

  quickLogin(email: string, pass: string) {
    this.email = email;
    this.password = pass;
    this.onSubmit();
  }
}
