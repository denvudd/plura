"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { Tag as TagType } from "@prisma/client";
import { AlertDialog } from "../ui/alert-dialog";
import { Command } from "../ui/command";
import { Tag } from "../ui/tag";
import { X } from "lucide-react";

interface TagDetailsProps {
  subAccountId: string;
  getSelectedTags: (tags: TagType[]) => void;
  defaultTags?: TagType[];
}

const TAG_COLORS = ["BLUE", "ORANGE", "ROSE", "PURPLE", "GREEN"] as const;
type TagColor = typeof TAG_COLORS;

const TagDetails: React.FC<TagDetailsProps> = ({
  getSelectedTags,
  subAccountId,
  defaultTags,
}) => {
  const router = useRouter();

  const [selectedTags, setSelectedTags] = React.useState<TagType[]>(
    defaultTags || []
  );
  const [tags, setTags] = React.useState<TagType[]>([]);
  const [value, setValue] = React.useState<string>("");
  const [selectedColor, setSelectedColor] = React.useState<string>("");

  React.useEffect(() => {
    getSelectedTags(selectedTags);
  }, [selectedTags]);

  const handleDeleteSelection = (id: string) => {};

  return (
    <AlertDialog>
      <Command className="bg-transparent">
        {!!selectedTags.length && (
          <div className="flex flex-wrap gap-2 p-2 bg-background border-2 border-border rounded-md">
            {selectedTags.map((tag) => (
              <div key={tag.id} className="flex items-center">
                <Tag title={tag.name} colorName={tag.color} />
                <X
                  className="text-muted-foreground cursor-pointer w-4 h-4"
                  onClick={() => handleDeleteSelection(tag.id)}
                />
              </div>
            ))}
          </div>
        )}
      </Command>
    </AlertDialog>
  );
};

export default TagDetails;
