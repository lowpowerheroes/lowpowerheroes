// components/ui/tags-input.tsx
import * as React from "react";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "~/lib/utils";

type TagsInputProps = {
  value: string[];
  onChange: (newTags: string[]) => void;
  placeholder?: string;
  className?: string;
};

export const TagsInput: React.FC<TagsInputProps> = ({
  value,
  onChange,
  placeholder = "Type and press comma or Enter",
  className,
}) => {
  const [inputValue, setInputValue] = React.useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (e.key === "Enter" || e.key === "," || e.key === " ") &&
      inputValue.trim()
    ) {
      e.preventDefault();
      const newTag = inputValue.trim().replace(/,$/, "");
      if (newTag !== "" && !value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInputValue("");
    }

    // Optional: backspace cancella l'ultimo tag se l'input è vuoto
    if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div
      className={cn(
        "flex min-h-[2.5rem] w-full flex-wrap items-center gap-1 rounded-md border border-input px-3 py-2 text-sm shadow-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className,
      )}
    >
      {value.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="flex items-center gap-1 px-2 py-1"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="ml-1 hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 border-none p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};
