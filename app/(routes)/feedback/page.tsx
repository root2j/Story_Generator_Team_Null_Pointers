
import { MessageSquare, Star, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FeedbackForm } from "./components/feedback-form";

export default function FeedBack() {
  return (
    <main className="bg-gradient-to-b from-background to-background/90 relative overflow-hidden">
      {/* Neon gradient effects */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-40 left-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>

      <div className="mx-auto px-4 py-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
              We Value Your Feedback
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Help us improve our product by sharing your thoughts, reporting bugs, or suggesting new features.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <Badge variant="outline" className="py-1.5 px-3 flex items-center gap-1.5 text-sm">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                Rate our product
              </Badge>
              <Badge variant="outline" className="py-1.5 px-3 flex items-center gap-1.5 text-sm">
                <MessageSquare className="h-3.5 w-3.5" />
                Share your thoughts
              </Badge>
              <Badge variant="outline" className="py-1.5 px-3 flex items-center gap-1.5 text-sm">
                <ArrowRight className="h-3.5 w-3.5" />
                Help us improve
              </Badge>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border rounded-xl shadow-lg p-6 md:p-8">
            <FeedbackForm />
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Your feedback is anonymous unless you provide contact information.
              We use this information to improve our products and services.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}