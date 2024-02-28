import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { 
  S3CredentialComponent,
  DropBoxCredentialComponent,
  GcloudCredentialComponent,
  AzureCredentialComponent,
 } from '../Components/CredentialComponent.tsx'
import { ListPanel } from '../Components/ListPanel.tsx'
import { NotificationCard } from '../Components/NotificationCard.tsx'

import { fetchConnectData } from '../Http/http.ts'
import { credentialsObject } from '../Types/types.tsx'

import { CredentialsContext } from '../Contexts/contexts.tsx'


export default function MainPage() {
  const params = useParams<string>()
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
    const url = `/api/${params.platform}/connect`
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

  console.log(params.platform);
  let platformToUse;
  if (params.platform === 's3') platformToUse = <S3CredentialComponent connecting={connecting} onConnect={handleConnect}/>
  else if (params.platform === 'dropbox') platformToUse = <DropBoxCredentialComponent connecting={connecting} onConnect={handleConnect}/>
  else if (params.platform === 'gcloud') platformToUse = <GcloudCredentialComponent connecting={connecting} onConnect={handleConnect}/>
  else if (params.platform === 'azure') platformToUse = <AzureCredentialComponent connecting={connecting} onConnect={handleConnect}/>

  return (
    <CredentialsContext.Provider value={credentialCtxValue}>
      {(message) && <NotificationCard message={message} setMessage={setMessage}/>}
      <div className="container">
        { platformToUse }
        { credentials?.platform && <ListPanel/> }
      </div>
    </CredentialsContext.Provider>
  )
}
