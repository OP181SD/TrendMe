import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useCopy(message: string) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(message);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    },
    [message],
  );

  return { copied, copy };
}
