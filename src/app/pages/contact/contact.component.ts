import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div class="mb-10 text-center">
         <h1 class="text-4xl font-display font-bold text-team-navy tracking-tight mb-2">Contact Us</h1>
         <p class="text-slate-500">Want to arrange a friendly? Interested in joining? Reach out.</p>
       </div>

       <div class="grid lg:grid-cols-2 gap-0 bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200">
         <div class="p-8 md:p-12 bg-team-navy text-white relative">
           <div class="absolute -top-40 -left-40 w-80 h-80 bg-team-gold/20 blur-3xl rounded-full pointer-events-none"></div>
           
           <h2 class="text-3xl font-display font-bold text-team-gold mb-6 relative z-10">Get in Touch</h2>
           <p class="text-slate-300 mb-10 leading-relaxed font-medium relative z-10">Whether you're looking for a friendly match, sponsorship opportunities, or simply want to learn more about the team, our management is ready to chat.</p>
           
           <div class="space-y-8 relative z-10">
             <div class="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div class="w-12 h-12 bg-team-gold/20 text-team-gold rounded-full flex flex-col items-center justify-center shrink-0">
                  <span class="material-icons text-[24px]">email</span>
                </div>
                <div>
                   <h3 class="font-bold text-xs text-slate-400 tracking-widest uppercase mb-1">Email</h3>
                   <p class="font-medium text-lg text-white">management&#64;youngpeaceft.com</p>
                </div>
             </div>
             <div class="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div class="w-12 h-12 bg-team-gold/20 text-team-gold rounded-full flex flex-col items-center justify-center shrink-0">
                  <span class="material-icons text-[24px]">location_on</span>
                </div>
                <div>
                   <h3 class="font-bold text-xs text-slate-400 tracking-widest uppercase mb-1">Home Pitch</h3>
                   <p class="font-medium text-white mb-1">Central pitches, District 4</p>
                   <p class="text-sm text-slate-400">Available weekends 16:00 - 19:00</p>
                </div>
             </div>
           </div>
         </div>
         
         <div class="p-8 md:p-12">
            <form class="flex flex-col gap-6">
              <div class="flex flex-col sm:flex-row gap-6">
                <div class="flex-1">
                  <label class="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                  <input type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-team-gold focus:border-red-500 transition-shadow">
                </div>
                <div class="flex-1">
                  <label class="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                  <input type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-team-gold focus:border-transparent transition-shadow">
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Email address</label>
                <input type="email" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-team-gold focus:border-transparent transition-shadow">
              </div>

              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                <select class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-team-gold focus:border-transparent transition-shadow font-medium text-slate-700">
                  <option>Friendly Match Request</option>
                  <option>Join the Team</option>
                  <option>Sponsorship</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Message</label>
                <textarea rows="4" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-team-gold focus:border-transparent transition-shadow resize-none"></textarea>
              </div>

              <button type="button" class="bg-team-gold hover:bg-yellow-400 text-team-navy font-bold text-lg px-6 py-4 rounded-xl transition-transform hover:-translate-y-0.5 mt-2 shadow-sm font-display">
                Send Message
              </button>
            </form>
         </div>
       </div>
    </div>
  `
})
export class ContactComponent {}
