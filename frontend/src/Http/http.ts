import { credentialsObject } from '../Types/types.ts'


export async function fetchConnectData(
    url: string, inputCredentials: credentialsObject
){
    const requestOptions = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          inputCredentials
        ),
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
  credentials: credentialsObject, searchPath: string | null
){
  const {url, ...requestObject} = prepareFetchFilePathsRequestObject(
    credentials,
    searchPath
  )
  console.log('fetchFilePaths', url, requestObject)

  const requestOptions = {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestObject),
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


function prepareFetchFilePathsRequestObject(
  credentials: credentialsObject,
  searchPath: string | null
): { [key: string]: string; } {

  const url = `/api/${credentials!.platform}/list`;
  if (
    ['s3', 'gcloud'].includes(credentials!.platform)
    ) {
      return {
          url,
          bucketName: credentials!.bucketName,
          prefix: searchPath || '',
      }
  }
  else if (credentials!.platform === 'dropbox') {
      return {
          url,
          prefix: searchPath || '',
      }
  }
  else if (credentials!.platform === 'azure') {
    return {
        url,
        containerName: credentials!.containerName,
        prefix: searchPath || '',
    }
  }

  return {
      url,
      bucketName: credentials!.bucketName,
      prefix: searchPath || '',
  }
}


export async function fetchDownloadresponse(
    credentials: credentialsObject, objectName: string
){
  const {url, ...requestObject} = prepareFetchDownloadresponseRequestObject(
    credentials,
    objectName
  )
  
  console.log(fetchDownloadresponse, url, requestObject)
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
    },
        body: JSON.stringify(requestObject),
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


function prepareFetchDownloadresponseRequestObject(
  credentials: credentialsObject,
  objectName: string
): { [key: string]: string; } {

  const url = `/api/${credentials!.platform}/download`;
  if (
    ['s3', 'gcloud'].includes(credentials!.platform)
    ) {
      return {
          url,
          bucketName: credentials!.bucketName,
          objectName,
      }
  }
  else if (credentials!.platform === 'dropbox') {
      return {
        url,
        objectName,
      }
  }
  else if (credentials!.platform === 'azure') {
    return {
      url,
      containerName: credentials!.containerName,
      objectName,
    }
  }

  return {
    url,
    bucketName: credentials!.bucketName,
    objectName,
  }
}


export async function fetchUploadresponse(
  credentials: credentialsObject,
  fileObject: File,
  uploadPath: string
) {

  const { url, formData} = prepareFetchUploadresponseRequestObject(
    credentials,
    fileObject,
    uploadPath,
  )
  const requestOptions = {
    method: 'POST',
    body: formData
  }

  console.log(requestOptions);
  const response = await fetch(url, requestOptions);
  const resData = await response.json();
  if (!response.ok) {
      return {
        'error': resData.message
      }
    }

  return resData.data;
}


function prepareFetchUploadresponseRequestObject(
  credentials: credentialsObject,
  fileObject: File,
  uploadPath: string,
) {

  const url = `/api/${credentials!.platform}/upload`;

  const formData = new FormData();
  formData.append("fileToUpload", fileObject);
  formData.append('uploadPath', uploadPath.replace(/^\/+|\/+$/g, ''));

  if (
    ['s3', 'gcloud'].includes(credentials!.platform)
    ) {
      formData.append('bucketName', credentials!.bucketName);
      return {
          url,
          bucketName: credentials!.bucketName,
          formData,
      }
  }
  else if (credentials!.platform === 'dropbox') {
      return {
        url,
        formData,
      }
  }
  else if (credentials!.platform === 'azure') {
    formData.append('containerName', credentials!.containerName);
    return {
      url,
      formData,
    }
  }

  return {
    url,
    bucketName: credentials!.bucketName,
    formData,
  }
}
