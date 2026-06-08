import { Component, signal, ChangeDetectionStrategy, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayersService, Player } from '../../services/players.service';

@Component({
  selector: 'app-players',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div class="mb-10 text-center">
        <h1 class="text-4xl font-display font-bold text-team-navy tracking-tight mb-4">The Squad</h1>
        <p class="text-slate-500 max-w-2xl mx-auto">Meet the players of Young Peace Football Team. A collective dedicated to passion, unity, and excellence on the pitch.</p>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap items-center justify-center gap-2 mb-12">
        @for (pos of positions(); track pos) {
          <button 
            (click)="filterBy(pos)"
            class="px-6 py-2 rounded-full font-medium transition-colors border"
            [class.bg-team-navy]="activeFilter() === pos"
            [class.text-white]="activeFilter() === pos"
            [class.border-team-navy]="activeFilter() === pos"
            [class.bg-white]="activeFilter() !== pos"
            [class.text-slate-600]="activeFilter() !== pos"
            [class.border-slate-200]="activeFilter() !== pos"
            [class.hover:border-slate-300]="activeFilter() !== pos"
          >
            {{ pos === 'ALL' ? 'All Players' : pos }}
          </button>
        }
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        @for (player of filteredPlayers(); track player.id) {
          <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all group cursor-pointer relative block">
            
            <div class="absolute top-4 left-4 z-10 w-10 h-10 bg-team-gold text-team-navy font-display font-bold text-lg rounded-lg shadow flex items-center justify-center">
              {{player.jerseyNumber}}
            </div>

            <!-- Position Badge -->
            <div class="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
               {{player.position}}
            </div>

            <div class="aspect-square bg-slate-100 overflow-hidden relative">
               <img [src]="player.photo" alt="{{player.fullName}}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100">
               <div class="absolute inset-0 bg-gradient-to-t from-team-navy-dark/90 via-team-navy-dark/40 to-transparent"></div>
               
               <div class="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
                 <h3 class="text-xl font-display font-bold">{{player.fullName}}</h3>
               </div>
            </div>
            
            <div class="p-6 bg-white border-t border-slate-100">
               <div class="flex justify-between divide-x divide-slate-100 text-center">
                 <div class="flex-1">
                   <div class="text-2xl font-bold text-team-navy">{{player.matchesPlayed}}</div>
                   <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Apps</div>
                 </div>
                 <div class="flex-1">
                   <div class="text-2xl font-bold text-team-navy">{{player.goals}}</div>
                   <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Goals</div>
                 </div>
                 <div class="flex-1">
                   <div class="text-2xl font-bold text-team-navy">{{player.assists}}</div>
                   <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Assists</div>
                 </div>
               </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class PlayersComponent implements OnInit {
  private playersService = inject(PlayersService);

  positions = signal(['ALL', 'GK', 'DEF', 'MID', 'FWD']);
  activeFilter = signal('ALL');
  filteredPlayers = signal<Player[]>([]);

  constructor() {
    // Re-run filter automatically if the service signals updates
    effect(() => {
      this.applyFilter();
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    this.applyFilter();
  }

  filterBy(pos: string) {
    this.activeFilter.set(pos);
    this.applyFilter();
  }

  private applyFilter() {
    const current = this.activeFilter();
    const allPlayers = this.playersService.players();
    if (current === 'ALL') {
      this.filteredPlayers.set(allPlayers);
    } else {
      this.filteredPlayers.set(allPlayers.filter(p => p.position === current));
    }
  }
}
