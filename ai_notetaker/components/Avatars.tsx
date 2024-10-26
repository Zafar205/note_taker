"use client";

import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function Avatars() {
  const others = useOthers();
  const self = useSelf();
  const all = [self, ...others];
  // console.log(all);

  return (
    <div className="flex gap-2 items-center">
      <p className="font-light text-sm">Users currently editing this page</p>
      <div className="flex -space-x-5">
        {all.map((other, i) => (
            
            <TooltipProvider key={other?.id + i}>
            <Tooltip>
              <TooltipTrigger>
              <Avatar className="border-2 hover:z-50">
                  <AvatarImage
                    src={other?.info.avatar && other.info.avatar.startsWith("http") ? other.info.avatar : undefined}
                    alt={other?.info.name}
                  />
                  <AvatarFallback>{other?.info.name ? other.info.name[0] : "U"}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{self?.id === other?.id ? "You" : other?.info.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

        ))}
      </div>
    </div>
  );
}
export default Avatars;