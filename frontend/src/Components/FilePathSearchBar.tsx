import { useRef } from 'react'
import { useContext } from 'react';

import { ListPanelContext } from '../Contexts/contexts.tsx'
import { ListPanelContextType } from '../Types/types.tsx'

import "./FilePathSearchBar.css";

export function FilePathSearchBar() {
    const { searchPath, isFetching, onSearch } = useContext<ListPanelContextType>(ListPanelContext);
    const searchPathRef = useRef<HTMLInputElement>(null);

    function handleBreadcrumbTraversal(searchPath: string, directoryIndex: number) {
        const newSearchPath = searchPath.replace(/^\/+|\/+$/g, '').split('/').slice(0, directoryIndex + 1).join('/') + '/';
        onSearch(newSearchPath);
    }

    console.log('searchPath');
    console.log(searchPath);
    return (
        <>
        <div className="search-bar">
            <img src="search-in-folder-svgrepo-com.svg" alt="" className="root-folder-image" />
            <input
                ref={searchPathRef}
                className="search-bar-input"
                type="text"
                name="searh_path"
            />
            <button
                className="search-go-btn"
                disabled={isFetching}
                onClick={() => onSearch(searchPathRef.current!.value)}>
                    Search
            </button>
      </div>
      <div className="breadcrumb-bar">
        <img src="icons8-folder.svg" alt="" className="root-folder-image"/>
        <span 
            className='directory-span'
            onClick={() => onSearch('')}
        >
            &nbsp;<strong>/</strong>&nbsp;
        </span>
        {searchPath.replace(/^\/+|\/+$/g, '') && searchPath.replace(/^\/+|\/+$/g, '').split('/').map((directory, directoryIndex) => (
            <span
                className='directory-span'
                key={directoryIndex}
                onClick={() => handleBreadcrumbTraversal(searchPath, directoryIndex)}
            >
                {directory}&nbsp;<strong>/</strong>&nbsp;
            </span>
        ))}
      </div>
      </>
    )
}