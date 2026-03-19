'use client';
import { PlantData } from '#@/lib/types/plantBase';
import { Dispatch, SetStateAction } from 'react';
import { CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Divider,
  Button,
  Stack,
  Paper, } from '@mui/material';
import EditAttributesOutlinedIcon from '@mui/icons-material/EditAttributesOutlined';
import getStatusColor from '#@/lib/utils/getStatusColor';

export default function SpecimenDisplay( {
  data,
  setIsEditing,
}: {
  data        : PlantData;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
} ) {
  // Fallback image in case the imageUrl is null or empty

  return (
    <CardContent
      sx={{
        p     : 4,
        height: '100%',
      }}
    >
      <Box
        sx={{
          display       : 'flex',
          justifyContent: 'space-between',
          alignItems    : 'flex-start',
          mb            : 2,
        }}
      >
        <Box>
          {/* Scientific Name usually looks best italicized */}
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            fontStyle="italic"
          >
            {data.scientificName}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            gutterBottom
          >
            { data.commonNames?.join( ` +
              ` ) || 'No common names known' }
          </Typography>
        </Box>

        {/* Conservation Status Badge */}
        {data.conservationStatus && (
          <Chip
            label={data.conservationStatus}
            color={getStatusColor( data.conservationStatus )}
            variant="filled"
            sx={{
              fontWeight: 'bold',
            }}
          />
        )}
      </Box>

      <Divider
        sx={{
          my: 2,
        }}
      />

      {/* --- TAXONOMIC CLASSIFICATION --- */}
      <Typography
        variant="h6"
        gutterBottom
        fontWeight="medium"
      >
        Taxonomic Classification
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          p : 2,
          mb: 3,
        }}
      >
        <Grid
          container
          spacing={2}
        >
          <Grid
            size={{
              xs: 4,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Family
            </Typography>
            <Typography
              variant="body2"
              fontWeight="medium"
            >
              {data.taxon.family || 'Unknown'}
            </Typography>
          </Grid>
          <Grid
            size={{
              xs: 4,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Genus
            </Typography>
            <Typography
              variant="body2"
              fontWeight="medium"
            >
              {data.taxon.genus}
            </Typography>
          </Grid>
          <Grid
            size={{
              xs: 4,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Species
            </Typography>
            <Typography
              variant="body2"
              fontWeight="medium"
            >
              {data.taxon.species}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* --- ARRAYS (CHIPS) --- */}
      <Stack
        spacing={2}
        sx={{
          mb: 3,
        }}
      >
        {/* Regions */}
        {data.regions && data.regions.length > 0 && (
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
            >
              Found in Regions:
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
            >
              {data.regions.map( (
                region, idx
              ) => {
                return (
                  <Chip
                    key={idx}
                    label={region}
                    size="small"
                    variant="outlined"
                  />
                );
              } )}
            </Stack>
          </Box>
        )}

        {/* Ecosystems */}
        {data.ecosystems && data.ecosystems.length > 0 && (
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
            >
              Ecosystems:
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
            >
              {data.ecosystems.map( (
                eco, idx
              ) => {
                return (
                  <Chip
                    key={idx}
                    label={eco}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                );
              } )}
            </Stack>
          </Box>
        )}
      </Stack>

      {/* --- EXTERNAL LINK --- */}

      <Box
        sx={{
          mt          : 'auto',
          pt          : 2,
          boxShadow   : 1,
          borderRadius: 2,
          p           : 2,
          gap         : 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          href={data.url ?? '/'}
          target="_blank"
          rel="noopener noreferrer"
          fullWidth
        >
          View External Reference
        </Button>
        <Button
          variant="contained"
          fullWidth
          color="secondary"
          onClick={() => {
            setIsEditing( ( edit ) => {
              return !edit;
            } );
          }}
          endIcon={<EditAttributesOutlinedIcon />}
        >
          Editar
        </Button>
      </Box>
    </CardContent>
  );
}
