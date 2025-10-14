const partners = [
  { name: "hexa", color: "#3B82F6" },
  { name: "atica", color: "#1E293B" },
  { name: "ideaa", color: "#F59E0B" },
  { name: "amara", color: "#10B981" },
  { name: "circle", color: "#3B82F6" },
  { name: "liva", color: "#6366F1" },
  { name: "ASGARDIA", color: "#1E293B" },
  { name: "FOX HUB", color: "#3B82F6" },
];

const PartnersMarquee = () => {
  return (
    <section className="py-12 bg-accent overflow-hidden">
      <div className="relative flex">
        {/* First set of logos */}
        <div className="flex animate-marquee space-x-16 px-8">
          {partners.map((partner, index) => (
            <div
              key={`first-${index}`}
              className="flex-shrink-0 flex items-center justify-center"
            >
              <span
                className="text-2xl font-bold whitespace-nowrap"
                style={{ color: partner.color }}
              >
                {partner.name}
              </span>
            </div>
          ))}
        </div>

        {/* Duplicate set for seamless loop */}
        <div className="flex animate-marquee space-x-16 px-8" aria-hidden="true">
          {partners.map((partner, index) => (
            <div
              key={`second-${index}`}
              className="flex-shrink-0 flex items-center justify-center"
            >
              <span
                className="text-2xl font-bold whitespace-nowrap"
                style={{ color: partner.color }}
              >
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersMarquee;
