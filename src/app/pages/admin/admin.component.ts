import { Component, ChangeDetectionStrategy, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLineupComponent } from './admin-lineup.component';
import { AuthService, AppUser, UserRole } from '../../services/auth.service';
import { PlayersService, Player } from '../../services/players.service';
import { NewsService, NewsPost } from '../../services/news.service';

@Component({
  selector: 'app-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, AdminLineupComponent],
  template: `
    <div class="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
       <!-- Admin Sidebar -->
       <div class="w-full md:w-64 flex flex-col gap-2">
         <div class="bg-team-navy text-white p-6 rounded-2xl shadow-sm mb-4">
             <h2 class="font-display font-bold text-xl mb-1">Admin Panel</h2>
             <p class="text-xs text-white/70">Young Peace FT</p>
             <!-- Active User indicator -->
             <div class="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
               <div class="w-8 h-8 rounded-full bg-team-gold text-team-navy flex items-center justify-center font-bold text-sm">
                 {{ currentUser()?.name?.charAt(0) }}
               </div>
               <div class="flex flex-col">
                 <span class="text-xs font-bold leading-tight">{{ currentUser()?.name }}</span>
                 <span class="text-[10px] text-team-gold font-bold uppercase tracking-wider leading-none">{{ currentUser()?.role }}</span>
               </div>
             </div>
         </div>
         
         <nav class="flex flex-col gap-1">
            <button 
              (click)="activeTab.set('lineup')"
              class="text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3"
              [ngClass]="activeTab() === 'lineup' ? 'bg-white border border-slate-200 text-team-navy shadow-sm' : 'bg-transparent border border-transparent text-slate-600 hover:bg-slate-100'"
            >
              <span class="material-icons" [class.text-team-gold]="activeTab() === 'lineup'" [class.text-slate-400]="activeTab() !== 'lineup'">sports_soccer</span>
              Lineup Builder
            </button>

            <button 
              (click)="activeTab.set('players')"
              class="text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3"
              [ngClass]="activeTab() === 'players' ? 'bg-white border border-slate-200 text-team-navy shadow-sm' : 'bg-transparent border border-transparent text-slate-600 hover:bg-slate-100'"
            >
              <span class="material-icons" [class.text-team-gold]="activeTab() === 'players'" [class.text-slate-400]="activeTab() !== 'players'">people</span>
              Players & Squad
            </button>

            <button 
              (click)="activeTab.set('news')"
              class="text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3"
              [ngClass]="activeTab() === 'news' ? 'bg-white border border-slate-200 text-team-navy shadow-sm' : 'bg-transparent border border-transparent text-slate-600 hover:bg-slate-100'"
            >
              <span class="material-icons" [class.text-team-gold]="activeTab() === 'news'" [class.text-slate-400]="activeTab() !== 'news'">article</span>
              Manage News
            </button>

            <!-- Users & Roles tab: Super admin only -->
            @if (currentUser()?.role === 'Administrator') {
              <button 
                (click)="activeTab.set('users')"
                class="text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3"
                [ngClass]="activeTab() === 'users' ? 'bg-white border border-slate-200 text-team-navy shadow-sm' : 'bg-transparent border border-transparent text-slate-600 hover:bg-slate-100'"
              >
                <span class="material-icons" [class.text-team-gold]="activeTab() === 'users'" [class.text-slate-400]="activeTab() !== 'users'">admin_panel_settings</span>
                Users & Roles
              </button>
            }
         </nav>
       </div>

       <!-- Main Content Area -->
       <div class="flex-1">
         
         <!-- Tab: Players -->
         @if (activeTab() === 'players') {
           <div class="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
              
              <!-- Form to Add Player -->
              @if (showAddPlayerForm()) {
                <div class="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200 relative">
                  <h4 class="font-display font-bold text-lg text-team-navy mb-4">Add Squad Player</h4>
                  <form (ngSubmit)="onAddPlayer()" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="md:col-span-2">
                      <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                      <input type="text" [(ngModel)]="newPlayer.fullName" name="fullName" required class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-team-gold">
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Jersey Number</label>
                      <input type="number" [(ngModel)]="newPlayer.jerseyNumber" name="jerseyNumber" required class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-team-gold">
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Position</label>
                      <select [(ngModel)]="newPlayer.position" name="position" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-team-gold bg-white">
                        <option value="GK">GK</option>
                        <option value="DEF">DEF</option>
                        <option value="MID">MID</option>
                        <option value="FWD">FWD</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Matches Played</label>
                      <input type="number" [(ngModel)]="newPlayer.matchesPlayed" name="matchesPlayed" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-team-gold">
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Goals</label>
                      <input type="number" [(ngModel)]="newPlayer.goals" name="goals" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-team-gold">
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Assists</label>
                      <input type="number" [(ngModel)]="newPlayer.assists" name="assists" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-team-gold">
                    </div>
                    <div class="md:col-span-2">
                      <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Photo URL</label>
                      <input type="text" [(ngModel)]="newPlayer.photo" name="photo" placeholder="Leave empty for default" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-team-gold">
                    </div>
                    <div class="md:col-span-3 flex justify-end gap-2 mt-2">
                      <button type="button" (click)="showAddPlayerForm.set(false)" class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors">Cancel</button>
                      <button type="submit" class="px-4 py-2 bg-team-gold hover:bg-team-gold-light text-team-navy font-bold rounded-lg text-sm transition-colors">Save Player</button>
                    </div>
                  </form>
                </div>
              }

              <div class="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                 <h3 class="text-2xl font-display font-bold text-team-navy">Manage Squad</h3>
                 @if (!showAddPlayerForm()) {
                   <button (click)="showAddPlayerForm.set(true)" class="bg-team-navy hover:bg-team-navy-dark text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
                     <span class="material-icons text-sm">add</span> Add Player
                   </button>
                 }
              </div>

              <!-- Table -->
              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                  <thead>
                    <tr class="border-b border-slate-200 text-slate-500 uppercase tracking-widest text-[10px] font-bold">
                      <th class="pb-3 px-4">Player</th>
                      <th class="pb-3 px-4">No.</th>
                      <th class="pb-3 px-4">Pos</th>
                      <th class="pb-3 px-4 text-center">Matches</th>
                      <th class="pb-3 px-4 text-center">GLS</th>
                      <th class="pb-3 px-4 text-center">AST</th>
                      <th class="pb-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    @for (player of players(); track player.id) {
                      <tr class="hover:bg-slate-50 transition-colors">
                        <td class="py-3 px-4">
                          <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                              <img [src]="player.photo" class="w-full h-full object-cover">
                            </div>
                            <span class="font-medium text-slate-900">{{player.fullName}}</span>
                          </div>
                        </td>
                        <td class="py-3 px-4 font-mono text-slate-600">{{player.jerseyNumber}}</td>
                        <td class="py-3 px-4">
                          <span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold">{{player.position}}</span>
                        </td>
                        <td class="py-3 px-4 text-center">{{player.matchesPlayed}}</td>
                        <td class="py-3 px-4 text-center font-medium">{{player.goals}}</td>
                        <td class="py-3 px-4 text-center">{{player.assists}}</td>
                        <td class="py-3 px-4 text-right">
                          <button (click)="onDeletePlayer(player.id)" class="text-red-400 hover:text-red-600 p-1" title="Delete Player">
                            <span class="material-icons text-[18px]">delete</span>
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
           </div>
         }

         <!-- Tab: Lineup -->
         @if (activeTab() === 'lineup') {
           <div class="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
              <div class="mb-6 border-b border-slate-100 pb-4">
                <h3 class="text-2xl font-display font-bold text-team-navy">Lineup Editor</h3>
                <p class="text-sm text-slate-500">Drag and drop players to set the match lineup.</p>
              </div>
              <app-admin-lineup></app-admin-lineup>
           </div>
         }

         <!-- Tab: News -->
         @if (activeTab() === 'news') {
           <div class="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
              
              <!-- Form to Add/Edit News -->
              @if (showNewsForm()) {
                <div class="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h4 class="font-display font-bold text-lg text-team-navy mb-4">
                    {{ editingNewsId() ? 'Edit News Article' : 'Create News Article' }}
                  </h4>
                  <form (ngSubmit)="onSaveNews()" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div class="md:col-span-2">
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Title</label>
                        <input type="text" [(ngModel)]="newNews.title" name="title" required class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-team-gold">
                      </div>
                      <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
                        <select [(ngModel)]="newNews.category" name="category" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-team-gold bg-white">
                          <option value="Announcement">Announcement</option>
                          <option value="Match Report">Match Report</option>
                          <option value="Player Spotlight">Player Spotlight</option>
                          <option value="Community">Community</option>
                          <option value="General">General</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Summary (Short description)</label>
                      <input type="text" [(ngModel)]="newNews.summary" name="summary" required class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-team-gold" placeholder="Choked opposition passing lanes...">
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Article Content</label>
                      <textarea [(ngModel)]="newNews.content" name="content" rows="5" required class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-team-gold" placeholder="Write full details here..."></textarea>
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Image URL</label>
                      <input type="text" [(ngModel)]="newNews.imageUrl" name="imageUrl" placeholder="Leave blank for default placeholder image" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-team-gold">
                    </div>
                    <div class="flex justify-end gap-2 pt-2">
                      <button type="button" (click)="cancelNewsForm()" class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors">Cancel</button>
                      <button type="submit" class="px-4 py-2 bg-team-gold hover:bg-team-gold-light text-team-navy font-bold rounded-lg text-sm transition-colors">Publish Article</button>
                    </div>
                  </form>
                </div>
              }

              <div class="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                 <h3 class="text-2xl font-display font-bold text-team-navy">Manage News & Posts</h3>
                 @if (!showNewsForm()) {
                   <button (click)="openAddNewsForm()" class="bg-team-navy hover:bg-team-navy-dark text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
                     <span class="material-icons text-sm">add_circle_outline</span> Create Post
                   </button>
                 }
              </div>

              <!-- List of news -->
              <div class="space-y-4">
                @for (item of newsList(); track item.id) {
                  <div class="flex gap-4 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                    <div class="w-20 h-20 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      <img [src]="item.imageUrl" class="w-full h-full object-cover">
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="bg-team-navy text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">{{ item.category }}</span>
                        <span class="text-slate-400 text-xs font-semibold">{{ item.date }}</span>
                        <span class="text-slate-400 text-xs font-semibold">| By {{ item.author }}</span>
                      </div>
                      <h4 class="font-display font-bold text-slate-900 text-base truncate">{{ item.title }}</h4>
                      <p class="text-slate-500 text-xs line-clamp-2 mt-1">{{ item.summary }}</p>
                    </div>
                    <div class="flex flex-col justify-center gap-1 shrink-0">
                      <button (click)="openEditNewsForm(item)" class="text-slate-500 hover:text-team-navy p-1" title="Edit Article">
                        <span class="material-icons text-[18px]">edit</span>
                      </button>
                      <button (click)="onDeleteNews(item.id)" class="text-red-400 hover:text-red-600 p-1" title="Delete Article">
                        <span class="material-icons text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                }
                @if (newsList().length === 0) {
                  <div class="text-center py-12 text-slate-400 font-medium italic">No news articles found. Create one!</div>
                }
              </div>

           </div>
         }

         <!-- Tab: Users & Roles (Super Admin Only) -->
         @if (activeTab() === 'users' && currentUser()?.role === 'Administrator') {
           <div class="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
              
              <!-- Form to Create User -->
              @if (showAddUserForm()) {
                <div class="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h4 class="font-display font-bold text-lg text-team-navy mb-4">Create User Account</h4>
                  <form (ngSubmit)="onAddUser()" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">User Name</label>
                      <input type="text" [(ngModel)]="newUser.name" name="name" required class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-team-gold">
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                      <input type="email" [(ngModel)]="newUser.email" name="email" required class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-team-gold">
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Initial Role</label>
                      <select [(ngModel)]="newUser.role" name="role" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-team-gold bg-white">
                        <option value="Admin">Admin (Can Manage Everything)</option>
                        <option value="User">User (Regular Access)</option>
                      </select>
                    </div>
                    <div class="md:col-span-3 flex justify-between items-center border-t border-slate-200 pt-4 mt-2">
                      <span class="text-xs text-slate-400">Default password is set to: <strong>password123</strong></span>
                      <div class="flex gap-2">
                        <button type="button" (click)="showAddUserForm.set(false)" class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-team-gold hover:bg-team-gold-light text-team-navy font-bold rounded-lg text-sm transition-colors">Create User</button>
                      </div>
                    </div>
                  </form>
                </div>
              }

              <div class="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                 <h3 class="text-2xl font-display font-bold text-team-navy">User Management & Permissions</h3>
                 @if (!showAddUserForm()) {
                   <button (click)="showAddUserForm.set(true)" class="bg-team-navy hover:bg-team-navy-dark text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
                     <span class="material-icons text-sm">person_add</span> Add User
                   </button>
                 }
              </div>

              <!-- Users list -->
              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                  <thead>
                    <tr class="border-b border-slate-200 text-slate-500 uppercase tracking-widest text-[10px] font-bold">
                      <th class="pb-3 px-4">User</th>
                      <th class="pb-3 px-4">Email</th>
                      <th class="pb-3 px-4">Role</th>
                      <th class="pb-3 px-4 text-center">Status</th>
                      <th class="pb-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    @for (user of usersList(); track user.id) {
                      <tr class="hover:bg-slate-50 transition-colors">
                        <td class="py-4 px-4 font-medium text-slate-900">{{ user.name }}</td>
                        <td class="py-4 px-4 text-slate-600">{{ user.email }}</td>
                        <td class="py-4 px-4">
                          <span 
                            class="px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase"
                            [ngClass]="{
                              'bg-purple-100 text-purple-700': user.role === 'Administrator',
                              'bg-blue-100 text-blue-700': user.role === 'Admin',
                              'bg-slate-100 text-slate-600': user.role === 'User'
                            }"
                          >
                            {{ user.role }}
                          </span>
                        </td>
                        <td class="py-4 px-4 text-center">
                          <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700">
                            <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                          </span>
                        </td>
                        <td class="py-4 px-4 text-right">
                          <div class="flex items-center justify-end gap-2">
                            @if (user.role !== 'Administrator') {
                              <!-- Toggle Admin role button -->
                              <button 
                                (click)="toggleUserAdminRole(user)" 
                                class="border px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                                [ngClass]="user.role === 'Admin' ? 'border-amber-300 text-amber-700 hover:bg-amber-50' : 'border-blue-300 text-blue-700 hover:bg-blue-50'"
                              >
                                <span class="material-icons text-xs">vpn_key</span>
                                {{ user.role === 'Admin' ? 'Revoke Admin' : 'Assign Admin' }}
                              </button>

                              <!-- Delete User -->
                              <button 
                                (click)="onDeleteUser(user.id)" 
                                class="text-red-400 hover:text-red-600 p-1"
                                title="Delete User"
                              >
                                <span class="material-icons text-[18px]">delete</span>
                              </button>
                            } @else {
                              <span class="text-xs text-slate-400 italic pr-2">Super Admin (Locked)</span>
                            }
                          </div>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
           </div>
         }

       </div>
    </div>
  `
})
export class AdminComponent {
  private authService = inject(AuthService);
  private playersService = inject(PlayersService);
  private newsService = inject(NewsService);

