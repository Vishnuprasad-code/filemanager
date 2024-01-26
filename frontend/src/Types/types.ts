export interface credentialsObject {
    'aws_access_key_id': string,
    'aws_secret_access_key': string,
    'bucket_name': string,
    'region_name': string,
    'signature_version': string
  }


export interface CredentialComponentsProps {
    'onConnect': (event: React.FormEvent) => void
    'connecting': boolean
}


export interface ListPanelPropsObject {
  'credentials': credentialsObject,
}

export interface FilePathSearchBarPropsObject {
  'searchPath': string,
  'isFetching': boolean,
  'onSearch': (directory: string) => void,
}


export interface fileListRowObject {
  'type': "Folder" | "File",
  'fileName': string,
  'sizeInfo': string,
  'displaySize': string,
  'lastModified': string
}


export interface FileListingsPropsObject {
  'searchPath': string,
  'isFetching': boolean,
  'bucketName': string,
  'fileList': fileListRowObject[],
  'onSearch': (directory: string) => void,
}

export interface uploadObjectType {
  'isModalOpen': boolean,
  'newFiles': File[]
}

export interface uploadConfirmModalType {
  'uploadObject': uploadObjectType,
  'setUploadObject': ({isModalOpen, newFiles}: uploadObjectType) => void,
  'searchPath': string,
  'onConfirm': (newFiles: File[]) => void,
}