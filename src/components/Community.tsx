import React, { useState } from 'react';
import { 
  Search, 
  MessageSquare, 
  ThumbsUp, 
  MapPin, 
  ChevronLeft, 
  Send, 
  Plus, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Brain,
  Share2,
  MoreVertical,
  Image as ImageIcon,
  User,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';

interface Comment {
  id: number;
  author: string;
  text: string;
  upvotes: number;
  isAI?: boolean;
  replies?: Comment[];
}

interface Post {
  id: number;
  author: string;
  location: string;
  crop: string;
  issue: string;
  text: string;
  image?: string;
  status: 'Open' | 'Resolved';
  upvotes: number;
  comments: Comment[];
  tags: string[];
  timestamp: string;
  image_query?: string;
}

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    author: "Ramesh Patel",
    location: "Nashik, MH",
    crop: "Onion",
    issue: "Pest",
    text: "Small white insects are eating my onion leaves. The leaves are drying up. What spray should I use?",
    status: "Open",
    upvotes: 15,
    tags: ["#Onion", "#Pest", "#WhiteInsects"],
    timestamp: "2 hours ago",
    image_query: "onion leaves thrips damage",
    image: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=800",
    comments: [
      {
        id: 101,
        author: "Krishi AI",
        text: "This looks like Thrips. Spray Neem oil or Imidacloprid if the attack is heavy.",
        upvotes: 20,
        isAI: true
      }
    ]
  },
  {
    id: 2,
    author: "Siddaramaiah",
    location: "Hassan, KA",
    crop: "Potato",
    issue: "Disease",
    text: "Black spots are appearing on potato leaves. The spots are growing fast. Is my crop dying?",
    status: "Resolved",
    upvotes: 8,
    tags: ["#Potato", "#BlackSpots", "#Disease"],
    timestamp: "1 day ago",
    image_query: "potato leaf late blight spots",
    image: "https://images.unsplash.com/photo-1597362905123-2286341ff51e?auto=format&fit=crop&q=80&w=800",
    comments: [
      {
        id: 201,
        author: "Krishi AI",
        text: "This is Late Blight. Spray Mancozeb immediately to stop it from spreading.",
        upvotes: 12,
        isAI: true
      },
      {
        id: 202,
        author: "Basavaraj",
        text: "Yes, Mancozeb saved my crop last week. Do it quickly.",
        upvotes: 5
      }
    ]
  },
  {
    id: 3,
    author: "Muthu Kumar",
    location: "Madurai, TN",
    crop: "Cotton",
    issue: "Soil",
    text: "My soil is very hard and dry. The roots are not growing deep. Should I add more water or compost?",
    status: "Open",
    upvotes: 22,
    tags: ["#Cotton", "#HardSoil", "#Compost"],
    timestamp: "3 hours ago",
    image_query: "cracked dry farming soil",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800",
    comments: [
      {
        id: 301,
        author: "Krishi AI",
        text: "Hard soil needs organic matter. Add cow dung compost and plow it well. Don't just add water.",
        upvotes: 30,
        isAI: true
      }
    ]
  },
  {
    id: 4,
    author: "Amrik Singh",
    location: "Ludhiana, PB",
    crop: "Wheat",
    issue: "Water",
    text: "I gave water to my wheat field yesterday, but the water is still standing. Will it damage the roots?",
    status: "Resolved",
    upvotes: 10,
    tags: ["#Wheat", "#WaterLogging", "#Drainage"],
    timestamp: "2 days ago",
    image_query: "flooded wheat field waterlogging",
    image: "https://images.unsplash.com/photo-1433001353349-7220c326081e?auto=format&fit=crop&q=80&w=800",
    comments: [
      {
        id: 401,
        author: "Krishi AI",
        text: "Standing water cuts off air to roots. Make a small drain immediately to let the extra water flow out.",
        upvotes: 18,
        isAI: true
      }
    ]
  },
  {
    id: 5,
    author: "Sunita Devi",
    location: "Patna, BR",
    crop: "Mango",
    issue: "Weather",
    text: "Heavy rain yesterday dropped many small mango fruits from the tree. Can I save the rest?",
    status: "Open",
    upvotes: 45,
    tags: ["#Mango", "#HeavyRain", "#FruitDrop"],
    timestamp: "5 hours ago",
    image_query: "mango tree fruit drop after rain",
    image: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&q=80&w=800",
    comments: [
      {
        id: 501,
        author: "Krishi AI",
        text: "Give a light spray of Potassium Nitrate to make the remaining fruits stronger. Clear the fallen fruits to prevent disease.",
        upvotes: 50,
        isAI: true
      }
    ]
  },
  {
    id: 6,
    author: "Narsimha Rao",
    location: "Guntur, AP",
    crop: "Chilli",
    issue: "Yield",
    text: "My chilli plants look healthy, but there are very few flowers. Last year I got a lot more chilli.",
    status: "Open",
    upvotes: 14,
    tags: ["#Chilli", "#LowFlowers", "#Yield"],
    timestamp: "12 hours ago",
    image_query: "chilli plant no flowers",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800",
    comments: [
      {
        id: 601,
        author: "Krishi AI",
        text: "Too much nitrogen makes plants leafy but stops flowers. Stop urea and give phosphorus and potassium (like 0-52-34).",
        upvotes: 25,
        isAI: true
      }
    ]
  },
  {
    id: 7,
    author: "Hari Om",
    location: "Karnal, HR",
    crop: "Rice",
    issue: "Fertilizer",
    text: "Shopkeeper gave me DAP and Urea. Can I mix both and put them together in the field?",
    status: "Resolved",
    upvotes: 30,
    tags: ["#Rice", "#DAP", "#Urea"],
    timestamp: "3 days ago",
    image_query: "mixing dap and urea fertilizer",
    image: "https://images.unsplash.com/photo-1536633390847-b0c355994ca6?auto=format&fit=crop&q=80&w=800",
    comments: [
      {
        id: 701,
        author: "Krishi AI",
        text: "Yes, you can mix DAP and Urea, but apply them immediately after mixing. Do not store the mixture.",
        upvotes: 40,
        isAI: true
      }
    ]
  },
  {
    id: 8,
    author: "Venkatesh",
    location: "Mysuru, KA",
    crop: "Maize",
    issue: "Planning",
    text: "I grew maize this time. Can I grow maize again next season, or should I change the crop?",
    status: "Open",
    upvotes: 19,
    tags: ["#Maize", "#CropRotation", "#SoilHealth"],
    timestamp: "4 hours ago",
    image_query: "maize field crop rotation",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=800",
    comments: [
      {
        id: 801,
        author: "Krishi AI",
        text: "Growing maize again will reduce soil nutrients and increase pests. Grow a dal (pulse) crop like green gram to put nitrogen back in soil.",
        upvotes: 35,
        isAI: true
      }
    ]
  },
  {
    id: 9,
    author: "Kamlesh",
    location: "Surat, GJ",
    crop: "Groundnut",
    issue: "Seeds",
    text: "I planted groundnut seeds 10 days ago, but only half of them have come out of the soil. Are the seeds bad?",
    status: "Open",
    upvotes: 27,
    tags: ["#Groundnut", "#Seeds", "#Germination"],
    timestamp: "1 day ago",
    image_query: "groundnut plant germination failure",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    comments: [
      {
        id: 901,
        author: "Krishi AI",
        text: "It could be bad seeds, or the soil was too dry. Check one seed in the soil. If it is rotten, seeds were bad or soil had fungus.",
        upvotes: 22,
        isAI: true
      }
    ]
  },
  {
    id: 10,
    author: "Rakesh",
    location: "Indore, MP",
    crop: "Soybean",
    issue: "Market",
    text: "Soybean price is very low right now. Should I sell it or keep it in the godown for a month?",
    status: "Open",
    upvotes: 55,
    tags: ["#Soybean", "#MarketPrice", "#Storage"],
    timestamp: "6 hours ago",
    image_query: "soybean harvest storage",
    image: "https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?auto=format&fit=crop&q=80&w=800",
    comments: [
      {
        id: 1001,
        author: "Krishi AI",
        text: "Prices usually go up after the main harvest season ends. If you have safe, dry storage, waiting 1-2 months is a good idea.",
        upvotes: 60,
        isAI: true
      }
    ]
  }
];

