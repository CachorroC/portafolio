/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, ChangeEvent, Dispatch, SetStateAction, SubmitEventHandler } from 'react';
import { Box, TextField, Button, Typography, Stack, Paper,
  Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { upsertSpecimen } from '#@/app/actions/specimen';
import { PlantData, Ecosystem, Regions, ConservationStatus } from '#@/lib/types/plantBase'; // Adjust import as necessary

// 1. Create a type for our local form array items to hold unique IDs
type FormArrayItem = { id: string; value: string };

// 2. Extend the PlantData type for our local state so TypeScript doesn't yell at us
type FormState = Omit<PlantData, 'ecosystems' | 'regions' | 'commonNames'> & {
  ecosystems : FormArrayItem[];
  regions    : FormArrayItem[];
  commonNames: FormArrayItem[];
};

type ArrayKeys = 'ecosystems' | 'regions' | 'commonNames';

const conservationStatusOptions: ConservationStatus[] = [
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

const ecosystemOptions: Ecosystem[] =  [
  'Páramo',
  'Superpáramo',
  'Subpáramo',
  'High Andean Forest',
  'Andean Cloud Forest',
  'Sub-Andean Forest',
  'Tropical Rainforest',
  'Tropical Dry Forest',
  'Xerophytic Scrub',
  'Desert',
  'Seasonal Savanna',
  'Flooded Savanna',
  'Gallery Forest',
  'Alluvial Forest',
  'Mangrove',
  'Coral Reef',
  'Seagrass Meadow',
  'Coastal Lagoon',
  'Estuary',
  'Sandy Beach',
  'Rocky Shore',
  'Pelagic Zone',
  'Abyssal Zone',
  'Lentic Water System',
  'Lotic Water System',
  'Peatland',
  'Insular Ecosystem'
];

const regionOptions: Regions[] = [
  'Amazonas',
  'Antioquia',
  'Arauca',
  'Atlántico',
  'Bolívar',
  'Boyacá',
  'Caldas',
  'Caquetá',
  'Casanare',
  'Cauca',
  'Cesar',
  'Chocó',
  'Córdoba',
  'Cundinamarca',
  'Guainía',
  'Guaviare',
  'Huila',
  'La Guajira',
  'Magdalena',
  'Meta',
  'Nariño',
  'Norte de Santander',
  'Putumayo',
  'Quindío',
  'Risaralda',
  'San Andrés y Providencia',
  'Santander',
  'Sucre',
  'Tolima',
  'Valle del Cauca',
  'Vaupés',
  'Vichada'
];


export default function SpecimenForm( {
  initialData,
  setIsEditing,
}: {
  initialData : PlantData;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
} ) {

  // 3. Initialize state by mapping standard strings into our new { id, value } objects
  const [
    formData,
    setFormData
  ] = useState<FormState>( () => {
    return {
      ...initialData,
      ecosystems: ( initialData.ecosystems || [] ).map( e => {
        return {
          id   : crypto.randomUUID(),
          value: e
        };
      } ),
      commonNames: ( initialData.commonNames || [] ).map( c => {
        return {
          id   : crypto.randomUUID(),
          value: c
        };
      } ),
      regions: ( initialData.regions || [] ).map( r => {
        return {
          id   : crypto.randomUUID(),
          value: r
        };
      } ),
    };
  } );

  const handleInputChange = ( e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
    const {
      name, value
    } = e.target;
    setFormData( ( prev ) => {
      return {
        ...prev,
        [ name ]: value
      };
    } );
  };

  const handleTaxonChange = ( e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
    const {
      name, value
    } = e.target;
    setFormData( ( prev ) => {
      return {
        ...prev,
        taxon: {
          ...prev.taxon,
          [ name ]: value
        },
      };
    } );
  };

  // 4. Update array handlers to use the unique ID instead of the index
  const handleArrayChange = (
    arrayName: ArrayKeys, id: string, newValue: string
  ) => {
    setFormData( ( prev ) => {
      return {
        ...prev,
        [ arrayName ]: prev[ arrayName ].map( ( item ) => {
          return item.id === id
            ? {
                ...item,
                value: newValue
              }
            : item;
        } ),
      };
    } );
  };

  const addArrayItem = ( arrayName: ArrayKeys ) => {
    setFormData( ( prev ) => {
      return {
        ...prev,
        [ arrayName ]: [
          ...prev[ arrayName ],
          {
            id   : crypto.randomUUID(),
            value: ''
          } // Generate a fresh ID for new items
        ],
      };
    } );
  };

  const removeArrayItem = (
    arrayName: ArrayKeys, id: string
  ) => {
    setFormData( ( prev ) => {
      return {
        ...prev,
        [ arrayName ]: prev[ arrayName ].filter( ( item ) => {
          return item.id !== id;
        } ),
      };
    } );
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async ( e ) => {
    e.preventDefault();

    // Flatten the objects back into standard strings
    const payloadToSave: PlantData = {
      ...formData,
      ecosystems: formData.ecosystems.map( item => {
        return item.value as Ecosystem;
      } ),
      commonNames: formData.commonNames.map( item => {
        return item.value;
      } )
        .filter( val => {
          return val.trim() !== '';
        } ),
      regions: formData.regions.map( item => {
        return item.value as Regions;
      } )
        .filter( val => {
          return val.trim() !== '';
        } ),
    };

    try {
      const response = await upsertSpecimen( {
        data: payloadToSave
      } );

      // Treat as success if it's a perfect success OR if DB succeeded but JSON failed
      if ( response.success || ( response.data && response.failed === 'file' ) ) {
        const savedData = response.data as any as PlantData;

        // Update local UI state
        setFormData( {
          ...savedData,
          ecosystems: ( savedData.ecosystems || [] ).map( ecosystem => {
            return {
              id   : crypto.randomUUID(),
              value: ecosystem
            };
          } ),
          commonNames: ( savedData.commonNames || [] ).map( ccommonName => {
            return {
              id   : crypto.randomUUID(),
              value: ccommonName
            };
          } ),
          regions: ( savedData.regions || [] ).map( region => {
            return {
              id   : crypto.randomUUID(),
              value: region
            };
          } ),
        } );

        console.log(
          'Successfully saved to MongoDB:', savedData
        );

        // Log a soft warning if the file backup failed, but still close the form
        if ( response.failed === 'file' ) {
          console.warn(
            'Note: Database updated, but JSON backup failed:', response.errors?.file
          );
        }


      } else {
      // Total failure or Database failure
        console.error(
          'Failed to save. Point of failure:', response.failed
        );
        console.error(
          'Error details:', response.errors
        );
      }
    } catch ( error ) {
      console.error(
        'Network or server error:', error
      );
    }

    setIsEditing( false );
  };

  return (
    <Paper elevation={3} sx={{
      maxWidth: 600,
      mx      : 'auto',
      mt      : 4,
      p       : 4
    }}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{
        display      : 'flex',
        flexDirection: 'column',
        gap          : 3
      }}
      >
        <Typography variant="h5" component="h2" fontWeight="bold">Edit Specimen</Typography>

        <TextField label="Scientific Name" name="scientificName" variant="outlined" value={formData.scientificName} onChange={handleInputChange} fullWidth />
        <TextField label="URL (Source/Reference)" name="url" variant="outlined" value={formData.url ?? ''} onChange={handleInputChange} fullWidth />
        <TextField label="Image URL" name="imageUrl" variant="outlined" value={formData.imageUrl ?? ''} onChange={handleInputChange} fullWidth />

        <FormControl fullWidth>
          <InputLabel id="conservation-status-select-label">Conservation Status</InputLabel>
          <Select
            labelId="conservation-status-select-label"
            id="conservationStatus"
            value={formData.conservationStatus ?? ''}
            name="conservationStatus"
            label="Conservation Status"
            onChange={( e ) => {
              return setFormData( ( prev ) => {
                return {
                  ...prev,
                  [ e.target.name ]: e.target.value
                };
              } );
            }}
          >
            {conservationStatusOptions.map( ( status ) => {
              return (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              );
            } )}
          </Select>
        </FormControl>

        <Divider />

        <Box sx={{
          display      : 'flex',
          flexDirection: 'column',
          gap          : 2
        }}
        >
          <Paper elevation={0} sx={{
            p      : 2,
            bgcolor: 'background.default'
          }}
          >
            <Typography variant="subtitle1" fontWeight="medium" color="text.secondary" mb={2}>Taxon Details</Typography>
            <Stack spacing={2}>
              <TextField label="Family" name="family" variant="outlined" value={formData.taxon.family ?? ''} onChange={handleTaxonChange} fullWidth />
              <TextField label="Genus" name="genus" variant="outlined" value={formData.taxon.genus ?? ''} onChange={handleTaxonChange} fullWidth />
              <TextField label="Species" name="species" variant="outlined" value={formData.taxon.species ?? ''} onChange={handleTaxonChange} fullWidth />
            </Stack>
          </Paper>
        </Box>

        <Divider />

        {/* --- Ecosystems Array --- */}
        <Box sx={{
          display      : 'flex',
          flexDirection: 'column',
          gap          : 2
        }}
        >
          <Typography variant="subtitle1" fontWeight="medium" color="text.secondary">Ecosystems</Typography>
          {formData.ecosystems.map( (
            ecosystemObj, index
          ) => {
            return (
              <Stack direction="row" spacing={2} key={ecosystemObj.id}> {/* Changed key to ID */}
                <FormControl fullWidth size="small">
                  <InputLabel>Ecosystem {index + 1}</InputLabel>
                  <Select
                    value={ecosystemObj.value}
                    label={`Ecosystem ${ index + 1 }`}
                    onChange={( e ) => {
                      return handleArrayChange(
                        'ecosystems', ecosystemObj.id, e.target.value
                      );
                    }}
                  >
                    {ecosystemOptions.map( ( eco ) => {
                      return (
                        <MenuItem key={eco} value={eco}>{eco}</MenuItem>
                      );
                    } )}
                  </Select>
                </FormControl>
                <Button
                  type="button" // Fix applied
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    return removeArrayItem(
                      'ecosystems', ecosystemObj.id
                    );
                  }}
                >
                  Remove
                </Button>
              </Stack>
            );
          } )}
          <Button type="button" variant="text" onClick={() => {
            return addArrayItem( 'ecosystems' );
          }} sx={{
            alignSelf: 'flex-start'
          }}
          >
            + Add Ecosystem
          </Button>
        </Box>

        {/* --- Common Names Array --- */}
        <Box sx={{
          display      : 'flex',
          flexDirection: 'column',
          gap          : 2
        }}
        >
          <Typography variant="subtitle1" fontWeight="medium" color="text.secondary">Common Names</Typography>
          {formData.commonNames.map( (
            nameObj, index
          ) => {
            return (
              <Stack direction="row" spacing={2} key={nameObj.id}>
                <TextField
                  fullWidth
                  size="small"
                  label={`Common Name ${ index + 1 }`}
                  value={nameObj.value}
                  onChange={( e ) => {
                    return handleArrayChange(
                      'commonNames', nameObj.id, e.target.value
                    );
                  }}
                />
                <Button
                  type="button" // Fix applied
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    return removeArrayItem(
                      'commonNames', nameObj.id
                    );
                  }}
                >
                  Remove
                </Button>
              </Stack>
            );
          } )}
          <Button type="button" variant="text" onClick={() => {
            return addArrayItem( 'commonNames' );
          }} sx={{
            alignSelf: 'flex-start'
          }}
          >
            + Add Common Name
          </Button>
        </Box>

        {/* --- Regions Array --- */}
        <Box sx={{
          display      : 'flex',
          flexDirection: 'column',
          gap          : 2
        }}
        >
          <Typography variant="subtitle1" fontWeight="medium" color="text.secondary">Regions</Typography>
          {formData.regions.map( (
            regionObj, index
          ) => {
            return (
              <Stack direction="row" spacing={ 2 } key={ regionObj.id }>
                <FormControl fullWidth size="small">
                  <InputLabel>Region {index + 1}</InputLabel>
                  <Select
                    value={regionObj.value}
                    label={`Region ${ index + 1 }`}
                    onChange={( e ) => {
                      return handleArrayChange(
                        'regions', regionObj.id, e.target.value
                      );
                    }}
                  >
                    {regionOptions.map( ( region ) => {
                      return (
                        <MenuItem key={region} value={region}>{region}</MenuItem>
                      );
                    } )}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  size="small"
                  label={`Region ${ index + 1 }`}
                  value={regionObj.value}
                  onChange={( e ) => {
                    return handleArrayChange(
                      'regions', regionObj.id, e.target.value
                    );
                  }}
                />
                <Button
                  type="button" // Fix applied
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    return removeArrayItem(
                      'regions', regionObj.id
                    );
                  }}
                >
                  Remove
                </Button>
              </Stack>
            );
          } )}
          <Button
            variant="text" type="button"  onClick={ () => {
              return addArrayItem( 'regions' );
            }} sx={{
              alignSelf: 'flex-start'
            }}
          >
            + Add Region
          </Button>
        </Box>

        <Box sx={{
          mt: 2
        }}
        >
          {/* Main submit button remains untouched */}
          <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
            Save Changes
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}