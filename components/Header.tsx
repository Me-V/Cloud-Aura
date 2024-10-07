import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

const Header = () => {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-800">
            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center justify-center w-10 h-10 bg-black text-white  hover:bg-gray-700 focus:outline-none transition duration-200">
                    Open
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-black rounded-md shadow-lg">
                    <DropdownMenuLabel className="font-semibold p-2">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="hover:bg-gray-200 p-2 transition duration-200"><UserButton/></DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-200 p-2 transition duration-200">Orgs<OrganizationSwitcher/></DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-200 p-2 transition duration-200">Billing</DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-200 p-2 transition duration-200">Team</DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-200 p-2 transition duration-200">Subscription</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            
        </div>
    );
};

export default Header;
