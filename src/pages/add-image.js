import { useState } from "react";
import { useRouter } from 'next/router';
import { Container, FormControl, FormLabel, Image, Button } from '@chakra-ui/react';
import * as fcl from "@onflow/fcl";
import axios from "axios"

import "../../flow/config";

export default function AddImage() {
  const router = useRouter();

  const [photo, setPhoto] = useState(null)

  const handleUpload = async (event) => {
    const image = event.target.files[0];
    console.log(image);
    setPhoto(image);
  }

  const executeTransaction = async () => {
    let data = new FormData()
    data.append('file', photo)
    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
      maxContentLength: "Infinity",
      headers: {
        "Content-Type": 'multipart/form-data',
        pinata_api_key: process.env.NEXT_PUBLIC_PINATA_APIKEY, 
        pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRETAPIKEY,
      }
    })

    let url = "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash
    console.log(url)
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
        arg(url, t.String)
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
        <FormLabel htmlFor='description'>Choose Photo</FormLabel>
        <input type='file' id='photo' onChange={handleUpload}/>
      </FormControl>

      {photo && <Image src={URL.createObjectURL(photo)} alt="Upload Image" /> }

      <Button onClick={executeTransaction}>Add</Button>
    </Container>
  )
}