export function Aurelia({className}: {className?: string}) {
  return (
    <div
      className={`
    text-primary
    cursor-default uppercase tracking-[0.3rem] font-medium text-2xl p-2 ${className}`}
    >
      Aurelia
    </div>
  );
}
