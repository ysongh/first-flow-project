import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { Container, SimpleGrid, Image, Button } from '@chakra-ui/react';
import * as fcl from "@onflow/fcl";

import "../../flow/config";

export default function ImageList() {
  const router = useRouter();

  const [urls, setURLs] = useState([])

  useEffect(() => {
    sendQuery()
  }, [])
  
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

  return (
    <Container maxW='1200px'>
      <Button onClick={() => router.push("/add-image")} mb="5">
        Add Image
      </Button>
      <SimpleGrid minChildWidth='200px' columns={[4]} spacing={10} mb='10'>
        {urls.map((url, index) => (
          <Image key={index} src={url} alt="Image" />
        ))}
      </SimpleGrid>
    </Container>
  )
}