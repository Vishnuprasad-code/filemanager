export interface credentialsObject {
    [key: string]: string
  }


export interface CredentialComponentsProps {
    'onConnect': (event: React.FormEvent) => void
    'connecting': boolean
}


export interface CredentialsContextType {
  'credentials': credentialsObject | null,
  'setMessage': (message: string | null) => void,
}

export interface fileListRowObject {
  'type': "Folder" | "File",
  'fileName': string,
  'sizeInfo': string,
  'displaySize': string,
  'lastModified': string
}

export interface ListPanelContextType {
  'isFetching': boolean,
  'searchPath': string,
  'fileList': fileListRowObject[],
  'onSearch': (directory: string) => void,
}

export interface ListPanelPropsObject {
  'credentials': credentialsObject,
}

export interface FilePathSearchBarPropsObject {
  'searchPath': string,
  'isFetching': boolean,
  'onSearch': (directory: string) => void,
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