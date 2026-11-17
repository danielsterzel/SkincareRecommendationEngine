export function MyDiary() {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-secondary">
        Use this space to describe all the recent information about your skin
      </p>
      <textarea
        className="outline-none focus-none border border-tertiary rounded-2xl 
                    resize-none p-2 w-full  text-xs text-secondary"
      />
    </div>
  );
}
