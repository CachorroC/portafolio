'use client';
import { ReactNode } from 'react';
import Masonry from '@mui/lab/Masonry';

export default function MasonryHolder ( {
  children
}: { children: NonNullable<ReactNode> } ) {
  return (
    <Masonry columns={3} spacing={2}>
      {children}
    </Masonry>
  );
}