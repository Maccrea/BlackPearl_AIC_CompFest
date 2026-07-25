import React from "react";
import {
  Search,
  Activity,
  AlertTriangle,
  Wrench,
  Brain,
  Database,
  ShieldCheck,
  MessageCircleQuestion,
  Mail,
  Phone,
} from "lucide-react";

const guides = [
  {
    icon: Activity,
    title: "Monitor Production Line",
    description:
      "Monitor the condition and operational status of machines across production lines.",
  },
  {
    icon: AlertTriangle,
    title: "Detect Anomaly",
    description:
      "Identify machines with Warning or Critical conditions that require attention.",
  },
  {
    icon: Wrench,
    title: "Check Machine Detail",
    description:
      "Review temperature, vibration, RPM, current, machine health, and maintenance information.",
  },
  {
    icon: Brain,
    title: "Run AI Analysis",
    description:
      "Analyze detected anomalies and identify possible root causes using AI analysis.",
  },
  {
    icon: Database,
    title: "Review Similar Case",
    description:
      "Use previously validated cases and successful solutions when a relevant case is found.",
  },
  {
    icon: ShieldCheck,
    title: "Validate New Recommendation",
    description:
      "If no similar case exists, the AI recommendation is reviewed and validated by an engineer.",
  },
];

const faqs = [
  {
    question: "What should I do when a machine is Critical?",
    answer:
      "Open the machine detail page, review the detected parameters, then continue to AI Analysis to identify the possible root cause and recommended action.",
  },
  {
    question: "When is AI Recommendation used?",
    answer:
      "AI Recommendation is generated when no relevant historical case is found in the Knowledge Base.",
  },
  {
    question: "What happens when a Similar Case is found?",
    answer:
      "The system displays the previous root cause and solution that was successfully used by an engineer.",
  },
  {
    question: "Who validates a new AI Recommendation?",
    answer:
      "A qualified engineer reviews the AI-generated recommendation before it can be used as a new solution.",
  },
];

export default function Help() {
  return (
    <div className="min-h-full w-full bg-[#0B0E14]">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-8 sm:px-8 lg:px-10 xl:px-12">

        <div className="mb-8 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED]/10">
            <MessageCircleQuestion
              size={24}
              className="text-[#A855F7]"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Help & Support
            </h1>

            <p className="mt-1 text-sm text-[#8B95A7]">
              Learn how to monitor machines and use AI diagnosis tools.
            </p>
          </div>
        </div>

        <div className="relative mb-10">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
          />

          <input
            type="text"
            placeholder="Search for help..."
            className="h-14 w-full rounded-xl border border-[#1F2937] bg-[#121620] pl-12 pr-5 text-sm text-white outline-none placeholder:text-[#6B7280] transition focus:border-[#7C3AED]/50"
          />
        </div>

        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">
              Operator Quick Guide
            </h2>

            <p className="mt-1 text-sm text-[#8B95A7]">
              Follow these steps to use the system effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {guides.map((guide, index) => {
              const Icon = guide.icon;

              return (
                <div
                  key={guide.title}
                  className="group min-h-[180px] rounded-2xl border border-[#1F2937] bg-[#121620] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#7C3AED]/40 hover:bg-[#151925]"
                >
                  <div className="mb-6 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED]/10">
                      <Icon
                        size={20}
                        className="text-[#A855F7]"
                      />
                    </div>

                    <span className="text-xs font-bold text-[#4B5563]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

=                  <h3 className="text-base font-bold text-white">
                    {guide.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#8B95A7]">
                    {guide.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

=        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">
              Frequently Asked Questions
            </h2>

            <p className="mt-1 text-sm text-[#8B95A7]">
              Find answers to common questions about the system.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-[#1F2937] bg-[#121620] p-5"
              >
                <h3 className="text-sm font-semibold text-white">
                  {faq.question}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#8B95A7]">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

=        <section>
          <div className="rounded-2xl border border-[#7C3AED]/20 bg-gradient-to-r from-[#7C3AED]/10 to-[#121620] p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED]/10">
                    <ShieldCheck
                      size={20}
                      className="text-[#A855F7]"
                    />
                  </div>

                  <h2 className="text-lg font-bold text-white">
                    Need Further Assistance?
                  </h2>
                </div>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#8B95A7]">
                  If you encounter a system issue or need assistance with
                  machine diagnosis, contact the system administrator or
                  assigned engineer.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button className="flex items-center justify-center gap-2 rounded-xl border border-[#374151] bg-[#0B0E14] px-5 py-3 text-sm font-medium text-white transition hover:border-[#7C3AED]/50 hover:bg-[#7C3AED]/10">
                  <Mail size={17} />
                  Contact Admin
                </button>

                <button className="flex items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6D28D9]">
                  <Phone size={17} />
                  Contact Engineer
                </button>
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
}