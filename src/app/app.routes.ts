import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'players', loadComponent: () => import('./pages/players/players.component').then(m => m.PlayersComponent) },
  { path: 'lineup', loadComponent: () => import('./pages/lineup/lineup.component').then(m => m.LineupComponent) },
  { path: 'stats', loadComponent: () => import('./pages/stats/stats.component').then(m => m.StatsComponent) },
  { 
    path: 'admin', 
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [authGuard]
  },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  
  { path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'videos', loadComponent: () => import('./pages/videos/videos.component').then(m => m.VideosComponent) },
  { path: 'gallery', loadComponent: () => import('./pages/gallery/gallery.component').then(m => m.GalleryComponent) },
  { path: 'achievements', loadComponent: () => import('./pages/achievements/achievements.component').then(m => m.AchievementsComponent) },
  { path: 'news', loadComponent: () => import('./pages/news/news.component').then(m => m.NewsComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'match-center', loadComponent: () => import('./pages/match-center/match-center.component').then(m => m.MatchCenterComponent) },
  
  { path: '**', redirectTo: '' }
];
