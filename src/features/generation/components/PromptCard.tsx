import { Check, Copy, RefreshCw } from "lucide-react";
import { ShinyText } from "@/components/reactbits";
import { Button } from "@/components/ui/button";
import { Message, MessageAction, MessageActions, MessageContent } from "@/components/ui/message";

export function RegenLoading() {
  return (
    <div className="py-16 text-center">
      <ShinyText text="Nouvelle version en cours…" className="text-lg" />
    </div>
  );
}

interface Props {
  prompt: string;
  regen: boolean;
  copied: boolean;
  onCopy: () => void;
  onRegenerate: () => void;
}

export function PromptCard({ prompt, regen, copied, onCopy, onRegenerate }: Props) {
  return (
    <Message className="mt-2 block">
      <div className="rounded-[2rem] border border-dashed bg-card p-6">
        {regen ? (
          <RegenLoading />
        ) : (
          <MessageContent
            markdown
            className="max-w-none bg-transparent p-0 text-[15px] leading-relaxed [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-5 [&_h3]:mb-1.5 [&_h3]:font-bold [&_h3]:text-primary [&_li]:ml-4 [&_li]:list-disc [&_p]:my-2 [&_strong]:text-foreground"
          >
            {prompt}
          </MessageContent>
        )}
        <MessageActions className="mt-6 border-t border-dashed pt-5">
          <MessageAction tooltip="Copier le prompt">
            <Button onClick={onCopy} className="rounded-full">
              {copied ? <Check /> : <Copy />} {copied ? "Copié" : "Copier"}
            </Button>
          </MessageAction>
          <MessageAction tooltip="Générer une autre version">
            <Button
              variant="secondary"
              onClick={onRegenerate}
              disabled={regen}
              className="rounded-full"
            >
              <RefreshCw className={regen ? "animate-spin" : ""} /> Régénérer
            </Button>
          </MessageAction>
        </MessageActions>
      </div>
    </Message>
  );
}
