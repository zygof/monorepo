type AccordionItem = {
  question: string;
  answer: string;
};

type AccordionProps = {
  items: AccordionItem[];
};

export function Accordion({ items }: AccordionProps) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <details
          key={index}
          className="group bg-bg-white border-border overflow-hidden rounded-xl border"
        >
          <summary className="text-dark-deep hover:bg-bg-light flex w-full cursor-pointer list-none items-center justify-between p-5 font-medium transition-colors">
            <span>{item.question}</span>
            <svg
              className="text-muted h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="px-5 pb-5">
            <p className="text-body leading-relaxed">{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
