import { createContext } from 'react';
import { CredentialsContextType, ListPanelContextType } from '../Types/types.tsx'


export const CredentialsContext= createContext<CredentialsContextType>({
    'credentials': {}
});


export const ListPanelContext= createContext<ListPanelContextType>({
    'isFetching': false,
    'searchPath': '',
    'fileList': [],
    'onSearch': () => null,
});