  activeTab = signal('lineup');

  // Signals connected directly to services
  currentUser = this.authService.currentUser;
  usersList = this.authService.users;
  players = this.playersService.players;
  newsList = this.newsService.news;

  // Players Form signals
  showAddPlayerForm = signal(false);
  newPlayer = {
    fullName: '',
    jerseyNumber: 1,
    position: 'GK' as 'GK' | 'DEF' | 'MID' | 'FWD',
    photo: '',
    goals: 0,
    assists: 0,
    matchesPlayed: 0
  };

  // News Form signals
  showNewsForm = signal(false);
  editingNewsId = signal<string | null>(null);
  newNews = {
    title: '',
    category: 'Announcement',
    summary: '',
    content: '',
    imageUrl: ''
  };

  // Users Form signals
  showAddUserForm = signal(false);
  newUser = {
    name: '',
    email: '',
    role: 'User' as UserRole
  };

  onAddPlayer() {
    if (!this.newPlayer.fullName || !this.newPlayer.jerseyNumber) return;

    this.playersService.addPlayer(
      this.newPlayer.fullName,
      this.newPlayer.jerseyNumber,
      this.newPlayer.position,
      this.newPlayer.photo,
      this.newPlayer.goals,
      this.newPlayer.assists,
      this.newPlayer.matchesPlayed
    );

    // Reset
    this.newPlayer = {
      fullName: '',
      jerseyNumber: this.players().length + 2,
      position: 'GK',
      photo: '',
      goals: 0,
      assists: 0,
      matchesPlayed: 0
    };
    this.showAddPlayerForm.set(false);
  }

