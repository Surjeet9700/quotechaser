 
export function RollText({ text }: { text: string }) {
  return (
    <div className="flex-col overflow-hidden h-[20px] flex">
      <span className="group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] leading-[20px]">
        {text}
      </span>
      <span className="group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] leading-[20px]">
        {text}
      </span>
    </div>
  );
}
