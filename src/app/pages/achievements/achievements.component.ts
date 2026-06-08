import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-achievements',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div class="mb-10 text-center">
         <h1 class="text-4xl font-display font-bold text-team-navy tracking-tight mb-2">Honors & Achievements</h1>
         <p class="text-slate-500">The hardware and milestones we've earned together.</p>
       </div>

       <!-- Main Trophies Container -->
       <div class="bg-white rounded-3xl p-8 md:p-12 shadow-md border-t-4 border-team-gold text-center relative overflow-hidden mb-12">
         <!-- BG glow -->
         <div class="absolute -top-32 -left-32 w-64 h-64 bg-team-gold/10 blur-3xl rounded-full pointer-events-none"></div>
         <div class="absolute -bottom-32 -right-32 w-64 h-64 bg-team-navy/5 blur-3xl rounded-full pointer-events-none"></div>
         
         <h2 class="text-2xl font-display font-bold text-team-navy mb-12 relative z-10 uppercase tracking-widest">Trophy Cabinet</h2>
         
         <div class="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
           @for (trophy of trophies(); track trophy.id) {
             <div class="flex flex-col items-center">
               <div class="w-24 h-24 mb-6 relative flex flex-col items-center justify-center filter drop-shadow-xl hover:-translate-y-2 transition-transform cursor-default">
                  @if (trophy.type === 'gold') {
                    <div class="absolute inset-0 bg-team-gold/20 blur-xl rounded-full"></div>
                  }
                  @if (trophy.type === 'silver') {
                    <div class="absolute inset-0 bg-slate-300/30 blur-xl rounded-full"></div>
                  }
                  <!-- Use an icon to represent a trophy -->
                  <span class="material-icons text-7xl relative z-10" [ngClass]="trophy.type === 'gold' ? 'text-team-gold' : 'text-slate-400'">emoji_events</span>
               </div>
               <h3 class="font-bold text-team-navy text-sm mb-1 leading-tight px-2">{{trophy.name}}</h3>
               <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded">{{trophy.year}}</p>
             </div>
           }
         </div>
       </div>

       <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-team-navy p-8 rounded-3xl shadow-sm text-white border border-slate-800">
            <h2 class="text-xl font-display font-bold text-team-gold mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
              <span class="material-icons bg-white/10 p-2 rounded-lg">military_tech</span>
              Key Milestones
            </h2>
            <ul class="space-y-8">
              <li class="flex gap-4">
                 <div class="w-2 h-2 bg-team-gold rounded-full mt-2 shrink-0 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></div>
                 <div>
                    <h4 class="font-bold text-lg mb-1 leading-tight">100 Goals Scored (All Comps)</h4>
                    <p class="text-sm font-medium text-white/60">Achieved on Oct 2025</p>
                 </div>
              </li>
              <li class="flex gap-4">
                 <div class="w-2 h-2 bg-team-gold rounded-full mt-2 shrink-0 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></div>
                 <div>
                    <h4 class="font-bold text-lg mb-1 leading-tight">15-Match Unbeaten Streak</h4>
                    <p class="text-sm font-medium text-white/60">Set during the 2024 Season</p>
                 </div>
              </li>
              <li class="flex gap-4">
                 <div class="w-2 h-2 bg-team-gold rounded-full mt-2 shrink-0 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></div>
                 <div>
                    <h4 class="font-bold text-lg mb-1 leading-tight">Highest Win Rate (85%)</h4>
                    <p class="text-sm font-medium text-white/60">Set during the 2025 Calendar Year</p>
                 </div>
              </li>
            </ul>
          </div>
          
          <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 class="text-xl font-display font-bold text-team-navy mb-8 flex items-center gap-3 border-b border-slate-100 pb-4">
              <span class="material-icons text-team-gold bg-slate-50 p-2 rounded-lg">star</span>
              Individual Awards
            </h2>
            <div class="space-y-4">
              <div class="flex justify-between items-center p-4 rounded-2xl border border-slate-100 hover:border-team-gold/50 hover:bg-slate-50 transition-colors">
                 <div>
                   <h4 class="font-bold text-team-navy">Golden Boot</h4>
                   <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Summer League 2025</p>
                 </div>
                 <div class="text-right flex items-center gap-3">
                   <div class="font-bold text-team-navy text-lg text-right">Alex Chan</div>
                 </div>
              </div>
              <div class="flex justify-between items-center p-4 rounded-2xl border border-slate-100 hover:border-team-gold/50 hover:bg-slate-50 transition-colors">
                 <div>
                   <h4 class="font-bold text-team-navy">Golden Glove</h4>
                   <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Community Cup 2024</p>
                 </div>
                 <div class="text-right flex items-center gap-3">
                   <div class="font-bold text-team-navy text-lg text-right">David Som</div>
                 </div>
              </div>
              <div class="flex justify-between items-center p-4 rounded-2xl border border-slate-100 hover:border-team-gold/50 hover:bg-slate-50 transition-colors">
                 <div>
                   <h4 class="font-bold text-team-navy">Player of the Season</h4>
                   <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Voted by Team (2025)</p>
                 </div>
                 <div class="text-right flex items-center gap-3">
                   <div class="font-bold text-team-navy text-lg text-right">Pheakdey P.</div>
                 </div>
              </div>
            </div>
          </div>
       </div>

    </div>
  `
})
export class AchievementsComponent {
  trophies = signal([
    { id: 1, name: 'Regional 7s Cup', year: '2025', type: 'gold' },
    { id: 2, name: 'Summer League', year: '2025', type: 'gold' },
    { id: 3, name: 'Community Cup', year: '2024', type: 'gold' },
    { id: 4, name: 'Autumn Faceoff', year: '2023', type: 'silver' },
  ]);
}
