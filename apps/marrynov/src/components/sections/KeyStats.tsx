export function KeyStats() {
  const stats = [
    { value: "12", label: "ans d'expérience" },
    { value: "8", label: "ans en salariat" },
    { value: "6", label: "ans en santé numérique" },
    { value: "1", label: "seul interlocuteur" },
  ];

  return (
    <section className="border-border border-b bg-white py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-primary text-5xl font-bold md:text-6xl">{stat.value}</p>
              <p className="text-body mt-2 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
