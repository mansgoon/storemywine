import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  const textareaRef = React.useRef(null);

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const adjustHeight = () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      };
      
      textarea.addEventListener('input', adjustHeight);
      adjustHeight(); // Initial adjustment

      return () => textarea.removeEventListener('input', adjustHeight);
    }
  }, []);

  return (
    <textarea
      className={cn(
        "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden",
        className
      )}
      ref={(node) => {
        textareaRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      {...props}
    />
  );
})

Textarea.displayName = "Textarea"

export { Textarea }
