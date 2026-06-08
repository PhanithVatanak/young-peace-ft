import { Injectable, signal, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export interface NewsPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  date: string;
  imageUrl: string;
  author: string;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private http = inject(HttpClient);
  private isBrowser: boolean;

  news = signal<NewsPost[]>([]);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.initDatabase();
  }

  private initDatabase() {
    this.loadAllNews();
  }

  loadAllNews() {
    this.http.get<NewsPost[]>('/api/news').subscribe({
      next: (newsList) => {
        this.news.set(newsList);
      },
      error: (err) => {
        console.error('Failed to load news posts from server:', err);
      }
    });
  }

  addNews(title: string, summary: string, content: string, category: string, imageUrl: string, author: string): boolean {
    this.http.post<any>('/api/news', {
      title,
      summary,
      content,
      category,
      imageUrl,
      author
    }).subscribe({
      next: () => {
        this.loadAllNews();
      },
      error: (err) => {
        console.error('Failed to publish news post on server:', err);
        alert(err.error?.message || 'Failed to create news post.');
      }
    });
    return true;
  }

  updateNews(id: string, title: string, summary: string, content: string, category: string, imageUrl: string): boolean {
    this.http.put<any>(`/api/news/${id}`, {
      title,
      summary,
      content,
      category,
      imageUrl
    }).subscribe({
      next: () => {
        this.loadAllNews();
      },
      error: (err) => {
        console.error('Failed to update news post on server:', err);
        alert(err.error?.message || 'Failed to update news post.');
      }
    });
    return true;
  }

  deleteNews(id: string): boolean {
    this.http.delete<any>(`/api/news/${id}`).subscribe({
      next: () => {
        this.loadAllNews();
      },
      error: (err) => {
        console.error('Failed to delete news post from server:', err);
        alert(err.error?.message || 'Failed to delete news post.');
      }
    });
    return true;
  }
}
