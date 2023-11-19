'use client'
import { CredentialType, IDKitWidget } from '@worldcoin/idkit'
import axios from 'axios'

interface Signer {
  _address: string
}

let address: string | null = null

const onSuccess = async (response: any) => {
  console.log({ response })
}

const handleVerify = async (response: any) => {
  await axios.post('/api/worldcoin-verify', { ...response, address })
}

export default function WorldcoinButton() {
  return (
    <>
      <div>
        <IDKitWidget
          app_id='app_11672e7b663a451927dc18ca4ed4929e' // obtained from the Developer Portal
          action='vote_1' // this is your action name from the Developer Portal
          onSuccess={onSuccess} // callback when the modal is closed
          handleVerify={handleVerify} // optional callback when the proof is received
          credential_types={[CredentialType.Orb, CredentialType.Phone]} // optional, defaults to ['orb']
          enableTelemetry // optional, defaults to false
        >
          {({ open }) => <button onClick={open}>World ID</button>}
        </IDKitWidget>
      </div>
    </>
  )
}
