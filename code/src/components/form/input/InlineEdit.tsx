import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { SquarePen, CheckSquare, XSquare } from "lucide-react";

interface PropsInterface {
  value: string;
  onSave: (newValue: string) => Promise<void> | void;
  className?: string;
}

export function InlineEdit(props: PropsInterface) {
  const { value, onSave, className } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  // Keep draft in sync if value changes externally
  useEffect(() => {
    if (!isEditing) {
      setDraft(value);
    }
  }, [value, isEditing]);

  const handleEdit = () => {
    setDraft(value);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(value);
    setIsEditing(false);
  };

  const handleSave = async () => {
    await onSave(draft);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className={className}
        />
        <button onClick={handleSave}>
          <CheckSquare size={20} />
        </button>
        <button onClick={handleCancel}>
          <XSquare size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className={className}>{value}</span>
      <button onClick={handleEdit}>
        <SquarePen size={20} />
      </button>
    </div>
  );
}
