import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Lightbulb, HandHeart, Trophy } from "lucide-react";
import type { KudoWithUser } from "@/hooks/use-kudos";

interface KudoCardProps {
  kudo: KudoWithUser;
  index: number;
}

const CATEGORY_ICONS: Record<string, any> = {
  Teamwork: Users,
  Innovation: Lightbulb,
  Helpful: HandHeart,
  Other: Trophy,
};

const CATEGORY_COLORS: Record<string, string> = {
  Teamwork: "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200",
  Innovation: "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200",
  Helpful: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200",
  Other: "bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200",
};

export function KudoCard({ kudo, index }: KudoCardProps) {
  const Icon = CATEGORY_ICONS[kudo.category] || Heart;
  const badgeColor = CATEGORY_COLORS[kudo.category] || "bg-gray-100 text-gray-700";

  // Helper to get initials
  const getInitials = (name?: string) => {
    if (!name) return "??";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  };

  const fromName = kudo.fromUser.firstName 
    ? `${kudo.fromUser.firstName} ${kudo.fromUser.lastName}`.trim()
    : kudo.fromUser.username;

  const toName = kudo.toUser.firstName
    ? `${kudo.toUser.firstName} ${kudo.toUser.lastName}`.trim()
    : kudo.toUser.username;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-black/5">
                <AvatarImage src={kudo.fromUser.profileImageUrl || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {getInitials(fromName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm">
                <span className="font-semibold text-foreground">{fromName}</span>
                <span className="text-muted-foreground text-xs">gave kudos to</span>
              </div>
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-black/5">
                <AvatarImage src={kudo.toUser.profileImageUrl || undefined} />
                <AvatarFallback className="bg-accent text-accent-foreground text-xs font-bold">
                  {getInitials(toName)}
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold text-foreground text-sm">{toName}</span>
            </div>
            
            <Badge variant="outline" className={`gap-1.5 py-1 px-2.5 rounded-full border ${badgeColor}`}>
              <Icon className="w-3.5 h-3.5" />
              {kudo.category}
            </Badge>
          </div>

          <div className="bg-muted/30 p-4 rounded-xl border border-border/50 relative">
            <div className="absolute -top-2 -left-2 text-primary/10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.01691 21L5.01691 18C5.01691 16.8954 5.91234 16 7.01691 16H10.0169C10.5692 16 11.0169 15.5523 11.0169 15V9C11.0169 8.44772 10.5692 8 10.0169 8H6.01691C5.46462 8 5.01691 8.44772 5.01691 9V11C5.01691 11.5523 4.56919 12 4.01691 12H3.01691V5H13.0169V15C13.0169 18.3137 10.3306 21 7.01691 21H5.01691Z" />
              </svg>
            </div>
            <p className="text-foreground/90 italic relative z-10 leading-relaxed">
              "{kudo.message}"
            </p>
          </div>

          <div className="flex justify-end mt-4">
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              {formatDistanceToNow(new Date(kudo.createdAt), { addSuffix: true })}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
