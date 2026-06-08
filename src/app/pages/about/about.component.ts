import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div class="text-center mb-16">
        <h1 class="text-4xl lg:text-5xl font-display font-bold text-team-navy mb-4 tracking-tight">Our Story</h1>
        <p class="text-lg text-slate-500 max-w-2xl mx-auto">Founded in 2020, Young Peace Football Team is more than just a club. We are a family united by our passion for the beautiful game.</p>
      </div>

      <div class="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 class="text-3xl font-display font-bold text-team-navy mb-4">Mission & Vision</h2>
          <p class="text-slate-600 mb-4 leading-relaxed">
            Our mission is to foster a competitive yet highly respectful environment where local talents can develop their skills, build lasting friendships, and contribute positively to our community.
          </p>
          <p class="text-slate-600 leading-relaxed">
            We envision Young Peace FT becoming the standard-bearer for amateur 7-a-side football, known not just for our trophies, but for our sportsmanship, discipline, and unwavering unity on and off the pitch.
          </p>
        </div>
        <div class="bg-slate-100 rounded-2xl aspect-video overflow-hidden border border-slate-200">
           <img src="https://images.unsplash.com/photo-1518605368461-1ee02cad5159?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Team Huddle" class="w-full h-full object-cover">
        </div>
      </div>

      <div class="mb-20">
        <h2 class="text-3xl font-display font-bold text-team-navy mb-8 text-center">Core Values</h2>
        <div class="grid sm:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
            <div class="w-14 h-14 bg-team-gold/10 text-team-gold rounded-full flex items-center justify-center mb-4">
              <span class="material-icons">favorite</span>
            </div>
            <h3 class="font-bold text-team-navy text-lg mb-2">Passion</h3>
            <p class="text-slate-500 text-sm">Playing every match with heart, energy, and an unyielding love for football.</p>
          </div>
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
            <div class="w-14 h-14 bg-team-gold/10 text-team-gold rounded-full flex items-center justify-center mb-4">
              <span class="material-icons">handshake</span>
            </div>
            <h3 class="font-bold text-team-navy text-lg mb-2">Unity</h3>
            <p class="text-slate-500 text-sm">We win together and lose together. Brotherhood is our greatest strength.</p>
          </div>
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
            <div class="w-14 h-14 bg-team-gold/10 text-team-gold rounded-full flex items-center justify-center mb-4">
              <span class="material-icons">military_tech</span>
            </div>
            <h3 class="font-bold text-team-navy text-lg mb-2">Discipline</h3>
            <p class="text-slate-500 text-sm">Respect for the referee, the opponents, and our own commitment to improvement.</p>
          </div>
        </div>
      </div>
      
      <div>
         <h2 class="text-3xl font-display font-bold text-team-navy mb-8 text-center">Timeline</h2>
         <div class="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            <!-- Item 1 -->
            <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div class="flex flex-col items-center justify-center w-10 h-10 rounded-full border border-white bg-team-gold text-team-navy shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <span class="material-icons text-sm">flag</span>
              </div>
              <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div class="flex items-center justify-between mb-1">
                  <h4 class="font-bold text-team-navy">Club Founded</h4>
                  <span class="text-xs font-bold text-team-gold px-2 py-0.5 bg-team-navy rounded-full">2020</span>
                </div>
                <p class="text-sm text-slate-500">A group of friends established Young Peace FT to compete in local weekend leagues.</p>
              </div>
            </div>
            <!-- Item 2 -->
            <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div class="flex flex-col items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <span class="material-icons text-sm">emoji_events</span>
              </div>
              <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div class="flex items-center justify-between mb-1">
                  <h4 class="font-bold text-team-navy">First Trophy</h4>
                  <span class="text-xs font-bold text-slate-500 px-2 py-0.5 bg-slate-100 rounded-full">2022</span>
                </div>
                <p class="text-sm text-slate-500">Won the Community 7-a-side Summer Cup after a grueling penalty shootout.</p>
              </div>
            </div>
            <!-- Item 3 -->
            <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div class="flex flex-col items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <span class="material-icons text-sm">stadium</span>
              </div>
              <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div class="flex items-center justify-between mb-1">
                  <h4 class="font-bold text-team-navy">Undefeated Season</h4>
                  <span class="text-xs font-bold text-slate-500 px-2 py-0.5 bg-slate-100 rounded-full">2024</span>
                </div>
                <p class="text-sm text-slate-500">Achieved a perfect 15-0 run in the regional amateur league.</p>
              </div>
            </div>
         </div>
      </div>
    </div>
  `
})
export class AboutComponent {}
