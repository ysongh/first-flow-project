import NextLink from 'next/link';
import { Box, Flex, Heading, Spacer, Link } from '@chakra-ui/react';

function Navbar() {
  return (
    <Box p={2}>
      <Flex minWidth='max-content' alignItems='center' gap='2'>
        <Box mr="4">
          <NextLink href='/' passHref >
            <Heading color="blue" mt="3" mb="5">Flow Image List App</Heading>
          </NextLink>
        </Box>
        <NextLink href='/' passHref>
          <Link>Home</Link>
        </NextLink>
        <Spacer />
      </Flex>
    </Box>
  )
}

export default Navbar;