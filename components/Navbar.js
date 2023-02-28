import NextLink from 'next/link';
import { Container, Box, Flex, Heading, Spacer, Button, Link } from '@chakra-ui/react';
import * as fcl from "@onflow/fcl";

function Navbar({ user }) {
  return (
    <Box p={2}>
      <Container maxW='1200px'>
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
          {!user?.loggedIn
            ? <>
              <Button onClick={fcl.logIn}>Log In</Button>
              <Button onClick={fcl.signUp}>Sign Up</Button>
            </>
            : <>
              <div>{user?.addr ?? "No Address"}</div>
              <Button onClick={fcl.unauthenticate}>Log Out</Button>
            </>
          }
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar;