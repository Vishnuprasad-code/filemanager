import { credentialsObject } from '../Types/types.ts'


export async function fetchConnectData(
    url: string, inputCredentials: credentialsObject
){
    const requestOptions = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputCredentials),
    }

    const response = await fetch(url, requestOptions);
    const resData = await response.json();
    if (!response.ok) {
        return {
          'error': resData.message
        }
    }
  
    return resData.data;
}

export async function fetchFilePaths(
    url:string, bucketName: string, prefix: string | null
){
    const requestOptions = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            bucketName,
            prefix
        }),
    }

    const response = await fetch(url, requestOptions);
    const resData = await response.json();
    if (!response.ok) {
      return {
        'error': JSON.stringify(resData.message)
      }
    }
  
    return resData.data;
}


export async function fetchDownloadresponse(
    url: string, bucketName: string, objectName: string
){
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
    },
        body: JSON.stringify({
            bucketName,
            objectName
        }),
    }

    const response = await fetch(url, requestOptions);
    const resData = await response.json();
    if (!response.ok) {
        return {
          'error': resData.message
        }
      }
  
    return resData.data;
}


export async function fetchUploadresponse(formData: FormData) {
    const requestOptions = {
      method: 'POST',
      body: formData
    }
  
    console.log(requestOptions);
    const response = await fetch('/api/s3/upload', requestOptions);
    const resData = await response.json();
    if (!response.ok) {
        return {
          'error': resData.message
        }
      }

    return resData.data;
}