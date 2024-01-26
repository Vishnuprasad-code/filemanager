import { useRef } from 'react'
import { FilePathSearchBarPropsObject } from '../Types/types.tsx'

import "./FilePathSearchBar.css";

export function FilePathSearchBar(
    { searchPath, isFetching, onSearch }: FilePathSearchBarPropsObject
) {
    const searchPathRef = useRef<HTMLInputElement>(null);

    function handleBreadcrumbTraversal(searchPath: string, directoryIndex: number) {
        const newSearchPath = searchPath.split('/').slice(0, directoryIndex + 1).join('/') + '/';
        onSearch(newSearchPath);
    }

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
        {searchPath.replace(/^\/+|\/+$/g, '').split('/').map((directory, directoryIndex) => (
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