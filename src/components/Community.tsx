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
}

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    author: "Ramesh Kumar",
    location: "Mandya, KA",
    crop: "Rice",
    issue: "Pest",
    text: "My rice crop is showing yellow spots on the lower leaves. It's spreading fast. Is this a pest or nutrient deficiency?",
    status: "Open",
    upvotes: 12,
    tags: ["#Rice", "#Pest", "#Yellowing"],
    timestamp: "2 hours ago",
    comments: [
      {
        id: 101,
        author: "Krishi AI",
        text: "Based on your description, this looks like Brown Plant Hopper (BPH) damage. Check the base of the plants for small brown insects. Apply Imidacloprid if infestation is high.",
        upvotes: 24,
        isAI: true
      },
      {
        id: 102,
        author: "Suresh P.",
        text: "I had this last year. Make sure you don't over-fertilize with Nitrogen, it makes it worse.",
        upvotes: 5,
        replies: [
          { id: 103, author: "Ramesh Kumar", text: "Thanks Suresh, I did add urea recently. That might be it.", upvotes: 2 }
        ]
      }
    ]
  },
  {
    id: 2,
    author: "Somanna B.",
    location: "Tumakuru, KA",
    crop: "Tomato",
    issue: "Disease",
    text: "White powdery substance on tomato stems. The fruits are looking fine for now but stems are weak.",
    status: "Resolved",
    upvotes: 8,
    tags: ["#Tomato", "#Fungal", "#Resolved"],
    timestamp: "1 day ago",
    comments: [
      {
        id: 201,
        author: "Krishi AI",
        text: "This is Powdery Mildew. Improve air circulation and apply a sulfur-based fungicide.",
        upvotes: 15,
        isAI: true
      },
      {
        id: 202,
        author: "Gopal Gowda",
        text: "Correct! I used organic spray and it worked. Marked as resolved for you.",
        upvotes: 10
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

  const filters = ["All", "Rice", "Tomato", "Wheat", "Pest", "Disease", "Soil", "Resolved"];

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <button 
                  onClick={onBack}
                  className="w-10 h-10 bg-white border border-border rounded-xl flex items-center justify-center text-text/70 hover:text-primary transition-all shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <h1 className="text-2xl font-display font-extrabold text-text">Farmer Community</h1>
              </div>
              <button 
                onClick={() => setShowAskForm(true)}
                className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-primary/90 transition-all"
              >
                <Plus size={20} /> Ask Question
              </button>
            </div>

            {/* Search & Filters */}
            <div className="space-y-6 mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text/40" size={20} />
                <input 
                  type="text"
                  placeholder="Search farming problems, crops, or pests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm transition-all"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                {filters.map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={cn(
                      "whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold border transition-all",
                      activeFilter === f 
                        ? "bg-primary border-primary text-white shadow-md" 
                        : "bg-white border-border text-text/60 hover:border-primary/40"
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
      whileHover={{ y: -2 }}
      className="bg-white rounded-3xl border border-border p-6 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden relative group"
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
          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1",
          post.status === 'Resolved' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
        )}>
          {post.status === 'Resolved' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
          {post.status}
        </div>
      </div>

      <p className="text-text/80 text-sm mb-4 line-clamp-3 leading-relaxed">
        {post.text}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {post.tags.map(tag => (
          <span key={tag} className="text-[10px] font-bold text-primary/60 bg-primary/5 px-2 py-0.5 rounded-md">
            {tag}
          </span>
        ))}
      </div>

      {/* AI Answer Preview */}
      <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 mb-6 flex gap-3 items-start">
        <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
          <Brain size={14} className="text-primary" />
        </div>
        <p className="text-xs text-primary/80 font-medium italic line-clamp-2">
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
          <div className="flex items-center gap-2 text-text/40">
            <MessageSquare size={18} />
            <span className="text-xs font-bold">{post.comments.length}</span>
          </div>
        </div>
        <button className="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
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
        className="flex items-center gap-2 text-text/40 hover:text-text transition-colors font-bold text-sm mb-4"
      >
        <ArrowLeft size={16} /> Back to Feed
      </button>

      <div className="bg-white rounded-3xl border border-border p-8 shadow-xl">
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

        <h2 className="text-2xl font-display font-black text-text mb-4">
          Problem with {post.crop} ({post.issue})
        </h2>
        
        <p className="text-text/70 text-lg leading-relaxed mb-8">
          {post.text}
        </p>

        {/* AI Answer Highlighted */}
        {aiAnswer && (
          <div className="bg-primary text-white p-8 rounded-3xl shadow-xl relative overflow-hidden mb-8">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Brain size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                <Brain size={14} /> AI Solution
              </div>
              <p className="text-lg font-medium leading-relaxed mb-4">
                {aiAnswer.text}
              </p>
              <div className="flex items-center gap-4 text-white/60 text-xs">
                <button className="flex items-center gap-1 hover:text-white transition-colors">
                  <ThumbsUp size={14} /> Helpful ({aiAnswer.upvotes})
                </button>
                <span>•</span>
                <span>Verified by KrushiX</span>
              </div>
            </div>
          </div>
        )}

        {/* Comment Section */}
        <div className="border-t border-border pt-8 mt-8">
          <h4 className="font-display font-black text-xl mb-6 flex items-center gap-2">
            <MessageSquare className="text-primary" /> 
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
                    <div className="bg-bg p-4 rounded-2xl border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-black text-sm text-text">{comment.author}</span>
                        <span className="text-[10px] text-text/40 font-bold">12 hours ago</span>
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
          <div className="bg-bg border border-border p-4 rounded-2xl">
            <textarea 
              placeholder="Add your solution or ask for details..."
              className="w-full bg-transparent border-none focus:ring-0 text-sm min-h-[80px] resize-none"
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
              <div className="flex gap-2">
                <button className="p-2 text-text/40 hover:text-primary transition-colors">
                  <ImageIcon size={20} />
                </button>
              </div>
              <button className="bg-primary text-white px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md hover:bg-primary/90">
                <Send size={14} /> Post Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