export default function Community({ onBack }: { onBack: () => void }) {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [showAskForm, setShowAskForm] = useState(false);

  const filters = ["All", "Pest", "Disease", "Soil", "Water", "Yield", "Fertilizer", "Planning", "Market", "Resolved"];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.crop.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || 
                         post.crop === activeFilter || 
                         post.issue === activeFilter || 
                         post.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleUpvote = (postId: number, commentId?: number) => {
    if (commentId) {
      // Logic for comment upvote
    } else {
      setPosts(posts.map(p => p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p));
      if (selectedPost?.id === postId) setSelectedPost({ ...selectedPost, upvotes: selectedPost.upvotes + 1 });
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <AnimatePresence mode="wait">
        {!selectedPost ? (
          <motion.div 
            key="feed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-10">
              <div className="flex items-center gap-4">
                <button 
                  onClick={onBack}
                  className="w-10 h-10 bg-white border border-border rounded-[12px] flex items-center justify-center text-text/70 hover:text-primary transition-all shadow-sm active:scale-95"
                >
                  <ChevronLeft size={20} />
                </button>
                <h1 className="text-2xl font-display font-bold text-text">Farmer Community</h1>
              </div>
              <button 
                onClick={() => setShowAskForm(true)}
                className="bg-primary text-white px-6 py-3 rounded-[12px] font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:bg-primary/90 transition-all active:scale-95"
              >
                <Plus size={20} /> Ask Question
              </button>
            </div>

            {/* Search & Filters */}
            <div className="space-y-6 mb-10">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text/40" size={18} />
                <input 
                  type="text"
                  placeholder="Search farming problems, crops, or pests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-border rounded-[12px] focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary shadow-sm transition-all text-sm"
                />
              </div>

              <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4">
                {filters.map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={cn(
                      "whitespace-nowrap px-5 py-2.5 rounded-[12px] text-sm font-semibold border transition-all active:scale-95",
                      activeFilter === f 
                        ? "bg-primary border-primary text-white shadow-sm" 
                        : "bg-white border-border text-text/60 hover:border-primary/30"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Feed */}
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onClick={() => setSelectedPost(post)}
                  onUpvote={() => handleUpvote(post.id)}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <PostDetail 
              post={selectedPost} 
              onBack={() => setSelectedPost(null)}
              onUpvote={() => handleUpvote(selectedPost.id)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PostCard({ post, onClick, onUpvote }: { post: Post, onClick: () => void, onUpvote: (e: any) => void }) {
  return (
    <motion.div 
      whileHover={{ y: -2, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
      className="bg-white rounded-[12px] border border-border p-6 shadow-sm hover:border-primary/20 transition-all cursor-pointer overflow-hidden relative group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User size={20} />
          </div>
          <div>
            <h4 className="font-bold text-text text-sm">{post.author}</h4>
            <p className="text-text/40 text-xs flex items-center gap-1">
              <MapPin size={12} /> {post.location} • {post.timestamp}
            </p>
          </div>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-[8px] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5",
          post.status === 'Resolved' ? "bg-green-50 text-green-700 border border-green-100" : "bg-blue-50 text-blue-700 border border-blue-100"
        )}>
          {post.status === 'Resolved' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
          {post.status}
        </div>
      </div>

      <p className="text-text/80 text-sm mb-4 line-clamp-3 leading-relaxed">
        {post.text}
      </p>

      {post.image && (
        <div className="mb-5 rounded-[12px] overflow-hidden h-48 border border-border/50">
          <img 
            src={post.image} 
            alt={post.image_query} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800";
            }}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {post.tags.map(tag => (
          <span key={tag} className="text-[10px] font-bold text-primary/60 bg-primary/5 px-2 py-0.5 rounded-md">
            {tag}
          </span>
        ))}
      </div>

      {/* AI Answer Preview */}
      <div className="bg-primary/[0.03] rounded-[12px] p-4 border border-primary/10 mb-6 flex gap-3.5 items-start">
        <div className="w-6 h-6 rounded-[8px] bg-primary/10 flex items-center justify-center shrink-0">
          <Brain size={14} className="text-primary" />
        </div>
        <p className="text-xs text-primary/80 font-medium italic line-clamp-2 leading-relaxed">
          {post.comments.find(c => c.isAI)?.text}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-6">
          <button 
            onClick={(e) => { e.stopPropagation(); onUpvote(e); }}
            className="flex items-center gap-2 text-text/40 hover:text-primary transition-colors"
          >
            <ThumbsUp size={18} />
            <span className="text-xs font-bold">{post.upvotes}</span>
          </button>
          <div className="flex items-center gap-2.5 text-text/40">
            <MessageSquare size={18} />
            <span className="text-xs font-bold">{post.comments.length}</span>
          </div>
        </div>
        <button className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 hover:gap-2.5 transition-all">
          View Detail <ArrowLeft size={14} className="rotate-180" />
        </button>
      </div>
    </motion.div>
  );
}

function PostDetail({ post, onBack, onUpvote }: { post: Post, onBack: () => void, onUpvote: () => void }) {
  const aiAnswer = post.comments.find(c => c.isAI);
  const otherComments = post.comments.filter(c => !c.isAI);

  return (
    <div className="space-y-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2.5 text-text/40 hover:text-text transition-colors font-bold text-sm mb-6 active:scale-95 w-fit"
      >
        <ArrowLeft size={16} /> Back to Feed
      </button>

      <div className="bg-white rounded-[12px] border border-border p-7 shadow-md">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User size={24} />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-text">{post.author}</h3>
              <p className="text-text/40 text-sm flex items-center gap-1">
                <MapPin size={14} /> {post.location} • {post.timestamp}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text/40 hover:bg-bg transition-all">
              <Share2 size={18} />
            </button>
            <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text/40 hover:bg-bg transition-all">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-display font-bold text-text mb-4">
          Problem with {post.crop} ({post.issue})
        </h2>
        
        <p className="text-text/70 text-lg leading-relaxed mb-8">
          {post.text}
        </p>

        {post.image && (
          <div className="mb-8 rounded-[12px] overflow-hidden border border-border/50">
            <img 
              src={post.image} 
              alt={post.image_query} 
              className="w-full h-auto object-cover max-h-[400px]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800";
              }}
            />
          </div>
        )}

        {/* AI Answer Highlighted */}
        {aiAnswer && (
          <div className="bg-primary text-white p-7 rounded-[12px] shadow-lg relative overflow-hidden mb-10">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Brain size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 bg-white/10 w-fit px-3 py-1.5 rounded-[8px] text-[10px] font-bold uppercase tracking-widest border border-white/10">
                <Brain size={14} /> AI Solution
              </div>
              <p className="text-lg font-medium leading-relaxed mb-6">
                {aiAnswer.text}
              </p>
              <div className="flex items-center gap-5 text-white/70 text-xs">
                <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <ThumbsUp size={14} /> Helpful ({aiAnswer.upvotes})
                </button>
                <span className="opacity-30">•</span>
                <span>Verified by KrushiX AI</span>
              </div>
            </div>
          </div>
        )}

        {/* Comment Section */}
        <div className="border-t border-border/60 pt-8 mt-4">
          <h4 className="font-display font-bold text-xl mb-8 flex items-center gap-2.5">
            <MessageSquare className="text-primary" size={22} /> 
            Replies ({otherComments.length})
          </h4>

          <div className="space-y-8 mb-10">
            {otherComments.map(comment => (
              <div key={comment.id} className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 shrink-0">
                    <User size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="bg-bg/50 p-4 rounded-[12px] border border-border/50">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="font-bold text-sm text-text">{comment.author}</span>
                        <span className="text-[10px] text-text/30 font-medium">12 hours ago</span>
                      </div>
                      <p className="text-text/70 text-sm leading-relaxed">
                        {comment.text}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 px-2">
                      <button className="text-[10px] font-black uppercase tracking-widest text-text/40 hover:text-primary flex items-center gap-1">
                        <ThumbsUp size={12} /> {comment.upvotes}
                      </button>
                      <button className="text-[10px] font-black uppercase tracking-widest text-text/40 hover:text-primary">
                        Reply
                      </button>
                    </div>

                    {/* Nested Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 pl-8 space-y-4 border-l-2 border-border ml-2">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 shrink-0">
                              <User size={16} />
                            </div>
                            <div className="flex-1">
                              <div className="bg-white p-3 rounded-xl border border-border">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-black text-xs text-text">{reply.author}</span>
                                </div>
                                <p className="text-text/70 text-xs">
                                  {reply.text}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment Box */}
          <div className="bg-bg/30 border border-border p-4 rounded-[12px] mt-10">
            <textarea 
              placeholder="Add your solution or ask for details..."
              className="w-full bg-transparent border-none focus:ring-0 text-sm min-h-[90px] resize-none placeholder:text-text/30"
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
              <div className="flex gap-2">
                <button className="p-2 text-text/40 hover:text-primary transition-colors hover:bg-white rounded-[8px]">
                  <ImageIcon size={20} />
                </button>
              </div>
              <button className="bg-primary text-white px-6 py-2.5 rounded-[10px] font-bold text-xs flex items-center gap-2 shadow-sm hover:shadow-md hover:bg-primary/90 transition-all active:scale-95">
                <Send size={14} /> Post Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
