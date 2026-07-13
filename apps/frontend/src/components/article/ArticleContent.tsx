export default function ArticleContent({ content }: { content: string[] }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-white/90 font-['Montserrat'] text-lg leading-relaxed">
      {content.map((paragraph, idx) => (
        <p key={idx} className="mb-8">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
