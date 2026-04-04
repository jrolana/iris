"use client";

import { useState } from "react";
import { useGenerateToken } from "@/hooks/api-token/useGenerateToken";

import Button from "@/components/ui/button/Button";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clipboard } from "lucide-react";
import { cn } from "@/lib/utils";
import Hint from "@/components/common/Tooltip";
import { toast } from "sonner";

function DeveloperSettings() {
  const [apiToken, setApiToken] = useState("");
  const { generateToken } = useGenerateToken();

  function handleCopytoClipboard() {
    navigator.clipboard
      .writeText(apiToken)
      .then(() => {
        toast.success("API token copied to clipboard!");
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((_) => {
        toast.error("Failed to copy API token");
      });
  }

  function handleGenerateToken() {
    toast.promise(generateToken(), {
      loading: "Generating API token...",
      success: (data) => {
        setApiToken(data);
        return "API token generated successfully!";
      },
      error: "Failed to generate API token",
    });
  }

  return (
    <div className="flex h-full w-full flex-col gap-5">
      <h1 className="text-2xl font-semibold text-gray-800">
        Developer Settings
      </h1>{" "}
      <h2>
        Generate API tokens to allow other developers to access the API. Do not
        share these tokens with anyone else. These tokens do not expire but can
        never be revoked.
      </h2>
      <div className="flex h-full w-full flex-col items-center justify-start p-20">
        <div className="flex w-md flex-col-reverse items-center gap-5">
          <Button
            className="h-10 w-full max-w-xs"
            onClick={handleGenerateToken}
          >
            Generate
          </Button>
          <div className="flex flex-row">
            <Input
              className="h-10 w-xs"
              type="text"
              placeholder="API Token"
              value={apiToken}
              readOnly
            />
            <Hint label="Copy to clipboard">
              <button
                onClick={handleCopytoClipboard}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "text-muted-foreground hover:text-foreground flex h-auto w-auto shrink-0 items-center justify-center p-0 hover:bg-transparent",
                )}
                disabled={apiToken === ""}
              >
                <Clipboard size={20} />
              </button>
            </Hint>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DeveloperSettings;
