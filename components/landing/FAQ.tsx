"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqs = [
  {
    question: "Is NoteFlow free to use?",
    answer:
      "Yes! NoteFlow offers a generous free plan with all core features. You can create unlimited notes, sync across devices, and collaborate with others. Premium features are available for power users who need advanced organization and collaboration tools.",
  },
  {
    question: "Can I use NoteFlow offline?",
    answer:
      "Absolutely! NoteFlow works offline on all devices. You can write, edit, and organize your notes without an internet connection. All changes will sync automatically when you're back online.",
  },
  {
    question: "How secure are my notes?",
    answer:
      "Your privacy and security are our top priorities. All notes are encrypted in transit and at rest. We use industry-standard security practices and never access your content. You have full control over who can see your notes.",
  },
  {
    question: "Can I share notes with others?",
    answer:
      "Yes! You can share individual notes or entire notebooks with team members, friends, or family. Set permissions to control who can view, edit, or comment on your shared notes. Real-time collaboration makes working together seamless.",
  },
  {
    question: "What file formats does NoteFlow support?",
    answer:
      "NoteFlow supports importing and exporting in multiple formats including Markdown, PDF, and plain text. You can also embed images, videos, and other media directly into your notes for a richer experience.",
  },
  {
    question: "How does the AI organization work?",
    answer:
      "Our AI learns from your writing patterns and automatically suggests tags, categories, and related notes. It helps you discover connections between your thoughts and keeps your notes organized without manual effort.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about NoteFlow. Can&apos;t find the
            answer you&apos;re looking for?
            <a
              href="#contact"
              className="text-blue-600 hover:text-blue-700 font-medium ml-1"
            >
              Contact our support team
            </a>
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="border border-gray-200 hover:border-gray-300 transition-colors duration-200"
            >
              <CardHeader
                className="cursor-pointer pb-4"
                onClick={() => toggleFAQ(index)}
              >
                <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-900">
                  {faq.question}
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </CardTitle>
              </CardHeader>
              {openIndex === index && (
                <CardContent className="pt-0">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
