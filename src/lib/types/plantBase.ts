export type ConservationStatus =
  | 'Vulnerable (VU)'
  | 'Near Threatened (NT)'
  | 'Least Concern (LC)'
  | 'Not Evaluated (NE)'
  | 'Endangered (EN)'
  | 'Extinct (EX)'
  | 'Extinct in the Wild (EW)'
  | 'Critically Endangered (CR)'
  | 'Data Deficient (DD)';

export type Ecosystem = 'Bosque andino' | 'Subpáramo' | 'Páramo';

export interface Taxon {
  family : null | string;
  genus  : string;
  species: string;
}

// To parse this data:
//
//   import { Convert } from "./file";
//
//   const plantData = Convert.toPlantData(json);

export interface PlantData {
  conservationStatus: ConservationStatus | null;
  ecosystems        : Ecosystem[] | null;
  url               : string | null;
  imageUrl          : null | string;
  regions           : null | string[];
  scientificName    : string;
  taxon             : Taxon;
  commonNames       : string[];
}

// Converts JSON strings to/from your types
export class Convert {
  public static toPlantData( json: string ): PlantData {
    return JSON.parse( json );
  }

  public static plantDataToJson( value: PlantData ): string {
    return JSON.stringify( value );
  }

  public static toTaxon( json: string ): Taxon {
    return JSON.parse( json );
  }

  public static taxonToJson( value: Taxon ): string {
    return JSON.stringify( value );
  }
}
