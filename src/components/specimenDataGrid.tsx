'use client';
import { PlantData } from '#@/lib/types/plantBase';
import getStatusColor from '#@/lib/utils/getStatusColor';
import { Avatar, Chip, Link } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

export const plantColumns: GridColDef<PlantData>[] = [
  // 1. Image: Rendered as a small Avatar thumbnail
  {
    field     : 'imageUrl',
    headerName: 'Image',
    width     : 80,
    sortable  : false,
    filterable: false,
    renderCell: ( params ) => {
      if ( !params.value ) {
        return null;
      }

      return (
        <Avatar
          src={params.value}
          alt="Plant"
          variant="rounded"
          sx={{
            width : 40,
            height: 40,
            mt    : 0.5
          }}
        />
      );
    },
  },

  // 2. Scientific Name: Standard text
  {
    field     : 'scientificName',
    headerName: 'Scientific Name',
    width     : 200,
  },

  // 3. Common Names: Array joined into a single string for easy copying/reading
  {
    field      : 'commonNames',
    headerName : 'Common Names',
    width      : 250,
    valueGetter: (
      value, row
    ) => {
      if ( !row.commonNames || !Array.isArray( row.commonNames ) ) {
        return '';
      }

      return row.commonNames.join( ', ' );
    },
  },

  // 4. Conservation Status: Rendered as a Chip
  {
    field     : 'conservationStatus',
    headerName: 'Conservation Status',
    width     : 180,
    renderCell: ( params ) => {
      if ( !params.value ) {
        return null;
      }

      return <Chip label={params.value} color={getStatusColor( params.value )} size="small" variant="outlined" />;
    }
  },

  // 5. Ecosystems: Array rendered as multiple Chips
  {
    field     : 'ecosystems',
    headerName: 'Ecosystems',
    width     : 220,
    renderCell: ( params ) => {
      if ( !params.value || !Array.isArray( params.value ) ) {
        return null;
      }

      return (
        <Box sx={{
          display   : 'flex',
          gap       : 0.5,
          flexWrap  : 'wrap',
          alignItems: 'center',
          height    : '100%'
        }}
        >
          {params.value.map( (
            eco, index
          ) => {
            return (
              <Chip key={index} label={eco} size="small"   />
            );
          } )}
        </Box>
      );
    },
  },

  // 6. Regions: Array rendered as multiple Chips
  {
    field     : 'regions',
    headerName: 'Regions',
    width     : 200,
    renderCell: ( params ) => {
      if ( !params.value || !Array.isArray( params.value ) ) {
        return null;
      }

      return (
        <Box sx={{
          display   : 'flex',
          gap       : 0.5,
          flexWrap  : 'wrap',
          alignItems: 'center',
          height    : '100%'
        }}
        >
          {params.value.map( (
            region, index
          ) => {
            return (
              <Chip key={index} label={region} size="small" />
            );
          } )}
        </Box>
      );
    },
  },

  // 7. Taxon (Nested Object): Extracted and formatted into a single string
  {
    field      : 'taxon',
    headerName : 'Taxon (Fam / Gen / Sp)',
    width      : 250,
    valueGetter: ( value ) => {
      if ( !value ) {
        return '';
      }

      const {
        family, genus, species
      } = value;

      // Filters out nulls (like if family is missing) and joins them cleanly
      return [
        family,
        genus,
        species
      ].filter( Boolean )
        .join( ' / ' );
    },
  },

  // 8. URL: Rendered as a clickable external link
  {
    field     : 'url',
    headerName: 'More Info',
    width     : 100,
    sortable  : false,
    renderCell: ( params ) => {
      if ( !params.value ) {
        return null;
      }

      return (
        <Link href={params.value} target="_blank" rel="noopener noreferrer">
          View
        </Link>
      );
    },
  },
];

export default function DataGridDemo( {
  rows
}: { rows: PlantData[] } ) {


  return (
    <Box sx={{
      height: 400,
      width : '100%'
    }}
    >
      <DataGrid
        rows={rows}
        columns={ plantColumns }
        getRowId={( row ) => {
          return row.scientificName;
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 20,
            },
          },
        }}
        pageSizeOptions={[
          5
        ]}
        checkboxSelection
        disableRowSelectionOnClick
        getRowHeight={() => {
          return 'auto';
        }} // Important if chips wrap to a second line
      />
    </Box>
  );
}