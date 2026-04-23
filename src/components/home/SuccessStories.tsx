import React from 'react';

const successStories = [
  { 
    metric: "30%", 
    label: "Crop loss reduced", 
    text: "Helped over 5,000 farmers identify diseases early and save their harvests.",
    image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=400"
  },
  { 
    metric: "25%", 
    label: "Water saved", 
    text: "Smart irrigation recommendations based on real-time soil and weather data.",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=400"
  }
];

export default function SuccessStories() {
  return (
    <section className="bg-bg py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-[28px] font-semibold text-text leading-tight">
              Trusted by 10,000+ <br />
              Farmers across Bharat
            </h2>
            <div className="space-y-6">
              {successStories.map((story, i) => (
                <div key={i} className="flex gap-4 p-6 bg-white rounded-3xl border border-border shadow-sm">
                  <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden">
                    <img src={story.image} className="w-full h-full object-cover" alt="Success story" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl font-black text-primary">{story.metric}</span>
                      <span className="text-[10px] font-bold text-text/40 uppercase tracking-widest">{story.label}</span>
                    </div>
                    <p className="text-sm text-text/70 leading-relaxed italic">"{story.text}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800" 
                className="w-full h-full object-cover" 
                alt="Farmer smile" 
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-border max-w-[240px]">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-bg overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="avatar" />
                    </div>
                  ))}
                </div>
                <span className="text-xs font-bold text-text/60">+12k more</span>
              </div>
              <p className="text-sm font-bold text-text">Join the community of smart farmers today.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
