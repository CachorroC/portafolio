'use client';
import React, { createContext,
  Dispatch,
  SetStateAction,
  useState,
  useContext, } from 'react';

const SnackbarContext = createContext<{
  isSnackbarOpen   : boolean;
  setIsSnackbarOpen: Dispatch<SetStateAction<boolean>>;
} | null>( null );

export function SnackbarProvider( {
  children 
}: { children: React.ReactNode } ) {
  const [
    isSnackbarOpen,
    setIsSnackbarOpen
  ] = useState( false );

  return (
    <SnackbarContext.Provider
      value={{
        isSnackbarOpen,
        setIsSnackbarOpen,
      }}
    >
      {children}
    </SnackbarContext.Provider>
  );
}

export function useSnackbarContext() {
  const context = useContext( SnackbarContext );

  if ( context === null ) {
    throw new Error( 'useSnackbarContext must be used inside a SnackbarProvider', );
  }

  return context;
}
