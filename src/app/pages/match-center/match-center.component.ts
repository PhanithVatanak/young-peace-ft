import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-match-center',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
       <div class="mb-10 text-center">
         <h1 class="text-4xl font-display font-bold text-team-navy tracking-tight mb-2">Match Center</h1>
         <p class="text-slate-500">Upcoming fixtures and recent results.</p>
       </div>

       <div class="mb-12">
          <h2 class="text-2xl font-display font-bold text-team-navy mb-6 flex items-center gap-2">
            <span class="material-icons text-team-gold">event_available</span>
            Upcoming Fixtures
          </h2>
          <div class="space-y-4">
             @for (match of fixtures(); track match.id) {
               <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-team-navy transition-colors">
                  <div class="text-center sm:text-left">
                     <div class="bg-team-gold text-team-navy text-xs font-bold px-2 py-1 rounded inline-block uppercase tracking-wider mb-2">Next Match</div>
                     <div class="text-lg font-bold text-team-navy">{{match.date}}</div>
                     <div class="text-slate-500 text-sm flex items-center justify-center sm:justify-start gap-1 mt-1">
                       <span class="material-icons text-[16px]">location_on</span>
                       {{match.venue}}
                     </div>
                  </div>
                  
                  <div class="flex items-center gap-8 border-y sm:border-y-0 sm:border-x border-slate-100 py-4 sm:py-0 sm:px-8 my-4 sm:my-0 w-full sm:w-auto justify-center">
                     <div class="text-center">
                       <div class="w-16 h-16 bg-team-navy border-4 border-team-gold rounded-full flex items-center justify-center text-team-gold font-display font-bold text-xl mx-auto mb-2">YP</div>
                       <div class="font-bold text-sm">Young Peace</div>
                     </div>
                     <div class="text-xl font-bold text-slate-300">VS</div>
                     <div class="text-center">
                       <div class="w-16 h-16 bg-slate-100 shadow-inner rounded-full flex items-center justify-center text-slate-500 font-display font-bold mx-auto mb-2">{{match.opponent.charAt(0)}}</div>
                       <div class="font-bold text-sm">{{match.opponent}}</div>
                     </div>
                  </div>

                  <div class="w-full sm:w-auto text-center sm:text-right">
                     <button class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors w-full sm:w-auto border border-slate-200">Match Details</button>
                  </div>
               </div>
             }
          </div>
       </div>

       <div>
          <h2 class="text-2xl font-display font-bold text-team-navy mb-6 flex items-center gap-2">
            <span class="material-icons text-slate-400">history</span>
            Recent Results
          </h2>
          <div class="grid md:grid-cols-2 gap-6">
            @for (result of results(); track result.id) {
              <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <span>{{result.date}}</span>
                  <span [class.text-pitch-green]="result.outcome === 'Win'"
                        [class.text-red-500]="result.outcome === 'Loss'"
                        [class.text-amber-500]="result.outcome === 'Draw'">
                    {{result.outcome}}
                  </span>
                </div>
                <div class="p-6">
                  <div class="flex items-center justify-between mb-6">
                     <div class="text-center w-1/3">
                        <span class="font-bold text-sm">Young Peace</span>
                     </div>
                     <div class="w-1/3 text-center">
                        <div class="text-3xl font-display font-black text-team-navy tracking-widest bg-slate-100 py-1 rounded-lg">
                          {{result.ourScore}} - {{result.oppScore}}
                        </div>
                     </div>
                     <div class="text-center w-1/3">
                        <span class="font-bold text-sm">{{result.opponent}}</span>
                     </div>
                  </div>
                  <div class="bg-team-navy/5 rounded-lg p-3 flex items-center justify-between">
                     <div class="text-xs font-bold text-slate-500 uppercase">MVP</div>
                     <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-full bg-team-gold text-team-navy flex items-center justify-center font-bold text-[10px]">{{result.mvpNo}}</div>
                        <span class="text-sm font-medium text-team-navy">{{result.mvp}}</span>
                     </div>
                  </div>
                </div>
              </div>
            }
          </div>
       </div>
    </div>
  `
})
export class MatchCenterComponent {
  fixtures = signal([
    { id: 1, opponent: 'Northside FC', date: 'Upcoming Sunday, 16:00', venue: 'Central Pitch A' },
    { id: 2, opponent: 'Blue Eagles', date: 'Nov 12, 18:30', venue: 'Valley Turf' }
  ]);

  results = signal([
    { id: 1, opponent: 'City Rovers', date: 'Oct 12, 2026', ourScore: 3, oppScore: 1, outcome: 'Win', mvp: 'Tommy Kim', mvpNo: 7 },
    { id: 2, opponent: 'Metro City 7s', date: 'Oct 05, 2026', ourScore: 2, oppScore: 2, outcome: 'Draw', mvp: 'David Som', mvpNo: 1 },
    { id: 3, opponent: 'United Stars', date: 'Sep 28, 2026', ourScore: 4, oppScore: 0, outcome: 'Win', mvp: 'Alex Chan', mvpNo: 9 },
  ]);
}
