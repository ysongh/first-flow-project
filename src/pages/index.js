import { useRouter } from 'next/router';
import { Container, Center, Heading, Text, Button } from '@chakra-ui/react';

export default function Home({ user }) {
  const router = useRouter();

  return (
    <Container maxW='1200px'>
      <Heading textAlign="center" mt="10">Welcome to Flow Image List App</Heading>
      <Text textAlign="center" fontSize="xl" mt="3">
        Upload images for the world to see
      </Text>
      <Center mt="4">
        { !user.loggedIn
          ? <Button>Connect Wallet</Button>
          : <Button onClick={() => router.push("/image-list")}>
              See Images
            </Button>
        }
      </Center>
    </Container>
  );
}