export function EnjoyCard() {
  return (
    <div
      className="border-[0.5px] border-olive-300 
            bg-white w-[400px] h-[500px] rounded-2xl scale-[0.9] p-3"
    >
      <div className="relative w-full h-full object-cover overflow-hidden">
        <img
          src="landing1.jpg"
          className=" absolute inset-0
              rounded-2xl w-full h-full object-cover"
        />

        <div
          className="absolute inset-0 bg-gradient-to-t
                from-[#30251F] via-[#30251F]/15 to-transparent"
        />
        <span
          className="tracking-wide uppercase absolute
               top-6 left-6 text-sm text-white"
        >
          fig. 02 / your story
        </span>
        <h4 className="absolute bottom-16 left-6 text-white text-sm">Enjoy!</h4>
        <p className="absolute bottom-6 left-6 text-white/70 text-xs">
          Relax, breathe and enjoy your new skincare routine made specifically
          for your needs
        </p>
      </div>
    </div>
  );
}
