'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {LogOut} from "lucide-react";
import {signOut} from "@/lib/actions/auth.actions";

interface UserType {
    name?: string;
    email?: string;
}

const UserDropdown = ({ user,  }: {user: UserType}) => {
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push("/sign-in");
    }

    return (
        <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button
      variant="ghost"
      className="flex items-center gap-3 hover:bg-zinc-800 px-3 py-2 rounded-xl"
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src="  " />
        <AvatarFallback className="bg-emerald-500 text-black font-bold">
          {user.name?.[0] || "U"}
        </AvatarFallback>
      </Avatar>

      <span className="hidden md:block text-sm font-medium text-zinc-200">
        {user.name}
      </span>
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent
    align="end"
    className="w-64 bg-[#141414] border border-zinc-800 text-zinc-200 rounded-xl shadow-xl p-2"
  >
    {/* User Info */}
    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0f0f0f]">
      <Avatar className="h-10 w-10">
        <AvatarImage src="" />
        <AvatarFallback className="bg-emerald-500 text-black font-bold">
          {user.name?.[0] || "U"}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <span className="text-sm font-semibold text-white">
          {user.name}
        </span>
        <span className="text-xs text-zinc-400">
          {user.email}
        </span>
      </div>
    </div>

    <DropdownMenuSeparator className="bg-zinc-800 my-2" />

    {/* Logout */}
    <DropdownMenuItem
      onClick={handleSignOut}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-800 cursor-pointer text-sm"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
    )
}
export default UserDropdown