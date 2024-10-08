import { OrganizationSwitcher, SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/nextjs';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from '@chakra-ui/react';

const Header = () => {
  return (
    <div className="flex justify-between items-center p-4">
      {/* Left Side: Smaller Action Button */}
      <Menu>
        <MenuButton as={Button} size="sm" colorScheme="blue" variant="solid">
          Actions
        </MenuButton>
        <MenuList>
          <MenuItem>All Files</MenuItem>
          <MenuItem>Trash</MenuItem>
          <MenuItem>Favourites</MenuItem>
        </MenuList>
      </Menu>

      {/* Right Side: Organization and User Buttons */}
      <div className="flex items-center space-x-2">
        <OrganizationSwitcher />
        <SignedOut>
          <SignInButton>
            <Button size="sm" colorScheme="blue" variant="solid" className="mr-2">Sign In</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <SignOutButton>
            <Button size="sm" colorScheme="red" variant="outline">Sign Out</Button>
          </SignOutButton>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}

export default Header;
