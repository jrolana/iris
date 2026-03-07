import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import Badge from "../../ui/badge/Badge";
import Button from "../../ui/button/Button";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({
  tags,
  onChange,
  placeholder = "Add tags...",
}: TagInputProps) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const newTag = input.trim();
    if (newTag && !tags.includes(newTag)) {
      onChange([...tags, newTag]);
      setInput("");
    }
  };

  const handleRemove = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="bg-white"
        />
        <Button
          onClick={handleAdd}
          size="sm"
          className="h-10 w-10 shrink-0 p-0"
        >
          <Plus size={18} />
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex min-h-10 flex-wrap gap-1.5 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-1.5">
          {tags.map((tag) => (
            <Badge key={tag} variant="neutral" size="sm">
              {tag}
              <button
                className="focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                onClick={() => handleRemove(tag)}
              >
                <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
