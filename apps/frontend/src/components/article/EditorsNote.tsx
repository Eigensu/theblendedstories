export default function EditorsNote({ note }: { note: string }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="bg-white/5 border border-white/10 p-6 rounded-lg text-center font-['Montserrat']">
        <h4 className="text-xs tracking-widest text-white/50 uppercase mb-3">Editor's Note</h4>
        <p className="text-sm text-white/80 leading-relaxed italic">
          {note}
        </p>
      </div>
    </div>
  );
}
