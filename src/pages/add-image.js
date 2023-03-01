import { useState } from "react";
import { useRouter } from 'next/router';
import { Container, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import * as fcl from "@onflow/fcl";

import "../../flow/config";

export default function AddImage() {
  const router = useRouter();

  const [newURL, setNewURL] = useState('')

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
    router.push("/image-list")
  }

  return (
    <Container maxW='1200px'>
      <FormControl mb='3'>
        <FormLabel htmlFor='URL'>URL</FormLabel>
        <Input value={newURL} onChange={(e) => setNewURL(e.target.value)} />
      </FormControl>

      <Button onClick={executeTransaction}>Add</Button>
    </Container>
  )
}