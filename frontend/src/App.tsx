import { useState } from 'react'
import CredentialComponent from './Components/CredentialComponent.tsx'
import { ListPanel } from './Components/ListPanel.jsx'
import { fetchConnectData } from './Http/http.ts'
import { credentialsObject } from './Types/types.tsx'

import { CredentialsContext } from './Contexts/contexts.tsx'

import "./App.css";


// interface inputCredentialsFormObject: { [k: string]: FormDataEntryValue } {
//   'aws_access_key_id': string,
//   'aws_secret_access_key': string,
//   'bucket_name': string,
//   'region_name': string,
//   'signature_version': string,
// };


function App() {
  const [credentials, setCredentials] = useState<credentialsObject | null>(null);
  const [connecting, setConnecting] = useState<boolean>(false);

  console.log(credentials);
  async function handleConnect(event: React.FormEvent){
    event.preventDefault();

    const inputCredentialsFormObject = new FormData(event.target as HTMLFormElement);
    const inputCredentials: credentialsObject = Object.fromEntries(inputCredentialsFormObject.entries()) as unknown as credentialsObject;
    console.log(inputCredentials);

    setConnecting(true);

    const url = '/api/s3/connect'
    const resData = await fetchConnectData(url, inputCredentials)
    if (resData.error){
      setConnecting(false);
      return
    }
    
    setCredentials(resData)
  
    setConnecting(false);
  }

  const credentialCtxValue = {
    'credentials': credentials
  }

  return (
    <CredentialsContext.Provider value={credentialCtxValue}>
      <div id="container">
        <CredentialComponent connecting={connecting} onConnect={handleConnect}/>

        { credentials?.bucketName && <ListPanel/> }
      </div>
    </CredentialsContext.Provider>
  )
}

export default App