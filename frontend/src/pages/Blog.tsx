import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Tag, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection, AnimatedStagger, AnimatedItem } from "@/components/AnimatedSection";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { Footer } from "@/components/Footer";
import { useGetBlogQuery, useSubmitSubscriptionMutation } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";

const Blog = () => {
  const { data, isLoading } = useGetBlogQuery();
  const [activeCategory, setActiveCategory] = useState("All");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [submitSubscription] = useSubmitSubscriptionMutation();
  const { toast } = useToast();

  const allPosts = data?.items || [];

  // Get unique categories
  const categories = [
    { name: "All", count: allPosts.length },
    ...Array.from(
      allPosts.reduce((acc, post) => {
        const existing = acc.get(post.category);
        acc.set(post.category, (existing || 0) + 1);
        return acc;
      }, new Map())
    ).map(([name, count]) => ({ name, count })),
  ];

  const filteredPosts = activeCategory === "All"
    ? allPosts
    : allPosts.filter((post) => post.category === activeCategory);

  const featuredPost = allPosts[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-[#00D9FF]/20 rounded-full"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-[#00D9FF] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-white/60 mt-4">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      <Header />
      <div className="pt-20">
        <PageBreadcrumb />
      </div>

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00D9FF]/5 rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block mb-4"
            >
              <span className="inline-flex items-center gap-2 text-[#00D9FF] font-bold text-sm tracking-[0.2em] uppercase">
                <span className="w-8 h-[2px] bg-gradient-to-r from-transparent to-[#00D9FF]" />
                Our Blog
                <span className="w-8 h-[2px] bg-gradient-to-l from-transparent to-[#00D9FF]" />
              </span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Insights & <span className="text-[#00D9FF]">Resources</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed">
              Stay updated with the latest trends, tips, and insights in web development, 
              software engineering, and digital marketing.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16 relative">
          <div className="container mx-auto px-6 lg:px-12">
            <AnimatedSection>
              <div className="max-w-7xl mx-auto">
                <h2 className="text-sm font-bold text-[#00D9FF] uppercase tracking-[0.2em] mb-8">
                  Featured Article
                </h2>
                <motion.a
                  href={`/blog/${featuredPost._id}`}
                  whileHover={{ y: -8 }}
                  className="group block"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF]/10 to-[#0066FF]/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative grid lg:grid-cols-2 gap-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500">
                      <div className="aspect-[16/10] lg:aspect-auto overflow-hidden">
                        {featuredPost.image && (
                          <motion.img
                            src={featuredPost.image}
                            alt={featuredPost.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                          />
                        )}
                      </div>
                      <div className="p-10 lg:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-6">
                          <span className="text-xs font-bold text-white bg-[#00D9FF]/20 px-4 py-2 rounded-full uppercase tracking-wider">
                            {featuredPost.category}
                          </span>
                          <span className="text-sm text-white/50 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(featuredPost.created_at || "").toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black text-white mb-4 group-hover:text-[#00D9FF] transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>
                          {featuredPost.title}
                        </h3>
                        <p className="text-white/60 mb-8 leading-relaxed text-lg">
                          {featuredPost.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/50 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            5 min read
                          </span>
                          <span className="text-[#00D9FF] font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                            Read Article
                            <ArrowRight className="w-5 h-5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.a>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Category Filter & Posts */}
      <section className="py-20 relative">
        <div className="absolute inset-0">
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#0066FF]/5 rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Categories */}
            <AnimatedSection className="mb-12">
              <div className="flex flex-wrap items-center gap-4">
                <Tag className="w-5 h-5 text-[#00D9FF]" />
                {categories.map((category) => (
                  <motion.button
                    key={category.name}
                    onClick={() => setActiveCategory(category.name)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      activeCategory === category.name
                        ? "bg-gradient-to-r from-[#00D9FF] to-[#0066FF] text-white shadow-[0_0_20px_rgba(0,217,255,0.4)]"
                        : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    {category.name}
                    <span className="ml-2 opacity-70">({category.count})</span>
                  </motion.button>
                ))}
              </div>
            </AnimatedSection>

            {/* Posts Grid */}
            <AnimatedStagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <AnimatedItem key={post._id}>
                  <motion.a
                    href={`/blog/${post._id}`}
                    whileHover={{ y: -8 }}
                    className="group block h-full"
                  >
                    <div className="relative h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF]/10 to-[#0066FF]/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <article className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 h-full flex flex-col">
                        <div className="aspect-[16/10] overflow-hidden relative">
                          <motion.img
                            src={post.image || "https://images.unsplash.com/photo-1455849318169-8728d338c3f7?w=800&q=80"}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                          />
                          <div className="absolute top-4 left-4">
                            <span className="inline-block bg-gradient-to-r from-[#00D9FF] to-[#0066FF] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase">
                              {post.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-center gap-3 mb-3 text-sm text-white/50">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.created_at || "").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {Math.ceil((post.content?.split(" ") || []).length / 200)} min
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00D9FF] transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-white/60 text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-2 text-[#00D9FF] font-semibold text-sm group-hover:gap-3 transition-all pt-4 border-t border-white/10">
                            Read Article
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </article>
                    </div>
                  </motion.a>
                </AnimatedItem>
              ))}
            </AnimatedStagger>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6 lg:px-12">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00D9FF]/10 to-[#0066FF]/10 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-[#00D9FF]/10 to-[#0066FF]/10 backdrop-blur-sm border border-white/10 rounded-3xl p-10 md:p-16 text-center">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Subscribe to Our <span className="text-[#00D9FF]">Newsletter</span>
                </h2>
                <p className="text-white/60 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
                  Get the latest insights, tips, and industry news delivered straight to your inbox. No spam, just value.
                </p>
                <form
                  className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newsletterEmail.trim()) return;
                    setIsSubscribing(true);
                    try {
                      const res = await submitSubscription({ email: newsletterEmail.trim(), source: "blog" }).unwrap();
                      setNewsletterEmail("");
                      toast({ title: "Subscribed", description: res.message || "Thanks for subscribing!" });
                    } catch (err) {
                      toast({ title: "Subscription failed", description: "Please try again later.", variant: "destructive" });
                    } finally {
                      setIsSubscribing(false);
                    }
                  }}
                >
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 h-14 px-6 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D9FF] focus:ring-2 focus:ring-[#00D9FF] transition-all"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={isSubscribing}
                    className="bg-gradient-to-r from-[#00D9FF] to-[#0066FF] text-white font-bold px-8 h-14 rounded-xl hover:shadow-[0_0_40px_rgba(0,217,255,0.6)] transition-all duration-300"
                  >
                    {isSubscribing ? "Subscribing..." : "Subscribe"}
                  </Button>
                </form>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;