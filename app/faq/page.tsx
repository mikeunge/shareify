'use client';
import { useRouter } from 'next/navigation';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const FAQS = [
  {
    question: 'What does this app do?',
    answer:
      'It exports your (private) liked songs on Spotify into a public playlist, so you can easily share your music taste with others.'
  },
  {
    question: 'Why do I need to log in with Spotify?',
    answer:
      'Logging in allows us to fetch your liked songs and create a playlist on your behalf. We use the Spotify API and require your user token to do this.'
  },
  {
    question: 'Is my data safe?',
    answer:
      'Yes. We do not collect or store data. We only use your token to interact with Spotify during the session (which is stored on your device).'
  },
  {
    question: 'Can I change the playlist name?',
    answer: "Yes, you can customize the playlist name before it's created."
  },
  {
    question: 'Can I upload a custom cover image?',
    answer:
      'Absolutely! You can upload a custom image to make your playlist look exactly how you want.'
  },
  {
    question: 'Will my liked songs be modified?',
    answer:
      'Nope. Your liked songs stay untouched — we only read them to create a new public playlist.'
  }
];

export default function FAQ() {
  const router = useRouter();
  return (
    <section className="w-full max-w-3xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-4xl font-bold text-gray-900">FAQ</h2>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="absolute top-4 left-4 flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      <Accordion type="single" collapsible={true} className="space-y-6">
        {FAQS.map((faq) => (
          <AccordionItem
            key={faq.question}
            value={`faq-${faq.question}`}
            className="border-b border-gray-200 pb-6"
          >
            <h3 className="text-xl font-semibold">{faq.question}</h3>
            <div className="text-base text-gray-600 mt-3">{faq.answer}</div>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
