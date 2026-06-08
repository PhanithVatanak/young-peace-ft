import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-videos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="mb-10 text-center">
         <h1 class="text-4xl font-display font-bold text-team-navy tracking-tight mb-2">Video Highlights</h1>
         <p class="text-slate-500">Watch the best goals, saves, and match recaps.</p>
       </div>

       <!-- Featured Video -->
       <div class="bg-team-navy rounded-3xl overflow-hidden shadow-xl border border-slate-200 mb-12 flex flex-col md:flex-row group">
          <div class="md:w-2/3 aspect-video bg-black relative flex w-full flex-col items-center justify-center cursor-pointer overflow-hidden">
             <img src="https://images.unsplash.com/photo-1574629810360-7efbb1925813?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700">
             <div class="w-20 h-20 bg-team-gold text-team-navy rounded-full flex flex-col items-center justify-center z-10 shadow-xl group-hover:scale-110 transition-transform">
               <span class="material-icons text-4xl">play_arrow</span>
             </div>
          </div>
          <div class="p-8 md:p-10 md:w-1/3 flex flex-col justify-center text-white relative">
             <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-team-gold mb-4">
               <span class="bg-white/10 px-3 py-1 rounded-full text-white border border-white/20">Match Highlights</span>
             </div>
             <h2 class="text-3xl font-display font-bold mb-4 leading-tight">Young Peace vs City Rovers | 3-1 Win</h2>
             <p class="text-slate-400 text-sm mb-8 leading-relaxed">Watch all the goals and key moments from our stunning victory under the lights.</p>
             <button class="flex w-max items-center gap-2 text-sm font-bold bg-white text-team-navy px-5 py-2.5 rounded-lg hover:bg-team-gold transition-colors">
               Watch on YouTube <span class="material-icons text-[18px]">open_in_new</span>
             </button>
          </div>
       </div>

       <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md group cursor-pointer flex flex-col">
             <div class="aspect-[16/9] bg-slate-900 relative flex flex-col items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" class="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500">
                <div class="w-14 h-14 bg-white/20 backdrop-blur-sm text-white rounded-full flex flex-col items-center justify-center z-10 border border-white/40 group-hover:bg-team-gold group-hover:text-team-navy group-hover:border-team-gold transition-colors">
                  <span class="material-icons text-3xl">play_arrow</span>
                </div>
                <div class="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">3:42</div>
             </div>
             <div class="p-6">
               <h3 class="font-display font-bold text-team-navy mb-2 line-clamp-2 text-lg">Best Goals of 2025 Season</h3>
               <p class="text-sm font-bold text-slate-400 tracking-wider">Compilations • 10K views</p>
             </div>
          </div>
          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md group cursor-pointer flex flex-col">
             <div class="aspect-[16/9] bg-slate-900 relative flex flex-col items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1511886929837-354d827aae26?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" class="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500">
                <div class="w-14 h-14 bg-white/20 backdrop-blur-sm text-white rounded-full flex flex-col items-center justify-center z-10 border border-white/40 group-hover:bg-team-gold group-hover:text-team-navy group-hover:border-team-gold transition-colors">
                  <span class="material-icons text-3xl">play_arrow</span>
                </div>
                <div class="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">5:15</div>
             </div>
             <div class="p-6">
               <h3 class="font-display font-bold text-team-navy mb-2 line-clamp-2 text-lg">David Som - Incredible Double Save</h3>
               <p class="text-sm font-bold text-slate-400 tracking-wider">Match Highlights • 2.1K views</p>
             </div>
          </div>
          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md group cursor-pointer flex flex-col">
             <div class="aspect-[16/9] bg-slate-900 relative flex flex-col items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1600250395350-1eb2cc786e24?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" class="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500">
                <div class="w-14 h-14 bg-white/20 backdrop-blur-sm text-white rounded-full flex flex-col items-center justify-center z-10 border border-white/40 group-hover:bg-team-gold group-hover:text-team-navy group-hover:border-team-gold transition-colors">
                  <span class="material-icons text-3xl">play_arrow</span>
                </div>
                <div class="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">12:30</div>
             </div>
             <div class="p-6">
               <h3 class="font-display font-bold text-team-navy mb-2 line-clamp-2 text-lg">Inside Training: Passing Drills</h3>
               <p class="text-sm font-bold text-slate-400 tracking-wider">Behind the scenes • 1.5K views</p>
             </div>
          </div>
       </div>
    </div>
  `
})
export class VideosComponent {}
