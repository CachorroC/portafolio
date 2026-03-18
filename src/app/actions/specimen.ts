/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { ObjectId } from 'mongodb'; // Adjust this import path if needed
import { promises as fs } from 'fs';
import path from 'path';
import { PlantData } from '#@/lib/types/plantBase';
import clientPromise from '#@/lib/connection/mongodb';

async function upsertSpecimenToDB( {
  data
}: { data: PlantData; } ) {
  try {
    const client = await clientPromise;
    const database = client.db( 'botany_db' );
    const specimens = database.collection<PlantData>( 'specimens' );

    const {
      _id, ...updateData
    } = data as any;

    const query = _id
      ? {
          _id: new ObjectId( _id )
        }
      : {
          scientificName: data.scientificName
        };

    const result = await specimens.findOneAndUpdate(
      query,
      {
        $set: updateData
      },
      {
        returnDocument: 'after',
        upsert        : true
      }
    );

    if ( !result ) {
      throw new Error( 'Failed to update or create document in MongoDB.' );
    }

    return {
      success: true,
      data   : {
        ...result,
        _id: result._id.toString(),
      },
    };
  } catch ( error ) {
    console.error(
      'Database Error:', error
    );

    return {
      success: false,
      error  : error instanceof Error
        ? error.message
        : 'Unknown database error',
    };
  }
}

async function upsertSpecimenToJSON( {
  data
}:{data: PlantData} ) {
  try {
    console.log( process.cwd() );
    const jsonFilePath = path.join(
      process.cwd(), 'src/lib/json/plantListDB.json'
    );
    const fileContents = await fs.readFile(
      jsonFilePath, 'utf8'
    );
    const plantList = JSON.parse( fileContents ) as PlantData[];

    // Strip out _id if it was passed in the raw data, just like the original logic
    const {
      _id: _, ...jsonSafeData
    } = data as any;

    const plantIndex = plantList.findIndex( ( plant ) => {
      return plant.scientificName === jsonSafeData.scientificName;
    } );

    if ( plantIndex !== -1 ) {
      plantList[ plantIndex ] = {
        ...plantList[ plantIndex ],
        ...jsonSafeData,
      };
    } else {
      plantList.push( jsonSafeData );
    }

    await fs.writeFile(
      jsonFilePath,
      JSON.stringify(
        plantList, null, 2
      ),
      'utf8'
    );

    return {
      success: true,
      data   : data
    };
  } catch ( error ) {
    console.error(
      'File System Error:', error
    );

    return {
      success: false,
      error  : error instanceof Error
        ? error.message
        : 'Unknown file system error',
    };
  }
}

export async function upsertSpecimen( {
  data
}:{data: PlantData } ) {// Execute both operations concurrently.
  // Because they internally catch their own errors, Promise.all won't short-circuit.
  const [
    dbResult,
    fileResult
  ] = await Promise.all( [
    upsertSpecimenToDB( {
      data
    } ),
    upsertSpecimenToJSON( {
      data
    } ),
  ] );

  // Case 1: Perfect Success
  if ( dbResult.success && fileResult.success ) {
    return {
      success: true,
      data   : dbResult.data,
      failed : 'none',
    };
  }

  // Case 2: Partial or Total Failure
  let failed: 'database' | 'file' | 'both' = 'both';

  if ( dbResult.success && !fileResult.success ) {
    failed = 'file';
  } else if ( !dbResult.success && fileResult.success ) {
    failed = 'database';
  }

  // Construct detailed error message
  const errors = {
    ...( dbResult.error && {
      db: dbResult.error
    } ),
    ...( fileResult.error && {
      file: fileResult.error
    } ),
  };

  return {
    success: false,     // Explicitly marking as not successful per your requirements
    failed,             // Tells you exactly which one(s) failed
    errors,             // Contains the specific error strings for debugging
    data   : dbResult.success
      ? dbResult.data
      : undefined, // Still passes db data if it succeeded
  };
}
