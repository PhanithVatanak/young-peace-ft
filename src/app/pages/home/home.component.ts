import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CommonModule],
  template: `
    <!-- Hero Section -->
    <section class="relative bg-team-navy overflow-hidden">
      <!-- Background Graphic -->
      <div class="absolute inset-0 opacity-20 pointer-events-none">
        <div class="absolute -right-20 -top-20 w-96 h-96 bg-team-gold/30 rounded-full blur-3xl"></div>
        <div class="absolute -left-20 top-40 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col lg:flex-row items-center gap-12 text-white">
        <div class="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div class="bg-white/10 text-team-gold text-sm font-semibold px-3 py-1 rounded-full mb-6 border border-white/20 inline-flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-team-gold animate-pulse"></span>
            Established 2020
          </div>
          <h1 class="text-5xl lg:text-7xl font-display font-bold tracking-tight mb-6 leading-tight">
            Young Peace <br class="hidden sm:block"/> <span class="text-transparent bg-clip-text bg-gradient-to-r from-team-gold to-yellow-200">Football Team</span>
          </h1>
          <p class="text-lg text-slate-300 max-w-2xl mb-8 font-medium italic border-l-4 border-team-gold pl-4">
            "Play with Passion, Win with Unity"
          </p>
          <div class="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start">
            <a routerLink="/players" class="bg-team-gold hover:bg-yellow-400 text-team-navy font-bold px-8 py-3 rounded-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
              Meet the Squad <span class="material-icons text-sm">arrow_forward</span>
            </a>
            <a routerLink="/lineup" class="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-8 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              View Lineups <span class="material-icons text-sm">sports_soccer</span>
            </a>
          </div>
        </div>
        
        <div class="flex-1 w-full max-w-md relative">
           <!-- Decorative Pitch Graphic -->
           <div class="aspect-[3/4] bg-pitch-green rounded-2xl border-4 border-white/20 shadow-2xl relative overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
             <!-- Pitch Lines -->
             <div class="absolute inset-4 border-2 border-white/40 rounded"></div>
             <div class="absolute top-1/2 left-4 right-4 h-0 border-t-2 border-white/40"></div>
             <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/40 rounded-full"></div>
             <!-- D-box -->
             <div class="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-16 border-2 border-b-0 border-white/40 rounded-t-lg"></div>
             <div class="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-16 border-2 border-t-0 border-white/40 rounded-b-lg"></div>
           </div>
        </div>
      </div>
    </section>

    <!-- Fast Stats -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <span class="material-icons text-team-gold text-3xl mb-2">emoji_events</span>
          <span class="text-4xl font-display font-bold text-team-navy mb-1 leading-none">85</span>
          <span class="text-sm font-medium text-slate-500 uppercase tracking-wider">Win Rate %</span>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <span class="material-icons text-team-gold text-3xl mb-2">sports_soccer</span>
          <span class="text-4xl font-display font-bold text-team-navy mb-1 leading-none">124</span>
          <span class="text-sm font-medium text-slate-500 uppercase tracking-wider">Goals Scored</span>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <span class="material-icons text-team-gold text-3xl mb-2">group</span>
          <span class="text-4xl font-display font-bold text-team-navy mb-1 leading-none">15</span>
          <span class="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Players</span>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <span class="material-icons text-team-gold text-3xl mb-2">local_fire_department</span>
          <span class="text-4xl font-display font-bold text-team-navy mb-1 leading-none">5</span>
          <span class="text-sm font-medium text-slate-500 uppercase tracking-wider">Current Streak</span>
        </div>
      </div>
    </section>

    <!-- Recent Matches -->
    <section class="bg-slate-100 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-8">
          <div>
            <h2 class="text-3xl font-display font-bold text-team-navy tracking-tight">Recent Matches</h2>
            <p class="text-slate-500 mt-2">Latest results from the pitch.</p>
          </div>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (match of recentMatches(); track match.id) {
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div class="relative bg-team-navy p-4 flex justify-between items-center text-white">
                <div class="font-bold font-display opacity-80 text-sm">FT</div>
                <div class="bg-white/20 px-2 py-0.5 rounded text-xs font-medium">{{match.date}}</div>
              </div>
              <div class="p-6 flex items-center justify-between">
                <div class="text-center w-1/3">
                  <div class="w-12 h-12 bg-team-navy rounded-full mx-auto mb-2 flex items-center justify-center border-2 border-team-gold text-team-gold font-bold">YP</div>
                  <div class="font-medium text-sm truncate">Young Peace</div>
                </div>
                
                <div class="text-center px-4 w-1/3">
                   <div class="text-3xl font-display font-bold flex justify-center gap-2 items-center">
                     <span [class.text-pitch-green]="match.ourScore > match.oppScore">{{match.ourScore}}</span>
                     <span class="text-slate-300 text-sm font-normal">-</span>
                     <span>{{match.oppScore}}</span>
                   </div>
                   <div class="text-xs uppercase tracking-widest font-semibold mt-1" 
                        [ngClass]="{
                          'text-pitch-green': match.ourScore > match.oppScore,
                          'text-red-500': match.ourScore < match.oppScore,
                          'text-slate-500': match.ourScore === match.oppScore
                        }">
                     {{ match.ourScore > match.oppScore ? 'Win' : (match.ourScore < match.oppScore ? 'Loss' : 'Draw') }}
                   </div>
                </div>

                <div class="text-center w-1/3">
                  <div class="w-12 h-12 bg-slate-100 rounded-full mx-auto mb-2 flex items-center justify-center border-2 border-slate-200 text-slate-400">
                    <span class="material-icons">sports_soccer</span>
                  </div>
                  <div class="font-medium text-sm text-slate-600 truncate">{{match.opponent}}</div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class HomeComponent {
  recentMatches = signal([
    { id: 1, opponent: 'City Rovers', date: 'Oct 12, 2026', ourScore: 3, oppScore: 1 },
    { id: 2, opponent: 'Northside FC', date: 'Oct 05, 2026', ourScore: 2, oppScore: 2 },
    { id: 3, opponent: 'United Stars', date: 'Sep 28, 2026', ourScore: 4, oppScore: 0 },
  ]);
}
