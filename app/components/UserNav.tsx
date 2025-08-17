import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";

interface iAppProps {
    email: string;
    name: string;
    userImage: string | undefined;
}

export function UserNav({email, name, userImage}: iAppProps)
{
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="bg-gray-100 h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={userImage} alt="User Image"/>
                        <AvatarFallback>{name.slice(0, 3)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 border-none" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{name}</p>
                        <p className="text-xs leading-none text-gray-500">rishabhk1324@gmail.com</p>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-gray-100" />

                <DropdownMenuGroup>
                    <DropdownMenuItem><Link href="/sell">Sell your product</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href='/settings'>Settings</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href='/my-products'>My Products</Link></DropdownMenuItem>
                    <DropdownMenuItem>Test Item</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-gray-100"/>
                <DropdownMenuItem asChild>
                    <LogoutLink>Log Out</LogoutLink>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}