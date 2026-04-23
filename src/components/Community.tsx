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
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrSKQAoRZzlXvTSWjK8vhsxozDyJonXP5ZcQ&s",
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
    author: "Chethan M",
    location: "Hassan, KA",
    crop: "Potato",
    issue: "Disease",
    text: "Black spots are appearing on potato leaves. The spots are growing fast. Is my crop dying?",
    status: "Resolved",
    upvotes: 8,
    tags: ["#Potato", "#BlackSpots", "#Disease"],
    timestamp: "1 day ago",
    image_query: "potato leaf late blight spots",
    image: "data:image/jpeg;base64,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",
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

  const handleDelete = (postId: number) => {
    setPosts(posts.filter(p => p.id !== postId));
    if (selectedPost?.id === postId) setSelectedPost(null);
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

            <AnimatePresence>
              {showAskForm && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-8"
                >
                  <AskQuestionForm 
                    onClose={() => setShowAskForm(false)} 
                    onSubmit={async (newPost) => {
                      setPosts([newPost, ...posts]);
                      setShowAskForm(false);
                      
                      try {
                        const response = await fetch('/api/community/ai-reply', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            crop: newPost.crop,
                            issue: newPost.issue,
                            text: newPost.text
                          })
                        });
                        const aiReply = await response.json();
                        
                        setPosts(prev => prev.map(p => 
                          p.id === newPost.id 
                            ? { ...p, comments: [aiReply, ...p.comments] }
                            : p
                        ));
                      } catch (error) {
                        console.error('Failed to get AI reply:', error);
                      }
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

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
                  onDelete={() => handleDelete(post.id)}
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
              onDelete={() => handleDelete(selectedPost.id)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const PostCard = ({ post, onClick, onUpvote, onDelete }: { 
  post: Post, 
  onClick: () => void, 
  onUpvote: (e?: any) => void,
  onDelete: () => void,
  key?: any
}) => {
  const [showMore, setShowMore] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `KrishiX: Problem with ${post.crop}`,
        text: post.text,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert("Link copied to clipboard!");
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
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
        <div className="flex items-center gap-2">
          <div className={cn(
            "px-3 py-1 rounded-[8px] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5",
            post.status === 'Resolved' ? "bg-green-50 text-green-700 border border-green-100" : "bg-blue-50 text-blue-700 border border-blue-100"
          )}>
            {post.status === 'Resolved' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
            {post.status}
          </div>
          
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMore(!showMore); }}
              className="w-8 h-8 rounded-full hover:bg-bg flex items-center justify-center text-text/40 transition-colors"
            >
              <MoreVertical size={16} />
            </button>
            <AnimatePresence>
              {showMore && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-full mt-1 bg-white border border-border rounded-xl shadow-xl z-50 py-1 min-w-[160px]"
                >
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowMore(false); onDelete(); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 font-medium"
                  >
                    Delete from feed
                  </button>
                  <button 
                    onClick={handleShare}
                    className="w-full text-left px-4 py-2 text-sm text-text/70 hover:bg-bg transition-colors flex items-center gap-2 font-medium"
                  >
                    Share Post
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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

function PostDetail({ post, onBack, onUpvote, onDelete }: { 
  post: Post, 
  onBack: () => void, 
  onUpvote: () => void,
  onDelete: () => void 
}) {
  const aiAnswer = post.comments.find(c => c.isAI);
  const otherComments = post.comments.filter(c => !c.isAI);
  const [showMore, setShowMore] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `KrishiX: Problem with ${post.crop}`,
        text: post.text,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert("Link copied to clipboard!");
    }
  };

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
            <button 
              onClick={handleShare}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text/40 hover:bg-bg transition-all"
            >
              <Share2 size={18} />
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowMore(!showMore)}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text/40 hover:bg-bg transition-all"
              >
                <MoreVertical size={18} />
              </button>
              <AnimatePresence>
                {showMore && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 bg-white border border-border rounded-xl shadow-2xl z-50 py-1 min-w-[180px]"
                  >
                    <button 
                      onClick={() => { setShowMore(false); onDelete(); }}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 font-bold"
                    >
                      Delete from feed
                    </button>
                    <button className="w-full text-left px-4 py-3 text-sm text-text/70 hover:bg-bg transition-colors flex items-center gap-2 font-bold">
                      Report Problem
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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

function AskQuestionForm({ onClose, onSubmit }: { onClose: () => void, onSubmit: (post: Post) => void }) {
  const [formData, setFormData] = useState({
    crop: '',
    issue: 'Pest',
    text: '',
    location: 'Unknown'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.crop || !formData.text) return;

    const newPost: Post = {
      id: Date.now(),
      author: "You",
      location: formData.location,
      crop: formData.crop,
      issue: formData.issue,
      text: formData.text,
      status: "Open",
      upvotes: 0,
      tags: [`#${formData.crop}`, `#${formData.issue}`],
      timestamp: "Just now",
      image_query: `${formData.crop} ${formData.issue} farming problem`,
      comments: []
    };

    onSubmit(newPost);
  };

  return (
    <div className="bg-white rounded-[12px] border border-primary/20 p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-bold text-lg text-text flex items-center gap-2">
          <Plus size={20} className="text-primary" /> Ask the Community
        </h3>
        <button onClick={onClose} className="text-text/40 hover:text-text transition-colors">
          <Plus size={20} className="rotate-45" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text/60 ml-1">Crop Type</label>
            <input 
              type="text"
              placeholder="e.g. Tomato, Rice..."
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-[10px] text-sm focus:border-primary focus:ring-1 focus:ring-primary/10 outline-none"
              value={formData.crop}
              onChange={e => setFormData({ ...formData, crop: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text/60 ml-1">Problem Category</label>
            <select 
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-[10px] text-sm focus:border-primary focus:ring-1 focus:ring-primary/10 outline-none"
              value={formData.issue}
              onChange={e => setFormData({ ...formData, issue: e.target.value })}
            >
              <option>Pest</option>
              <option>Disease</option>
              <option>Soil</option>
              <option>Water</option>
              <option>Yield</option>
              <option>Weather</option>
              <option>Market</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text/60 ml-1">Describe the Problem</label>
          <textarea 
            placeholder="Tell us what's happening with your crop..."
            className="w-full px-4 py-3 bg-bg border border-border rounded-[10px] text-sm focus:border-primary focus:ring-1 focus:ring-primary/10 outline-none min-h-[120px] resize-none"
            value={formData.text}
            onChange={e => setFormData({ ...formData, text: e.target.value })}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <button type="button" className="p-2.5 rounded-[10px] bg-bg border border-border text-text/40 hover:text-primary hover:border-primary/20 transition-all">
              <ImageIcon size={20} />
            </button>
            <button type="button" className="p-2.5 rounded-[10px] bg-bg border border-border text-text/40 hover:text-primary hover:border-primary/20 transition-all">
              <MapPin size={20} />
            </button>
          </div>
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-[10px] font-bold text-sm text-text/40 hover:text-text transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-primary text-white px-8 py-2.5 rounded-[10px] font-bold text-sm shadow-md hover:bg-primary/90 transition-all active:scale-95"
            >
              Post Question
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
