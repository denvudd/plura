"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { Tag as TagType } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { PlusCircle, Trash, X } from "lucide-react";

import { deleteTag, getTagsForSubAccount, upsertTag } from "@/queries/tags";
import { saveActivityLogsNotification } from "@/queries/notifications";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { Tag } from "../ui/tag";
import { cn } from "@/lib/utils";

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
    if (subAccountId) {
      const fetchData = async () => {
        const response = await getTagsForSubAccount(subAccountId);
        
        if (response) {
          setTags(response);
        }
      };

      fetchData();
    }
  }, [subAccountId]);

  React.useEffect(() => {
    getSelectedTags(selectedTags);
  }, [selectedTags]);

  const handleDeleteSelection = (tagId: string) => {
    setSelectedTags(() => selectedTags.filter((tag) => tag.id !== tagId));
  };

  // prevent duplicate tags
  const handleAddSelections = (tag: TagType) => {
    if (selectedTags.every((t) => t.id !== tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddTag = async () => {
    if (!value) {
      toast.error("Tags need to have a name");

      return null;
    }
    if (!selectedColor) {
      toast.error("Please select a color");

      return null;
    }

    const tagData: TagType = {
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      color: selectedColor,
      name: value,
      subAccountId,
    };

    setTags([...tags, tagData]);
    setValue("");
    setSelectedColor("");

    try {
      const response = await upsertTag(subAccountId, tagData);

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a tag | ${response?.name}`,
        subAccountId,
      });

      toast.success("Created the tag");
    } catch (error) {
      toast.error("Could not create tag");
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    setTags(tags.filter((tag) => tag.id !== tagId));

    try {
      const response = await deleteTag(tagId);

      toast.success("Deleted tag", {
        description: "The tag is deleted from your subaccount.",
      });

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Deleted a tag | ${response?.name}`,
        subAccountId,
      });

      router.refresh();
    } catch (error) {
      toast.error("Could not delete tag");
    }
  };

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
        <div className="flex items-center gap-2 my-2">
          {TAG_COLORS.map((colorName) => (
            <div
              className={cn("rounded-sm border transition-all", {
                "border-black dark:border-white": colorName === selectedColor,
              })}
              key={colorName}
            >
              <Tag
                key={colorName}
                selectedColor={setSelectedColor}
                className="px-4"
                colorName={colorName}
              />
            </div>
          ))}
        </div>
        <div className="relative">
          <CommandInput
            placeholder="Search for tag..."
            value={value}
            onValueChange={setValue}
          />
          <PlusCircle
            onClick={handleAddTag}
            className="absolute top-1/2 transform -translate-y-1/2 right-2 hover:text-primary transition-all cursor-pointer text-muted-foreground w-5 h-5"
          />
        </div>
        <CommandList>
          <CommandSeparator />
          <CommandEmpty className="text-muted-foreground text-xs py-6 text-center">
            No tags found.
          </CommandEmpty>
          <CommandGroup>
            {tags.map((tag) => (
              <CommandItem
                key={tag.id}
                className="hover:!bg-secondary !bg-transparent flex items-center justify-between !font-light cursor-pointer"
              >
                <div onClick={() => handleAddSelections(tag)}>
                  <Tag title={tag.name} colorName={tag.color} />
                </div>

                <AlertDialogTrigger>
                  <Trash className="cursor-pointer text-muted-foreground hover:text-rose-400 w-4 h-4 transition-all" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-left">
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-left">
                      This action cannot be undone. This will permanently delete
                      your the tag and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="items-center">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive"
                      onClick={() => handleDeleteTag(tag.id)}
                    >
                      Delete Tag
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </AlertDialog>
  );
};

export default TagDetails;
