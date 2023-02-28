import { useState, useEffect } from "react";
import { ChakraProvider } from '@chakra-ui/react'
import * as fcl from "@onflow/fcl";

import '@/styles/globals.css'
import "../../flow/config";
import Navbar from 'components/Navbar';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState({loggedIn: null})
  const [loading, setLoading] = useState(false)

  useEffect(() => fcl.currentUser.subscribe(setUser), [])

  useEffect(() => {
    setLoading(true);
  }, [])

  return (
    <ChakraProvider>
      {loading && <>
        <Navbar />
        <Component
          user={user}
          {...pageProps} />
      </>}
    </ChakraProvider>
  )
}

export default MyApp