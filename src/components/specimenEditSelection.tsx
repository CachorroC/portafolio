'use client';
import { PlantData } from '#@/lib/types/plantBase';
import { useState } from 'react';
import SpecimenForm from './specimenForm';
import SpecimenDisplay from './specimenDisplay';
import { Button, Card, CardMedia, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function SpecimenEditSelection( {
  plantData,
}: {
  plantData: PlantData;
} ) {
  const [
    isEditing,
    setIsEditing
  ] = useState( false );
  const defaultImage
    = 'https://via.placeholder.com/400x300?text=No+Image+Available';

  return (
    <Card
      sx={{
        maxWidth     : 900,
        mx           : 'auto',
        mt           : 4,
        boxShadow    : 3,
        borderRadius : 2,
        // 1. Define this card as a container so internal elements can measure it
        containerType: 'inline-size',
        containerName: 'specimenCard',
      }}
    >
      <Box
        sx={{
          display                                     : 'flex',
          // 2. Default to stacked (mobile-first / narrow container)
          flexDirection                               : 'column',
          // 3. If the container itself is 400px or wider, switch to side-by-side
          '@container specimenCard (min-width: 800px)': {
            flexDirection: 'row',
          },
        }}
      >
        {/* --- LEFT COLUMN: IMAGE --- */}
        <Box
          sx={{
            // Stacked width
            width                                       : '100%',
            '@container specimenCard (min-width: 800px)': {
              // Side-by-side width (roughly equivalent to Grid size 5)
              width: '41.66%',
            },
          }}
        >
          <CardMedia
            component="img"
            sx={{
              // Default stacked height
              height                                      : 300,
              objectFit                                   : 'cover',
              '@container specimenCard (min-width: 400px)': {
                // Stretch full height when side-by-side
                height: '100%',
              },
            }}
            image={plantData.imageUrl || defaultImage}
            alt={plantData.scientificName}
          />
        </Box>

        {/* --- RIGHT COLUMN: DATA --- */}
        <
          
          sx={{
            // Stacked width
            width                                       : '100%',
            display                                     : 'flex',
            flexDirection                               : 'column',
            '@container specimenCard (min-width: 800px)': {
              // Side-by-side width (roughly equivalent to Grid size 7)
              width: '58.33%',
            },
          }}
        >
          {isEditing
            ? (
                <SpecimenForm
                  initialData={plantData}
                  setIsEditing={setIsEditing}
                />
              )
            : (
                <SpecimenDisplay
                  data={plantData}
                  setIsEditing={setIsEditing}
                />
              )}

          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setIsEditing( ( edit ) => {
                return !edit;
              } );
            }}
            endIcon={<SendIcon />}
            sx={{
              m        : 2,
              alignSelf: 'flex-start'
            }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Card>
  );
}