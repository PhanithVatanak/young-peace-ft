import { Component, signal, ChangeDetectionStrategy, computed, inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface PitchPlayer {
  id: string;
  name: string;
  number: number;
  position: string;
}

@Component({
  selector: 'app-lineup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      
      <!-- Match Info & Secondary Line (Bench) -->
      <div class="lg:w-80 flex flex-col gap-6">
        <div>
          <h1 class="text-3xl font-display font-bold text-team-navy">Match Lineup</h1>
          <p class="text-slate-500 text-sm mt-1">Next Match: vs Northside FC ({{ formation() }})</p>
        </div>

        <!-- Substitutes Component -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col">
          <h3 class="font-bold text-sm text-slate-700 uppercase tracking-widest mb-3 flex items-center justify-between">
            Secondary (Substitutes)
            <span class="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs">{{bench().length}} Avail</span>
          </h3>
          
          <div class="flex-1 overflow-y-auto pr-2 flex flex-col gap-2">
            @for (player of bench(); track player.id) {
              <div class="bg-white border border-slate-200 p-2 rounded shadow-sm flex items-center gap-3 transition-colors">
                <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-team-navy border border-slate-200">
                  {{player.number}}
                </div>
                <div>
                  <div class="font-medium text-sm text-team-navy">{{player.name}}</div>
                  <div class="text-[10px] text-slate-400 uppercase font-bold">{{player.position}}</div>
                </div>
              </div>
            }
            @if (bench().length === 0) {
              <div class="text-center text-slate-400 mt-8 text-sm italic">No substitutes available</div>
            }
          </div>
        </div>
      </div>

      <!-- Primary Line (Pitch Area) -->
      <div class="flex-1 bg-white p-4 lg:p-8 rounded-3xl border border-slate-200 shadow-xl flex items-center justify-center flex-col relative">
        <h2 class="text-lg font-bold text-center w-full absolute top-6 mt-2 lg:mt-0 lg:static mb-4 uppercase tracking-widest text-slate-700">Primary Starting Lineup</h2>
        <!-- The Pitch -->
        <div class="w-full max-w-xl aspect-[7/10] bg-pitch-green rounded-lg border-4 border-white relative overflow-hidden shadow-inner flex flex-col mt-10 lg:mt-0">
          
          <!-- Pitch Markings -->
          <div class="absolute inset-2 border-2 border-white/40 pointer-events-none"></div>
          <div class="absolute top-1/2 left-2 right-2 h-0 border-t-2 border-white/40 pointer-events-none"></div>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/40 rounded-full pointer-events-none"></div>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/60 rounded-full pointer-events-none"></div>
          
          <!-- Penalty Areas -->
          <div class="absolute top-2 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-t-0 border-white/40 pointer-events-none"></div>
          <div class="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-b-0 border-white/40 pointer-events-none"></div>

          <!-- Goal Areas -->
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 border-2 border-y-0 border-white pointer-events-none"></div>
          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-6 border-2 border-y-0 border-white pointer-events-none"></div>

          <!-- Formation Zones Layout -->
          <div class="relative z-10 w-full h-full flex flex-col justify-between p-4 py-8">
            <!-- Attackers -->
            <div class="flex-1 flex justify-center items-center gap-8">
              @for (pos of layout().fwd; track $index) {
                <ng-container *ngTemplateOutlet="positionBox; context: { pos }"></ng-container>
              }
            </div>
            
            <!-- Midfielders -->
            <div class="flex-1 flex justify-center items-center gap-12">
              @for (pos of layout().mid; track $index) {
                <ng-container *ngTemplateOutlet="positionBox; context: { pos }"></ng-container>
              }
            </div>

            <!-- Defenders -->
            <div class="flex-1 flex justify-center items-center gap-16">
               @for (pos of layout().def; track $index) {
                <ng-container *ngTemplateOutlet="positionBox; context: { pos }"></ng-container>
              }
            </div>

            <!-- Goalkeeper -->
             <div class="flex-[0.5] flex justify-center items-end pb-2">
               @if (layout().gk.length > 0) {
                  <ng-container *ngTemplateOutlet="positionBox; context: { pos: layout().gk[0] }"></ng-container>
               }
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Template for a pitch position -->
    <ng-template #positionBox let-pos="pos">
      <div class="w-16 h-20 flex flex-col items-center justify-center relative">
        <!-- Player Item -->
        @for (p of pos.players; track p.id) {
          <div class="relative flex flex-col items-center">
            <!-- Jersey -->
            <div class="w-12 h-12 rounded-full bg-team-gold border-2 border-team-navy text-team-navy flex items-center justify-center font-display font-bold text-xl shadow-lg relative">
              {{p.number}}
            </div>
            <!-- Name Tag -->
            <div class="mt-1 bg-team-navy text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider whitespace-nowrap shadow">
              {{p.name}}
            </div>
          </div>
        }
      </div>
    </ng-template>
  `
})
export class LineupComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);

  formation = signal('2-3-1');

  // Pre-configured Primary Lineup (Starting 7)
  pitchPositions = signal<{group: string, players: PitchPlayer[]}[]>([
    { group: 'GK', players: [{ id: '1', name: 'Som', number: 1, position: 'GK' }] },
    { group: 'DEF', players: [{ id: '2', name: 'Ren', number: 4, position: 'DEF' }] },
    { group: 'DEF', players: [{ id: '3', name: 'Sokha', number: 5, position: 'DEF' }] },
    { group: 'MID', players: [{ id: '4', name: 'Lim', number: 8, position: 'MID' }] },
    { group: 'MID', players: [{ id: '5', name: 'Pheakdey', number: 10, position: 'MID' }] },
    { group: 'MID', players: [{ id: '9', name: 'Heng', number: 3, position: 'MID' }] },
    { group: 'FWD', players: [{ id: '7', name: 'Chan', number: 9, position: 'FWD' }] },
  ]);

  // Pre-configured Secondary Lineup (Bench)
  bench = signal<PitchPlayer[]>([
    { id: '6', name: 'Kim', number: 7, position: 'FWD' },
    { id: '8', name: 'Sam', number: 11, position: 'FWD' },
    { id: '10', name: 'Dara', number: 12, position: 'DEF' },
    { id: '11', name: 'Roth', number: 14, position: 'MID' },
  ]);

  // Computed layout organizing the positions by rows
  layout = computed(() => {
    const list = this.pitchPositions();
    return {
      gk: list.filter(p => p.group === 'GK'),
      def: list.filter(p => p.group === 'DEF'),
      mid: list.filter(p => p.group === 'MID'),
      fwd: list.filter(p => p.group === 'FWD'),
    };
  });

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('yp_saved_lineup');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.formation.set(parsed.formation);
        this.pitchPositions.set(parsed.pitchPositions);
        this.bench.set(parsed.bench);
      }
    }
  }
}

