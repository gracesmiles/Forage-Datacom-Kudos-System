import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertKudoSchema } from "@shared/schema";
import { z } from "zod";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCreateKudo } from "@/hooks/use-kudos";
import { useUsers } from "@/hooks/use-users";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Send, Award } from "lucide-react";

// Extend the schema for the form (we only need recipient, message, category)
// Sender ID is injected automatically
const formSchema = insertKudoSchema.omit({ fromUserId: true }).extend({
  toUserId: z.string().min(1, "Please select a colleague"),
  category: z.string().min(1, "Please select a category"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateKudoDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const { data: users, isLoading: usersLoading } = useUsers();
  const createKudo = useCreateKudo();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      category: "",
      toUserId: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    if (!currentUser) return;

    createKudo.mutate(
      { ...data, fromUserId: currentUser.id },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          toast({
            title: "Kudos Sent! 🎉",
            description: "Your appreciation has been shared with the team.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error sending kudos",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  // Filter out current user from recipients list
  const availableRecipients = users?.filter(u => u.id !== currentUser?.id) || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
          <Award className="mr-2 h-5 w-5" />
          Give Kudos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-card border-none shadow-2xl">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
          <DialogTitle className="text-2xl font-display">Celebrate a Colleague</DialogTitle>
          <DialogDescription className="text-primary-foreground/80 mt-1">
            Recognize someone's hard work and dedication.
          </DialogDescription>
        </div>
        
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="toUserId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Who are you celebrating?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-muted/30 border-border/50">
                          <SelectValue placeholder="Select a colleague..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {usersLoading ? (
                          <div className="p-2 text-center text-sm text-muted-foreground">Loading team...</div>
                        ) : (
                          availableRecipients.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.firstName ? `${user.firstName} ${user.lastName}` : user.email?.split('@')[0]}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-muted/30 border-border/50">
                          <SelectValue placeholder="What kind of impact did they make?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Teamwork">🤝 Teamwork</SelectItem>
                        <SelectItem value="Innovation">💡 Innovation</SelectItem>
                        <SelectItem value="Helpful">❤️ Helpful</SelectItem>
                        <SelectItem value="Other">🏆 Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message of Appreciation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share specifically what they did that was awesome..."
                        className="min-h-[120px] resize-none bg-muted/30 border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-2">
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={createKudo.isPending}
                  className="w-full sm:w-auto font-semibold shadow-md"
                >
                  {createKudo.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Kudos <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