  onDeletePlayer(id: string) {
    if (confirm('Are you sure you want to remove this player from the squad?')) {
      this.playersService.deletePlayer(id);
    }
  }

  // News administration
  openAddNewsForm() {
    this.editingNewsId.set(null);
    this.newNews = {
      title: '',
      category: 'Announcement',
      summary: '',
      content: '',
      imageUrl: ''
    };
    this.showNewsForm.set(true);
  }

  openEditNewsForm(item: NewsPost) {
    this.editingNewsId.set(item.id);
    this.newNews = {
      title: item.title,
      category: item.category,
      summary: item.summary,
      content: item.content,
      imageUrl: item.imageUrl
    };
    this.showNewsForm.set(true);
  }

  cancelNewsForm() {
    this.showNewsForm.set(false);
    this.editingNewsId.set(null);
  }

  onSaveNews() {
    if (!this.newNews.title || !this.newNews.summary || !this.newNews.content) return;

    if (this.editingNewsId()) {
      this.newsService.updateNews(
        this.editingNewsId()!,
        this.newNews.title,
        this.newNews.summary,
        this.newNews.content,
        this.newNews.category,
        this.newNews.imageUrl
      );
    } else {
      const author = this.currentUser()?.name || 'Anonymous';
      this.newsService.addNews(
        this.newNews.title,
        this.newNews.summary,
        this.newNews.content,
        this.newNews.category,
        this.newNews.imageUrl,
        author
      );
    }

    this.cancelNewsForm();
  }

