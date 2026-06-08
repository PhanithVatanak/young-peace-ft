import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService, NewsPost } from '../../services/news.service';

@Component({
  selector: 'app-news',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div class="mb-10 text-center">
         <h1 class="text-4xl font-display font-bold text-team-navy tracking-tight mb-2">Latest News</h1>
         <p class="text-slate-500">Stay up to date with Young Peace FT.</p>
       </div>

       @if (newsList().length > 0) {
         <!-- Featured Article (First item) -->
         @let featured = newsList()[0];
         <div 
           (click)="readArticle(featured)"
           class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-12 flex flex-col md:flex-row group hover:shadow-md transition-shadow cursor-pointer"
         >
            <div class="md:w-1/2 md:max-h-80 bg-slate-100 overflow-hidden relative">
               <img [src]="featured.imageUrl" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
            </div>
            <div class="p-8 md:w-1/2 flex flex-col justify-center">
               <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-team-gold mb-3">
                 <span class="bg-team-navy px-2 py-0.5 rounded text-white">{{ featured.category }}</span>
                 <span class="text-slate-400">{{ featured.date }}</span>
               </div>
               <h2 class="text-2xl font-display font-bold text-team-navy mb-4 leading-tight group-hover:text-team-gold transition-colors">{{ featured.title }}</h2>
               <p class="text-slate-600 mb-6 line-clamp-3">{{ featured.summary }}</p>
               <button class="flex items-center gap-1 text-sm font-bold text-team-navy transition-transform transform group-hover:translate-x-1 w-max">
                 Read full story <span class="material-icons text-[16px]">arrow_forward</span>
               </button>
            </div>
         </div>
       }

       <!-- Grid Articles (Slice from index 1) -->
       <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
         @for (item of newsList().slice(1); track item.id) {
           <div 
             (click)="readArticle(item)"
             class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col"
           >
             <div class="aspect-[16/10] bg-slate-100 overflow-hidden relative">
                <img [src]="item.imageUrl" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
             </div>
             <div class="p-6 flex flex-col flex-1">
                <div class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{{ item.category }} | {{ item.date }}</div>
                <h3 class="font-display font-bold text-team-navy text-lg mb-2 group-hover:text-team-gold transition-colors leading-tight">{{ item.title }}</h3>
                <p class="text-slate-500 text-sm line-clamp-2 mt-auto">{{ item.summary }}</p>
             </div>
           </div>
         }
       </div>

       @if (newsList().length === 0) {
         <div class="text-center py-20 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
           <span class="material-icons text-5xl text-slate-300 mb-2">newspaper</span>
           <p class="text-slate-500 font-medium">No news articles published yet. Check back soon!</p>
         </div>
       }
    </div>

    <!-- Premium Overlay Article Reader Modal -->
    @if (selectedArticle(); as article) {
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
          
          <!-- Modal Image Header -->
          <div class="relative h-64 bg-slate-100 shrink-0">
            <img [src]="article.imageUrl" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
            
            <button 
              (click)="closeArticle()"
              class="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-1.5 backdrop-blur-md transition-colors"
            >
              <span class="material-icons text-base leading-none">close</span>
            </button>

            <div class="absolute bottom-4 left-6 right-6 text-white">
              <span class="bg-team-gold text-team-navy text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">{{ article.category }}</span>
              <h3 class="text-xl font-display font-bold mt-2.5 leading-snug">{{ article.title }}</h3>
            </div>
          </div>

          <!-- Modal Body Content -->
          <div class="flex-1 overflow-y-auto p-6 md:p-8 space-y-4">
            <div class="flex items-center justify-between text-xs text-slate-400 font-bold border-b border-slate-100 pb-3">
              <span>Published: {{ article.date }}</span>
              <span>By: {{ article.author }}</span>
            </div>
            
            <p class="text-slate-700 leading-relaxed whitespace-pre-line text-sm md:text-base">
              {{ article.content }}
            </p>
          </div>

          <!-- Modal Footer -->
          <div class="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
            <button 
              (click)="closeArticle()"
              class="px-5 py-2 bg-team-navy hover:bg-team-navy-dark text-white font-bold rounded-lg text-sm transition-colors"
            >
              Close Reader
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class NewsComponent {
  private newsService = inject(NewsService);

  newsList = this.newsService.news;
  selectedArticle = signal<NewsPost | null>(null);

  readArticle(article: NewsPost) {
    this.selectedArticle.set(article);
  }

  closeArticle() {
    this.selectedArticle.set(null);
  }
}
