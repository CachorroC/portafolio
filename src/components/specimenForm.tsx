/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, ChangeEvent, Dispatch, SetStateAction } from 'react';
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
import { PlantData, Ecosystem } from '#@/lib/types/plantBase'; // Adjust import as necessary

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

// Added predefined options for Ecosystem
const ecosystemOptions: Ecosystem[] = [
  'Bosque andino',
  'Subpáramo',
  'Páramo'
];

export default function SpecimenForm( {
  initialData,
  setIsEditing,
}: {
  initialData : PlantData;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
} ) {
  const [
    formData,
    setFormData
  ] = useState<PlantData>( initialData );

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

  const handleSubmit = async ( e: React.FormEvent ) => {
    e.preventDefault();

    try {
      const response = await upsertSpecimen( formData );

      if ( response.success && response.data ) {
        setFormData( response.data as any as PlantData );
        console.log(
          'Successfully saved to MongoDB:', response.data 
        );
        setIsEditing( false );
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

        {/* --- STANDARD STRING INPUTS --- */}
        <TextField
          label="Scientific Name"
          name="scientificName"
          variant="outlined"
          value={formData.scientificName}
          onChange={handleInputChange}
          fullWidth
        />

        <TextField
          label="URL (Source/Reference)"
          name="url"
          variant="outlined"
          value={formData.url ?? ''}
          onChange={handleInputChange}
          fullWidth
        />

        <TextField
          label="Image URL"
          name="imageUrl"
          variant="outlined"
          value={formData.imageUrl ?? ''}
          onChange={handleInputChange}
          fullWidth
        />

        {/* --- CONSERVATION STATUS (Dropdown only) --- */}
        <FormControl fullWidth>
          <InputLabel id="conservation-status-select-label">
            Conservation Status
          </InputLabel>
          <Select
            labelId="conservation-status-select-label"
            id="conservationStatus"
            value={formData.conservationStatus ?? ''}
            name="conservationStatus"
            label="Conservation Status"
            onChange={( e ) => {
              const {
                name, value 
              } = e.target;
              setFormData( ( prev ) => {
                return {
                  ...prev,
                  [ name ]: value,
                };
              } );
            }}
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
          <Paper
            elevation={0}
            sx={{
              p      : 2,
              bgcolor: 'background.default',
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="medium"
              color="text.secondary"
              mb={2}
            >
              Taxon Details
            </Typography>
            <Stack spacing={2}>
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
            </Stack>
          </Paper>
        </Box>

        <Divider />

        {/* --- ARRAY INPUTS --- */}

        {/* Ecosystems Array */}
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
            Ecosystems
          </Typography>
          {( formData.ecosystems || [] ).map( (
            ecosystem, index 
          ) => {
            return (
              <Stack
                direction="row"
                spacing={2}
                key={`ecosystem-${ index }`}
              >
                <FormControl
                  fullWidth
                  size="small"
                >
                  <InputLabel>Ecosystem {index + 1}</InputLabel>
                  <Select
                    value={ecosystem}
                    label={`Ecosystem ${ index + 1 }`}
                    onChange={( e ) => {
                      return handleArrayChange(
                        'ecosystems',
                        index,
                        e.target.value,
                      );
                    }}
                  >
                    {ecosystemOptions.map( ( eco ) => {
                      return (
                        <MenuItem
                          key={eco}
                          value={eco}
                        >
                          {eco}
                        </MenuItem>
                      );
                    } )}
                  </Select>
                </FormControl>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    return removeArrayItem(
                      'ecosystems', index 
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
              return addArrayItem( 'ecosystems' );
            }}
            sx={{
              alignSelf: 'flex-start',
            }}
          >
            + Add Ecosystem
          </Button>
        </Box>

        {/* Common Names Array */}
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
          {( formData.commonNames || [] ).map( (
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

        {/* Regions Array */}
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
          {( formData.regions || [] ).map( (
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
