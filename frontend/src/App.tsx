import { useState } from 'react'

import { 
  S3CredentialComponent,
  DropBoxCredentialComponent
 } from './Components/CredentialComponent.tsx'
import { ListPanel } from './Components/ListPanel.tsx'
import { NotificationCard } from './Components/NotificationCard.tsx'

import { fetchConnectData } from './Http/http.ts'
import { credentialsObject } from './Types/types.tsx'

import { CredentialsContext } from './Contexts/contexts.tsx'

import "./App.css";


function App() {
  const [credentials, setCredentials] = useState<credentialsObject | null>(null);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  console.log(credentials);
  async function handleConnect(event: React.FormEvent){
    event.preventDefault();

    const inputCredentialsFormObject = new FormData(event.target as HTMLFormElement);
    const inputCredentials: credentialsObject = Object.fromEntries(
      inputCredentialsFormObject.entries()
      ) as unknown as credentialsObject;
    console.log(inputCredentials);

    setConnecting(true);

    // const url = '/api/s3/connect'
    const url = '/api/dropbox/connect'
    const resData = await fetchConnectData(url, inputCredentials)
    if (resData.error){
      setMessage(resData.error);
      setConnecting(false);
      return
    }
    
    setCredentials(resData)
  
    setConnecting(false);
  }

  const credentialCtxValue = {
    'credentials': credentials,
    'setMessage': setMessage,
  }

  return (
    <CredentialsContext.Provider value={credentialCtxValue}>
      {(message) && <NotificationCard message={message} setMessage={setMessage}/>}
      <div id="container">
        {/* <S3CredentialComponent connecting={connecting} onConnect={handleConnect}/> */}
        <DropBoxCredentialComponent connecting={connecting} onConnect={handleConnect}/>

        { credentials?.platform && <ListPanel/> }
      </div>
    </CredentialsContext.Provider>
  )
}

export default App