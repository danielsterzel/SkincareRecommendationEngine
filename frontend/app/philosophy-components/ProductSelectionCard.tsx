export function ProductSelectionCard() {
  return (
    <div
      className="border-[0.5px] border-olive-300 
                 bg-white w-[400px] h-[500px] rounded-2xl scale-[1.05] p-3 flex 
                 gap-2 items-center justify-center overflow-hidden text-xs"
    >
      
      <div
        className="absolute inset-0 bg-gradient-to-t
                from-[#30251F] via-[#30251F]/15 to-transparent"
      />
      <h4 className="absolute bottom-16 left-6 text-white text-sm">
        Product selection
      </h4>
      <p className="absolute bottom-6 left-6 text-white/70 text-xs">
        Aurelia picks out all the products that help you achieve your skin goal
        and to ensure your skin&apos;s healthiness
      </p>
    </div>
  );
}
