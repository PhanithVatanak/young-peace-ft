import { Injectable, signal, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export interface Player {
  id: string;
  fullName: string;
  jerseyNumber: number;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  photo: string;
  goals: number;
  assists: number;
  matchesPlayed: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  private http = inject(HttpClient);
  private isBrowser: boolean;

  players = signal<Player[]>([]);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.initDatabase();
  }

  private initDatabase() {
    this.loadAllPlayers();
  }

  loadAllPlayers() {
    this.http.get<Player[]>('/api/players').subscribe({
      next: (playerList) => {
        this.players.set(playerList);
      },
      error: (err) => {
        console.error('Failed to fetch players roster from server:', err);
      }
    });
  }

  addPlayer(
    fullName: string, 
    jerseyNumber: number, 
    position: 'GK' | 'DEF' | 'MID' | 'FWD', 
    photo: string, 
    goals: number, 
    assists: number, 
    matchesPlayed: number
  ): boolean {
    this.http.post<any>('/api/players', {
      fullName,
      jerseyNumber,
      position,
      photo,
      goals,
      assists,
      matchesPlayed
    }).subscribe({
      next: () => {
        this.loadAllPlayers();
      },
      error: (err) => {
        console.error('Failed to create new player on server:', err);
        alert(err.error?.message || 'Failed to create new player.');
      }
    });
    return true;
  }

  deletePlayer(id: string): boolean {
    this.http.delete<any>(`/api/players/${id}`).subscribe({
      next: () => {
        this.loadAllPlayers();
      },
      error: (err) => {
        console.error('Failed to delete player from server:', err);
        alert(err.error?.message || 'Failed to remove player.');
      }
    });
    return true;
  }
}
