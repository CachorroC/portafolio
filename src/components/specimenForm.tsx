/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { PlantData } from '#@/lib/types/plantBase';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Box,
  TextField,
  Button,
  Typography,
  Stack,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem, } from '@mui/material';
import { upsertSpecimen } from '#@/app/actions/specimen';

type ArrayKeys = 'ecosystems' | 'regions' | 'commonNames';

const conservationStatusOptions = [
  'Vulnerable (VU)',
  'Near Threatened (NT)',
  'Least Concern (LC)',
  'Not Evaluated (NE)',
  'Endangered (EN)',
  'Extinct (EX)',
  'Extinct in the Wild (EW)',
  'Critically Endangered (CR)',
  'Data Deficient (DD)',
];

export default function SpecimenForm( {
  initialData,
}: {
  initialData: PlantData;
} ) {
  const [
    formData,
    setFormData
  ] = useState<PlantData>( initialData );

  // MUI TextFields trigger a ChangeEvent on input or textarea elements
  const handleInputChange = ( e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ) => {
    const {
      name, value
    } = e.target;
    setFormData( ( prev ) => {
      return {
        ...prev,
        [ name ]: value,
      };
    } );
  };

  const handleTaxonChange = ( e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ) => {
    const {
      name, value
    } = e.target;
    setFormData( ( prev ) => {
      return {
        ...prev,
        taxon: {
          ...prev.taxon,
          [ name ]: value,
        },
      };
    } );
  };

  const handleArrayChange = (
    arrayName: ArrayKeys,
    index: number,
    value: string,
  ) => {
    setFormData( ( prev ) => {
      const currentArray = prev[ arrayName ] || [];
      const updatedArray = [
        ...currentArray
      ];
      updatedArray[ index ] = value;

      return {
        ...prev,
        [ arrayName ]: updatedArray,
      };
    } );
  };

  const addArrayItem = ( arrayName: ArrayKeys ) => {
    setFormData( ( prev ) => {
      const currentArray = prev[ arrayName ] || [];

      return {
        ...prev,
        [ arrayName ]: [
          ...currentArray,
          ''
        ],
      };
    } );
  };

  const removeArrayItem = (
    arrayName: ArrayKeys, index: number
  ) => {
    setFormData( ( prev ) => {
      const currentArray = prev[ arrayName ] || [];

      return {
        ...prev,
        [ arrayName ]: currentArray.filter( (
          _, i
        ) => {
          return i !== index;
        } ),
      };
    } );
  };

  const handleSubmit = async ( e ) => {
    e.preventDefault();

    try {
      // Call the server action directly
      const response = await upsertSpecimen( formData );

      if ( response.success && response.data ) {
        // Update the form state with the exact data returned from MongoDB
        // This ensures your UI is perfectly in sync with the database (including the new _id)
        setFormData( response.data as any as PlantData );

        console.log(
          'Successfully saved to MongoDB:', response.data
        );
        // You might want to add a toast notification here!
      } else {
        console.error(
          'Failed to save:', response.error
        );
      }
    } catch ( error ) {
      console.error(
        'Network or server error:', error
      );
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 600,
        mx      : 'auto',
        mt      : 4,
        p       : 4,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display      : 'flex',
          flexDirection: 'column',
          gap          : 3,
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
        >
          Edit Specimen
        </Typography>

        {/* --- STANDARD STRING INPUT --- */}
        <TextField
          label="Scientific Name"
          name="scientificName"
          variant="outlined"
          value={formData.scientificName}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Conservation Status"
          name="conservationStatus"
          variant="outlined"
          value={formData.conservationStatus ?? ''}
          onChange={handleInputChange}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel id="conservation-status-select-label">Age</InputLabel>
          <Select
            labelId="conservation-status-select-label"
            id="conservationStatus"
            value={ formData.conservationStatus ?? '' }
            name="conservationStatus" // <-- Add this right here!
            label="Conservation Status" // <-- Changed from "Age"
            onChange={ ( e ) => {
              const {
                name, value
              } = e.target;

              return setFormData( ( prev ) => {
                return {
                  ...prev,
                  [ name ]: value,
                };
              } );
            } }
          >
            {conservationStatusOptions.map( ( status ) => {
              return (
                <MenuItem
                  key={status}
                  value={status}
                >
                  {status}
                </MenuItem>
              );
            } )}
          </Select>
        </FormControl>

        <Divider />

        {/* --- NESTED OBJECT INPUT --- */}
        <Box
          sx={{
            display      : 'flex',
            flexDirection: 'column',
            gap          : 2,
          }}
        >
          <Paper elevation={1}>
            <Typography
              variant="subtitle1"
              fontWeight="medium"
              color="text.secondary"
            >
              Taxon Details
            </Typography>
            <TextField
              label="Family"
              name="family"
              variant="outlined"
              value={formData.taxon.family ?? ''}
              onChange={handleTaxonChange}
              fullWidth
            />
            <TextField
              label="Genus"
              name="genus"
              variant="outlined"
              value={formData.taxon.genus ?? ''}
              onChange={handleTaxonChange}
              fullWidth
            />
            <TextField
              label="Species"
              name="species"
              variant="outlined"
              value={formData.taxon.species ?? ''}
              onChange={handleTaxonChange}
              fullWidth
            />
          </Paper>
        </Box>

        <Divider />

        {/* --- ARRAY INPUTS --- */}
        <Box
          sx={{
            display      : 'flex',
            flexDirection: 'column',
            gap          : 2,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="medium"
            color="text.secondary"
          >
            Common Names
          </Typography>
          {formData.commonNames.map( (
            name, index
          ) => {
            return (
              <Stack
                direction="row"
                spacing={2}
                key={`commonName-${ index }`}
              >
                <TextField
                  fullWidth
                  size="small"
                  label={`Common Name ${ index + 1 }`}
                  value={name}
                  onChange={( e ) => {
                    return handleArrayChange(
                      'commonNames',
                      index,
                      e.target.value,
                    );
                  }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    return removeArrayItem(
                      'commonNames', index
                    );
                  }}
                >
                  Remove
                </Button>
              </Stack>
            );
          } )}
          <Button
            variant="text"
            onClick={() => {
              return addArrayItem( 'commonNames' );
            }}
            sx={{
              alignSelf: 'flex-start',
            }}
          >
            + Add Common Name
          </Button>
        </Box>

        <Box
          sx={{
            display      : 'flex',
            flexDirection: 'column',
            gap          : 2,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="medium"
            color="text.secondary"
          >
            Regions
          </Typography>
          {formData.regions?.map( (
            region, index
          ) => {
            return (
              <Stack
                direction="row"
                spacing={2}
                key={`region-${ index }`}
              >
                <TextField
                  fullWidth
                  size="small"
                  label={`Region ${ index + 1 }`}
                  value={region}
                  onChange={( e ) => {
                    return handleArrayChange(
                      'regions', index, e.target.value
                    );
                  }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    return removeArrayItem(
                      'regions', index
                    );
                  }}
                >
                  Remove
                </Button>
              </Stack>
            );
          } )}
          <Button
            variant="text"
            onClick={() => {
              return addArrayItem( 'regions' );
            }}
            sx={{
              alignSelf: 'flex-start',
            }}
          >
            + Add Region
          </Button>
        </Box>

        <Box
          sx={{
            mt: 2,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
