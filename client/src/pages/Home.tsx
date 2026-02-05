import { useKudos } from "@/hooks/use-kudos";
import { useAuth } from "@/hooks/use-auth";
import { KudoCard } from "@/components/KudoCard";
import { CreateKudoDialog } from "@/components/CreateKudoDialog";
import { Navigation } from "@/components/Navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Award, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
// Find your import from @/components/ui/card and make sure it looks like this:
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { data: kudos, isLoading, isError } = useKudos();
  const { user } = useAuth();

  // If loading or error, allow Navigation to handle its own loading state
  // But strictly, if we don't have user yet, we might want a loader.
  // The route protection handles the redirect, so we assume user exists if we are here.

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div className="space-y-2">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-4xl font-display font-bold text-foreground"
            >
              Welcome back, {user?.firstName ? `${user?.firstName} ${user?.lastName}` : (user?.email?.split('@')[0] ?? "User")}! 👋
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg max-w-2xl"
            >
              See the latest appreciation from your team or share some love yourself.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <CreateKudoDialog />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Recent Kudos</h2>
            </div>

            {isLoading ? (
              // Loading Skeletons
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border rounded-xl p-6 space-y-4">
                  <div className="flex justify-between">
                    <div className="flex gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-20 w-full rounded-lg" />
                </div>
              ))
            ) : isError ? (
              <div className="text-center py-12 bg-destructive/5 rounded-xl border border-destructive/20">
                <p className="text-destructive font-medium">Failed to load kudos feed.</p>
              </div>
            ) : kudos?.length === 0 ? (
              <div className="text-center py-16 bg-muted/20 rounded-2xl border-2 border-dashed border-muted">
                <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No kudos yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Be the first to recognize a colleague's hard work! Click the button above to get started.
                </p>
                <CreateKudoDialog />
              </div>
            ) : (
              <div className="space-y-6">
                {kudos?.map((kudo, index) => (
                  <KudoCard key={kudo.id} kudo={kudo} index={index} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Stats / Info */}
          <div className="hidden lg:block lg:col-span-4 space-y-6">
            <Card className="border-border/60 bg-gradient-to-br from-white to-slate-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-lg">Impact Categories</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Recognize your colleagues for their specific contributions to our company values.
                </p>
                <div className="space-y-3">
                  {[
                    { label: "Teamwork", color: "bg-blue-500", desc: "Collaborating effectively" },
                    { label: "Innovation", color: "bg-amber-500", desc: "New ideas & solutions" },
                    { label: "Helpful", color: "bg-emerald-500", desc: "Going above and beyond" },
                    { label: "Other", color: "bg-purple-500", desc: "General appreciation" },
                  ].map((cat) => (
                    <div key={cat.label} className="flex items-center justify-between p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-border/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                        <span className="font-medium text-sm">{cat.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{cat.desc}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="relative rounded-2xl overflow-hidden min-h-[200px] flex items-end p-6 group">
              {/* Unsplash image for office vibe, static URL as per instruction for generic use */}
              {/* office teamwork diverse group working together */}
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop" 
                alt="Team Collaboration"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="relative z-10 text-white">
                <h4 className="font-bold text-lg mb-1">Culture of Appreciation</h4>
                <p className="text-sm text-white/80">
                  Recognizing great work boosts morale and builds stronger teams.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
