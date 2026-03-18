' use client';

import Masonry from '@mui/lab/Masonry';
import { Container, Skeleton } from '@mui/material';

export function MasonryLoader() {
  return (
    <Container maxWidth="lg" sx={{
      mt: 2
    }}
    >
      <Masonry columns={3} spacing={2} >
        {[
          ...Array( 9 )
        ].map( (
          _, index
        ) => {
          return (
            <Skeleton
              key={index}
              variant="rectangular"
              height={100} // Dynamic height for masonry effect
              sx={{
                borderRadius: 1
              }}
            />
          );
        } )}
      </Masonry>
    </Container>
  );
}