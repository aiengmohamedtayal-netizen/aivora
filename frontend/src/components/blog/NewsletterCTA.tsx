import { NewsletterForm } from "@/components/sections/NewsletterForm"

export function NewsletterCTA() {
  return (
    <div className="my-16 p-8 md:p-12 rounded-3xl bg-primary/5 border border-primary/20 flex flex-col items-center text-center">
      <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Enjoyed this article?</h3>
      <p className="text-muted-foreground mb-8 max-w-lg">Subscribe to our newsletter to receive future engineering insights, product design strategies, and automation guides straight to your inbox.</p>
      <div className="w-full max-w-md mx-auto">
        <NewsletterForm source="blog" />
      </div>
    </div>
  )
}