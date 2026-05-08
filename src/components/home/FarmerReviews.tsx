import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: "Ramesh Kumar",
    location: "Karnataka",
    review: "The KrushiX assistant helped me detect blight early. It literally saved my entire tomato crop this season!",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh"
  },
  {
    name: "Sunita Devi",
    location: "Maharashtra",
    review: "I use the weather planner to schedule irrigation. It has saved me so much water and time. Very easy to use.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sunita"
  },
  {
    name: "Prakash Patel",
    location: "Gujarat",
    review: "The voice assistant works flawlessly even in my local language. The AI recommendations for fertilizers are highly accurate.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Prakash"
  }
];

export default function FarmerReviews() {
  return (
    <section className="bg-bg py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-[28px] md:text-4xl font-semibold text-text leading-tight mb-4">
            What Our Farmers Say
          </h2>
          <p className="text-text/70 max-w-2xl mx-auto">
            Real stories from farmers across Bharat who have transformed their farming with KrushiX.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-border shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full bg-primary/10" />
                <div>
                  <h3 className="font-bold text-text">{review.name}</h3>
                  <p className="text-xs text-text/60">{review.location}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(review.rating)].map((_, index) => (
                  <Star key={index} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-text/80 text-sm leading-relaxed flex-grow italic">
                "{review.review}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
