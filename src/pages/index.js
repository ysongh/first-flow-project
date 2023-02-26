import Head from 'next/head'
import "../../flow/config";
import { useState, useEffect } from "react";
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
        <div>Profile Name: {name ?? "--"}</div>
        <div>Transaction Status: {transactionStatus ?? "--"}</div>
        <button onClick={sendQuery}>Send Query</button>
        <button onClick={fcl.unauthenticate}>Log Out</button>
        <br />
        <br />
        <input placeholder='New Name' value={newURL} onChange={(e) => setNewURL(e.target.value)} />
        <br />
        <button onClick={executeTransaction}>Execute Transaction</button>
        <br />
        <br />
        {urls.map((url, index) => (
          <img key={index} src={url} alt="Image" width={200} />
        ))}
      </div>
    )
  }

  const UnauthenticatedState = () => {
    return (
      <div>
        <button onClick={fcl.logIn}>Log In</button>
        <button onClick={fcl.signUp}>Sign Up</button>
      </div>
    )
  }

  return (
    <div>
      <Head>
        <title>FCL Quickstart with NextJS</title>
        <meta name="description" content="My first web3 app on Flow!" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <h1>Flow Image List App</h1>
      {user.loggedIn
        ? <AuthedState />
        : <UnauthenticatedState />
      }
    </div>
  )
}