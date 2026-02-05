import { SignInButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Quote, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  // NOTE: We removed useAuth and useEffect because App.tsx 
  // now handles the redirect logic using <SignedIn> and <SignedOut>

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              K
            </div>
            <span>KudosBoard</span>
          </div>
          
          {/* UPDATED: Login Button */}
          <SignInButton mode="modal">
            <Button variant="ghost">Log In</Button>
          </SignInButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Star className="w-4 h-4 fill-primary" /> Internal Recognition Platform
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight mb-6 tracking-tight">
                Celebrate <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Great Work</span> Every Day.
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Build a culture of appreciation. Share kudos with your colleagues and celebrate the wins, big and small.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {/* UPDATED: Get Started Button */}
                <SignInButton mode="modal">
                  <Button 
                    size="lg" 
                    className="h-14 px-8 text-lg rounded-xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all"
                  >
                    Get Started <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </SignInButton>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-14 px-8 text-lg rounded-xl border-2"
                >
                  View Demo
                </Button>
              </div>
              
              <div className="mt-10 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="Avatar" />
                    </div>
                  ))}
                </div>
                <p>Join your team and start sharing kudos today.</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-tr from-primary/20 to-purple-400/20 rounded-full blur-3xl -z-10" />
              
              <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/10 rotate-2 hover:rotate-0 transition-transform duration-500">
                 <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80" 
                  alt="Team celebration"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <div className="text-white">
                    <Quote className="w-8 h-8 mb-2 opacity-80" />
                    <p className="text-lg font-medium italic">
                      "Since using KudosBoard, our team morale has skyrocketed. It's so easy to say thank you."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: Star, 
                title: "Recognize Impact", 
                desc: "Highlight specific contributions and tie them to company values." 
              },
              { 
                icon: Quote, 
                title: "Build Culture", 
                desc: "Foster a positive environment where appreciation is the norm." 
              },
              { 
                icon: CheckCircle2, 
                title: "Easy to Use", 
                desc: "Sending a kudo takes seconds, but the impact lasts forever." 
              },
            ].map((feature, i) => (
              <div key={i} className="bg-background p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}