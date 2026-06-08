import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div class="mb-10">
        <h1 class="text-4xl font-display font-bold text-team-navy tracking-tight mb-2">Team Statistics</h1>
        <p class="text-slate-500">All-time records and performance data.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div class="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
           <h2 class="text-xl font-display font-bold text-team-navy mb-6 flex items-center gap-2">
             <span class="material-icons text-team-gold">timeline</span>
             Overall Performance
           </h2>
           <div class="space-y-4">
              <div class="flex justify-between items-center pb-4 border-b border-slate-100">
                <span class="text-slate-600 font-medium">Matches Played</span>
                <span class="text-xl font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-lg">45</span>
              </div>
              <div class="flex justify-between items-center pb-4 border-b border-slate-100">
                <span class="text-slate-600 font-medium">Wins</span>
                <span class="text-xl font-bold bg-pitch-green-light/20 text-pitch-green-dark px-3 py-1 rounded-lg">38</span>
              </div>
              <div class="flex justify-between items-center pb-4 border-b border-slate-100">
                <span class="text-slate-600 font-medium">Draws</span>
                <span class="text-xl font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-lg">4</span>
              </div>
              <div class="flex justify-between items-center pb-4 border-b border-slate-100">
                <span class="text-slate-600 font-medium">Losses</span>
                <span class="text-xl font-bold bg-red-100 text-red-700 px-3 py-1 rounded-lg">3</span>
              </div>
              <div class="flex justify-between items-center pt-2">
                <span class="text-slate-900 font-bold">Goals Scored (All-time)</span>
                <span class="text-2xl font-bold text-team-navy">124</span>
              </div>
           </div>
         </div>

         <div class="space-y-8">
            <div class="bg-team-navy rounded-2xl p-8 shadow-sm text-white relative overflow-hidden">
               <div class="absolute -right-10 -top-10 text-white/5 font-display font-black text-9xl pointer-events-none">STREAK</div>
               <h2 class="text-xl font-display font-bold text-team-gold mb-2 flex items-center gap-2">
                 <span class="material-icons">local_fire_department</span>
                 Current Streak
               </h2>
               <div class="text-6xl font-bold font-display tracking-tighter mb-1">5 Wins</div>
               <p class="text-slate-400 text-sm">Undefeated in the last 2 months.</p>
            </div>

            <div class="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
               <h2 class="text-xl font-display font-bold text-team-navy mb-6 flex items-center gap-2">
                 <span class="material-icons text-team-gold">star</span>
                 Club Records
               </h2>
               <div class="space-y-4">
                  <div>
                    <div class="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Biggest Win</div>
                    <div class="text-lg font-bold text-slate-800">8 - 0 vs Local Legends (2024)</div>
                  </div>
                  <div>
                    <div class="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Top Scorer (Season)</div>
                    <div class="text-lg font-bold text-slate-800">Alex Chan (22 Goals)</div>
                  </div>
                  <div>
                    <div class="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Most Apps</div>
                    <div class="text-lg font-bold text-slate-800">David Som (45 Apps)</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  `
})
export class StatsComponent {}
