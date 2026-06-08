import { Component, signal, ChangeDetectionStrategy, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { PlayersService } from '../../services/players.service';

interface PitchPlayer {
  id: string;
  name: string;
  number: number;
  position: string;
}

@Component({
  selector: 'app-admin-lineup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DragDropModule],
  template: `
    <div class="flex flex-col xl:flex-row gap-6">
      
      <!-- Controls & Bench -->
      <div class="xl:w-80 flex flex-col gap-6">
        <!-- Formations -->
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
          <h3 class="font-bold text-sm text-slate-700 uppercase tracking-widest mb-3">Formation</h3>
          <div class="flex gap-2">
            @for (f of formations(); track f) {
              <button 
                class="flex-1 py-1.5 text-xs rounded-lg font-medium transition-colors border"
                [class.bg-team-navy]="currentFormation() === f"
                [class.text-white]="currentFormation() === f"
                [class.border-team-navy]="currentFormation() === f"
                [class.bg-white]="currentFormation() !== f"
                [class.text-slate-600]="currentFormation() !== f"
                (click)="setFormation(f)"
              >
                {{f}}
              </button>
            }
          </div>
        </div>

        <!-- Bench List Component -->
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col min-h-[300px]">
          <h3 class="font-bold text-sm text-slate-700 uppercase tracking-widest mb-3 flex items-center justify-between">
            Substitutes
            <span class="bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded text-xs">{{bench().length}} Select</span>
          </h3>
          
          <div 
            class="flex-1 bg-slate-100/50 rounded-lg p-2 flex flex-col gap-2 overflow-y-auto"
            cdkDropList
            id="bench-list"
            [cdkDropListData]="bench()"
            [cdkDropListConnectedTo]="dropListIds()"
            (cdkDropListDropped)="drop($event)"
          >
            @for (player of bench(); track player.id) {
              <div 
                class="bg-white border border-slate-200 p-2 rounded shadow-sm flex items-center gap-3 cursor-move hover:border-team-gold transition-colors"
                cdkDrag
              >
                <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-team-navy border border-slate-200">
                  {{player.number}}
                </div>
                <div>
                  <div class="font-medium text-sm text-team-navy">{{player.name}}</div>
                  <div class="text-[10px] text-slate-400 uppercase font-bold">{{player.position}}</div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Pitch Area -->
      <div class="flex-1 bg-slate-50 p-4 lg:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center relative">
        <button (click)="onSaveLineup()" class="absolute top-4 right-4 bg-pitch-green hover:bg-pitch-green-dark text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 transition-colors">
          <span class="material-icons text-[16px]">save</span> Save
        </button>
        <!-- The Pitch -->
        <div class="w-full max-w-lg aspect-[7/10] bg-pitch-green rounded-lg border-2 border-white/80 relative overflow-hidden flex flex-col mx-auto mt-8 lg:mt-0 shadow-sm">
          
          <!-- Pitch Markings -->
          <div class="absolute inset-2 border-2 border-white/40 pointer-events-none"></div>
          <div class="absolute top-1/2 left-2 right-2 h-0 border-t-2 border-white/40 pointer-events-none"></div>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white/40 rounded-full pointer-events-none"></div>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/60 rounded-full pointer-events-none"></div>
          
          <!-- Penalty Areas -->
          <div class="absolute top-2 left-1/2 -translate-x-1/2 w-40 h-20 border-2 border-t-0 border-white/40 pointer-events-none"></div>
          <div class="absolute bottom-2 left-1/2 -translate-x-1/2 w-40 h-20 border-2 border-b-0 border-white/40 pointer-events-none"></div>
 
          <!-- Goal Areas -->
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 border-2 border-y-0 border-white pointer-events-none"></div>
          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-4 border-2 border-y-0 border-white pointer-events-none"></div>

          <!-- Formation Zones Layout -->
          <div class="relative z-10 w-full h-full flex flex-col justify-between p-4 py-6">
            <!-- Attackers -->
            <div class="flex-1 flex justify-center items-center gap-6">
              @for (pos of layout().fwd; track pos.id) {
                <ng-container *ngTemplateOutlet="positionBox; context: { pos }"></ng-container>
              }
            </div>
            
            <!-- Midfielders -->
            <div class="flex-1 flex justify-center items-center gap-8">
              @for (pos of layout().mid; track pos.id) {
                <ng-container *ngTemplateOutlet="positionBox; context: { pos }"></ng-container>
              }
            </div>

            <!-- Defenders -->
            <div class="flex-1 flex justify-center items-center gap-12">
               @for (pos of layout().def; track pos.id) {
                <ng-container *ngTemplateOutlet="positionBox; context: { pos }"></ng-container>
              }
            </div>

            <!-- Goalkeeper -->
             <div class="flex-[0.5] flex justify-center items-end">
               @if (layout().gk.length > 0) {
                 <ng-container *ngTemplateOutlet="positionBox; context: { pos: layout().gk[0] }"></ng-container>
               }
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Template for a pitch position dropzone -->
    <ng-template #positionBox let-pos="pos">
      <div 
        class="w-14 h-16 flex flex-col items-center justify-center relative"
        cdkDropList
        [id]="pos.id"
        [cdkDropListData]="pos.players"
        [cdkDropListConnectedTo]="dropListIds()"
        (cdkDropListDropped)="drop($event)"
      >
        <!-- Empty Placeholder -->
        @if (pos.players.length === 0) {
          <div class="w-10 h-10 rounded-full border-2 border-dashed border-white/50 bg-white/10 flex items-center justify-center text-white/50 text-xs font-bold">
            +
          </div>
        }

        <!-- Player Item -->
        @for (p of pos.players; track p.id) {
          <div class="relative flex flex-col items-center cursor-move" cdkDrag>
            <!-- Jersey -->
            <div class="w-10 h-10 rounded-full bg-team-gold border-2 border-team-navy text-team-navy flex items-center justify-center font-display font-bold text-sm shadow relative">
              {{p.number}}
              <div *cdkDragPreview class="w-12 h-12 rounded-full bg-team-gold border-2 border-team-navy text-team-navy flex items-center justify-center font-display font-bold text-xl shadow-2xl opacity-80">
                {{p.number}}
              </div>
            </div>
            <!-- Name Tag -->
            <div class="mt-1 bg-team-navy text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider whitespace-nowrap shadow">
              {{p.name}}
            </div>
          </div>
        }
      </div>
    </ng-template>
  `
})
export class AdminLineupComponent {
  private playersService = inject(PlayersService);

  formations = signal(['2-3-1', '3-2-1', '2-2-2', '1-3-2']);
  currentFormation = signal('2-3-1');

  allPlayers = computed(() => {
    return this.playersService.players().map(p => ({
      id: p.id,
      name: p.fullName.split(' ')[1] || p.fullName.split(' ')[0],
      number: p.jerseyNumber,
      position: p.position
    }));
  });

  bench = signal<PitchPlayer[]>([]);
  pitchPositions = signal<{id: string, group: string, players: PitchPlayer[]}[]>([]);

  layout = computed(() => {
    const list = this.pitchPositions();
    return {
      gk: list.filter(p => p.group === 'GK'),
      def: list.filter(p => p.group === 'DEF'),
      mid: list.filter(p => p.group === 'MID'),
      fwd: list.filter(p => p.group === 'FWD'),
    };
  });

  dropListIds = computed(() => {
    return ['bench-list', ...this.pitchPositions().map(p => p.id)];
  });

  constructor() {
    effect(() => {
      // Automatically refresh lineup options when squad shifts
      this.setFormation(this.currentFormation());
    }, { allowSignalWrites: true });
  }

  setFormation(f: string) {
    this.currentFormation.set(f);
    const parts = f.split('-').map(Number);
    const numDef = parts[0];
    const numMid = parts[1];
    const numFwd = parts[2];
    
    // reset to bench
    this.bench.set([...this.allPlayers()]);
    
    const newPos: {id: string, group: string, players: PitchPlayer[]}[] = [];
    newPos.push({ id: 'pos-gk-1', group: 'GK', players: [] });
    for (let i = 1; i <= numDef; i++) newPos.push({ id: `pos-def-${i}`, group: 'DEF', players: [] });
    for (let i = 1; i <= numMid; i++) newPos.push({ id: `pos-mid-${i}`, group: 'MID', players: [] });
    for (let i = 1; i <= numFwd; i++) newPos.push({ id: `pos-fwd-${i}`, group: 'FWD', players: [] });
    
    this.pitchPositions.set(newPos);
  }

  onSaveLineup() {
    // Save to localstorage so public lineup reads it
    const activeLineup = {
      formation: this.currentFormation(),
      pitchPositions: this.pitchPositions(),
      bench: this.bench()
    };
    localStorage.setItem('yp_saved_lineup', JSON.stringify(activeLineup));
    alert('Lineup saved successfully!');
  }

  drop(event: CdkDragDrop<PitchPlayer[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (event.container.id !== 'bench-list' && event.container.data.length >= 1) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          1
        );
         transferArrayItem(
          event.container.data,
          event.previousContainer.data,
          0,
          event.previousContainer.data.length
        );
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      }
    }
  }
}
