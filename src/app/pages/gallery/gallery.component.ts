import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="mb-10 text-center">
         <h1 class="text-4xl font-display font-bold text-team-navy tracking-tight mb-2">Team Gallery</h1>
         <p class="text-slate-500">Moments captured on and off the pitch.</p>
       </div>

       <div class="flex justify-center flex-wrap gap-4 mb-10">
         <button class="px-5 py-2 rounded-full bg-team-navy text-white text-sm font-bold shadow-sm transition-transform hover:-translate-y-0.5">All</button>
         <button class="px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold shadow-sm transition-transform hover:-translate-y-0.5">Matches</button>
         <button class="px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold shadow-sm transition-transform hover:-translate-y-0.5">Training</button>
       </div>

       <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          @for (img of images(); track img) {
            <div class="aspect-square bg-slate-200 rounded-xl overflow-hidden group relative cursor-pointer border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <img [src]="img.url" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
              <div class="absolute inset-0 bg-gradient-to-t from-team-navy-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                 <span class="text-white font-bold text-sm mb-1 leading-tight">{{img.title}}</span>
                 <span class="text-team-gold font-bold text-xs">{{img.date}}</span>
              </div>
            </div>
          }
       </div>
    </div>
  `
})
export class GalleryComponent {
  images = signal([
    { url: 'https://images.unsplash.com/photo-1574629810360-7efbb1925813?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Celebration vs Rovers', date: 'Oct 2026' },
    { url: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Match prep', date: 'Oct 2026' },
    { url: 'https://images.unsplash.com/photo-1552667466-07770ae110d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Team Huddle', date: 'Sep 2026' },
    { url: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Night Training', date: 'Sep 2026' },
    { url: 'https://images.unsplash.com/photo-1518605368461-1ee02cad5159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Trophy Lift', date: 'Aug 2026' },
    { url: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Friendly Match', date: 'Jul 2026' },
    { url: 'https://images.unsplash.com/photo-1600250395350-1eb2cc786e24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Training drills', date: 'Jun 2026' },
    { url: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Penalty save', date: 'May 2026' },
  ]);
}
