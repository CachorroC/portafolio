'use client';
import { ReactNode } from 'react';
import Masonry from '@mui/lab/Masonry';
import { useMediaQuery } from '@mui/material';

export default function MasonryHolder( {
  children
}: { children: NonNullable<ReactNode> } ) {

  // Custom media queries to target your specific width requirements
  const isLarge = useMediaQuery( '(min-width:1200px)' );
  const isSmall = useMediaQuery( '(max-width:1099px)' );

  // Determine column count based on the active query.
  // It defaults to 3 for viewports between 1100px and 1199px.
  let columns = 3;

  if ( isLarge ) {
    columns = 4;
  } else if ( isSmall ) {
    columns = 2;
  }

  return (
    <Masonry columns={columns} spacing={2}>
      {children}
    </Masonry>
  );
}