  onDeleteNews(id: string) {
    if (confirm('Are you sure you want to delete this news article permanently?')) {
      this.newsService.deleteNews(id);
    }
  }

  // Users administration
  onAddUser() {
    if (!this.newUser.name || !this.newUser.email) return;

    this.authService.createUser(
      this.newUser.name,
      this.newUser.email,
      this.newUser.role
    ).subscribe({
      next: () => {
        this.newUser = {
          name: '',
          email: '',
          role: 'User'
        };
        this.showAddUserForm.set(false);
      },
      error: (err) => {
        alert(err.error?.message || 'Email address already exists or creation failed.');
      }
    });
  }

  toggleUserAdminRole(user: AppUser) {
    const targetRole: UserRole = user.role === 'Admin' ? 'User' : 'Admin';
    const msg = user.role === 'Admin' 
      ? `Are you sure you want to revoke Admin privileges from ${user.name}? They will no longer be able to log in to manage the application.` 
      : `Are you sure you want to assign Admin privileges to ${user.name}? This allows them to manage everything including players, lineups, and news posts.`;
    
    if (confirm(msg)) {
      this.authService.updateUserRole(user.id, targetRole).subscribe({
        error: (err) => {
          alert(err.error?.message || 'Failed to update user role.');
        }
      });
    }
  }

  onDeleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user account permanently?')) {
      this.authService.deleteUser(id).subscribe({
        error: (err) => {
          alert(err.error?.message || 'Failed to delete user.');
        }
      });
    }
  }
}
