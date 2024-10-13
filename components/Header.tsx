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
    <Flex as="header" justify="space-between" bg="black" align="center" p={2} maxHeight={80} maxWidth="100%" overflow="hidden">
      {/* Left Side: Smaller Action Button */}
      <Box>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HiDotsVertical size={30} />}
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
            <MenuItem><SignOutButton>
              <Button size="sm" colorScheme="red" variant="outline" mr={2}>Sign Out</Button>
            </SignOutButton></MenuItem>
          </MenuList>
        </Menu>
      </Box>
      
       

      {/* Right Side: Organization and User Buttons */}
      <Flex align="center" flexShrink={0}>
        <Box mr={2}>
          <div className="bg-white rounded-md mr-3 p-2"><OrganizationSwitcher/></div>
        </Box>
        <SignedOut>
          <SignInButton>
            <Button size="sm" colorScheme="blue" variant="solid">Sign In</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton appearance={{
              elements: {
                avatarBox: {
                  width: '40px',
                  height: '40px'
                }
              }
            }} />
        </SignedIn>
      </Flex>
    </Flex>
  );
}

export default Header;
