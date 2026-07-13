export default function ArticleQuote({ quote }: { quote: string }) {
  return (
    <div className="max-w-4xl mx-auto px-10 py-16 text-center border-y border-white/20 my-12">
      <h3 className="font-['Bodoni_Moda'] text-3xl md:text-5xl italic text-white/90 leading-tight">
        "{quote}"
      </h3>
    </div>
  );
}
