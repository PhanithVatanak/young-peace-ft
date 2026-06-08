import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-team-navy-dark dark:text-slate-200">
      <!-- Navbar -->
      <header class="sticky top-0 z-50 bg-team-navy border-b border-white/10 text-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div class="flex items-center gap-3" routerLink="/">
            <div class="w-10 h-10 bg-team-gold text-team-navy rounded-full flex items-center justify-center font-display font-bold text-xl cursor-pointer">
              FT
            </div>
            <span class="font-display font-bold text-lg hidden sm:block tracking-tight cursor-pointer">Young Peace</span>
          </div>
          
          <nav class="hidden md:flex items-center gap-6 text-sm font-medium">
            <a routerLink="/" routerLinkActive="text-team-gold" [routerLinkActiveOptions]="{exact: true}" class="hover:text-slate-300 transition-colors">Home</a>
            <a routerLink="/about" routerLinkActive="text-team-gold" class="hover:text-slate-300 transition-colors">Story</a>
            <a routerLink="/players" routerLinkActive="text-team-gold" class="hover:text-slate-300 transition-colors">Squad</a>
            <a routerLink="/lineup" routerLinkActive="text-team-gold" class="hover:text-slate-300 transition-colors">Lineup</a>
            <a routerLink="/match-center" routerLinkActive="text-team-gold" class="hover:text-slate-300 transition-colors">Matches</a>
            <a routerLink="/stats" routerLinkActive="text-team-gold" class="hover:text-slate-300 transition-colors">Stats</a>
            
            <div class="relative group cursor-pointer inline-flex items-center">
               <span class="hover:text-slate-300 transition-colors flex items-center gap-1">More <span class="material-icons text-[14px]">expand_more</span></span>
               <div class="absolute top-full right-0 mt-2 w-48 bg-white text-team-navy rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2 font-medium overflow-hidden">
                 <a routerLink="/news" class="px-4 py-2 hover:bg-slate-50 hover:text-team-gold transition-colors">News</a>
                 <a routerLink="/gallery" class="px-4 py-2 hover:bg-slate-50 hover:text-team-gold transition-colors">Gallery</a>
                 <a routerLink="/videos" class="px-4 py-2 hover:bg-slate-50 hover:text-team-gold transition-colors">Videos</a>
                 <a routerLink="/achievements" class="px-4 py-2 hover:bg-slate-50 hover:text-team-gold transition-colors">Achievements</a>
                 <div class="h-px bg-slate-100 my-1 mx-2"></div>
                 <a routerLink="/contact" class="px-4 py-2 hover:bg-slate-50 hover:text-team-gold transition-colors">Contact</a>
               </div>
            </div>
          </nav>

          <div class="flex items-center gap-4">
            <!-- Admin Link: show only for Administrator or Admin role -->
            @if (authService.hasRole(['Administrator', 'Admin'])) {
              <a routerLink="/admin" class="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                <span class="material-icons text-sm">shield</span>
                <span class="hidden sm:block">Admin</span>
              </a>
            }

            <!-- Auth Button / User Info -->
            @if (authService.currentUser(); as user) {
              <div class="flex items-center gap-3">
                <div class="hidden sm:flex flex-col text-right">
                  <span class="text-xs font-semibold leading-tight text-white">{{ user.name }}</span>
                  <span class="text-[10px] text-team-gold font-bold uppercase tracking-wider leading-none">{{ user.role }}</span>
                </div>
                <div class="w-8 h-8 rounded-full bg-team-gold text-team-navy flex items-center justify-center font-bold text-sm select-none">
                  {{ user.name.charAt(0) }}
                </div>
                <button 
                  (click)="logout()" 
                  class="text-white/70 hover:text-white transition-colors p-1"
                  title="Sign Out"
                >
                  <span class="material-icons text-lg">logout</span>
                </button>
              </div>
            } @else {
              <a 
                routerLink="/login" 
                class="bg-team-gold hover:bg-team-gold-light text-team-navy font-bold px-4 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1"
              >
                <span class="material-icons text-sm">login</span> Login
              </a>
            }
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 w-full max-w-7xl mx-auto">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-team-navy text-slate-400 py-8 border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 text-center">
          <p class="font-display font-bold text-slate-200 text-lg mb-2">Young Peace Football Team</p>
          <p class="italic text-sm text-team-gold/80 mb-4">"Play with Passion, Win with Unity"</p>
          <p class="text-xs">&copy; 2026 Young Peace FT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `
})
export class App {
  authService = inject(AuthService);
  private routerService = inject(Router);

  logout() {
    this.authService.logout();
    this.routerService.navigate(['/']);
  }
}
