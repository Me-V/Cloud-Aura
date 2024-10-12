import { OrganizationSwitcher, SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/nextjs';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Button,
  Box,
  Flex
} from '@chakra-ui/react';
import { HiDotsVertical } from 'react-icons/hi';

const Header = () => {
  return (
    <Flex as="header" justify="space-between" align="center" p={2} maxWidth="100%" overflow="hidden">
      {/* Left Side: Smaller Action Button */}
      <Box>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HiDotsVertical size={20} />}
            variant="unstyled"
            color="white"
            size="sm"
            _hover={{}}
            _active={{}}
            style={{ cursor: 'pointer' }}
          />
          <MenuList>
            <MenuItem>All Files</MenuItem>
            <MenuItem>Trash</MenuItem>
            <MenuItem>Favourites</MenuItem>
          </MenuList>
        </Menu>
      </Box>
      
      {/* Right Side: Organization and User Buttons */}
      <Flex align="center" flexShrink={0}>
        <Box mr={2}>
          <OrganizationSwitcher />
        </Box>
        <SignedOut>
          <SignInButton>
            <Button size="sm" colorScheme="blue" variant="solid">Sign In</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <SignOutButton>
            <Button size="sm" colorScheme="red" variant="outline" mr={2}>Sign Out</Button>
          </SignOutButton>
          <UserButton/>
        </SignedIn>
      </Flex>
    </Flex>
  );
}

export default Header;
