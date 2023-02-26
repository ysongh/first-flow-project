import Head from 'next/head'
import "../../flow/config";
import { useState, useEffect } from "react";
import { Container, SimpleGrid, Heading, FormControl, FormLabel, Input, Image, Button } from '@chakra-ui/react';
import * as fcl from "@onflow/fcl";

export default function Home() {

  const [user, setUser] = useState({loggedIn: null})
  const [urls, setURLs] = useState([])
  const [newURL, setNewURL] = useState('')
  const [transactionStatus, setTransactionStatus] = useState(null)

  useEffect(() => fcl.currentUser.subscribe(setUser), [])

  const sendQuery = async () => {
    const result = await fcl.query({
      cadence: `
        import ImageList from 0xDeployer

        pub fun main(): [String] {
          return ImageList.urls
        }
      `,
        args: (arg, t) => []
    })

    setURLs(result)
  }

  const executeTransaction = async () => {
    const transactionId = await fcl.mutate({
      cadence: `
      import ImageList from 0xDeployer

      transaction(newURL: String) {
        prepare(signer: AuthAccount) {
        }
        execute {
          ImageList.addURL(newURL: newURL)
        }
      }
      `,
      args: (arg, t) => [
        arg(newURL, t.String)
      ],
      proposer: fcl.authz,
      payer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 999
    });

    console.log('Transaction Id', transactionId);
  }

  const AuthedState = () => {
    return (
      <div>
        <div>Address: {user?.addr ?? "No Address"}</div>
        <div>Transaction Status: {transactionStatus ?? "--"}</div>
        <Button onClick={sendQuery}>Send Query</Button>
        <Button onClick={fcl.unauthenticate}>Log Out</Button>
        <br />
        <br />
        <FormControl mb='3'>
          <FormLabel htmlFor='URL'>URL</FormLabel>
          <Input value={newURL} onChange={(e) => setNewURL(e.target.value)} />
        </FormControl>
        <Button onClick={executeTransaction}>Execute Transaction</Button>
        <br />
        <br />
        <SimpleGrid minChildWidth='200px' columns={[4]} spacing={10} mb='10'>
          {urls.map((url, index) => (
            <Image key={index} src={url} alt="Image" />
          ))}
        </SimpleGrid>
      </div>
    )
  }

  const UnauthenticatedState = () => {
    return (
      <div>
        <Button onClick={fcl.logIn}>Log In</Button>
        <Button onClick={fcl.signUp}>Sign Up</Button>
      </div>
    )
  }

  return (
    <Container maxW='1100px'>
      <Head>
        <title>FCL Quickstart with NextJS</title>
        <meta name="description" content="My first web3 app on Flow!" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Heading mt="3" mb="5">Flow Image List App</Heading>
      {user.loggedIn
        ? <AuthedState />
        : <UnauthenticatedState />
      }
    </Container>
  )
}