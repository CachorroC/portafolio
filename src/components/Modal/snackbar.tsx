'use client';
import { useEffect } from 'react';
import styles from './styles.module.css';
import { useSnackbarContext } from '#@/app/context/snackbar-context';

export function Snackbar( {
  text,
  duration = 3000, // Defaults to 3 seconds if not provided
}: {
  text     : string;
  duration?: number;
} ) {
  const {
    isSnackbarOpen, setIsSnackbarOpen 
  } = useSnackbarContext();

  useEffect(
    () => {
    // Declare the timer variable at the top scope of the effect
      let timer: ReturnType<typeof setTimeout>;

      // Only set the timer if the snackbar is actually open
      if ( isSnackbarOpen ) {
        timer = setTimeout(
          () => {
            setIsSnackbarOpen( false );
          }, duration 
        );
      }

      // We ALWAYS return a cleanup function, satisfying ESLint's consistent-return rule.
      return () => {
        if ( timer ) {
          clearTimeout( timer );
        }
      };
    }, [
      isSnackbarOpen,
      setIsSnackbarOpen,
      duration
    ] 
  );

  return (
    <>
      {isSnackbarOpen && (
        <div className={`${ styles.snackbar } ${ styles.show }`}>{text}</div>
      )}
    </>
  );
}
