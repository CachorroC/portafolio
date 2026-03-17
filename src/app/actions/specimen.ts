/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { ObjectId } from 'mongodb'; // Adjust this import path if needed
import { promises as fs } from 'fs';
import path from 'path';
import { PlantData } from '#@/lib/types/plantBase';
import clientPromise from '#@/lib/connection/mongodb';

export async function upsertSpecimen( data: PlantData ) {
  try {
    // Await the shared connection promise
    const client = await clientPromise;
    const database = client.db( 'botany_db' ); // Replace with your actual database name
    const specimens = database.collection<PlantData>( 'specimens' );

    // Separate the _id from the rest of the data
    const {
      _id, ...updateData 
    } = data as any;

    // Query by _id if it exists, otherwise fallback to scientificName
    const query = _id
      ? {
          _id: new ObjectId( _id ),
        }
      : {
          scientificName: data.scientificName,
        };

    // Upsert the document
    const result = await specimens.findOneAndUpdate(
      query,
      {
        $set: updateData,
      },
      {
        returnDocument: 'after', // Returns the updated document
        upsert        : true, // Creates a new document if one isn't found
      },
    );

    if ( !result ) {
      return {
        success: false,
        error  : 'Failed to update or create document.',
      };
    }

    // Convert the MongoDB ObjectId to a string before sending it to the client
    const serializedData = {
      ...result,
      _id: result._id.toString(),
    };

    // --- JSON BACKUP SYNC LOGIC ---
    // Construct the absolute path to the JSON file
    const jsonFilePath = path.join(
      process.cwd(),
      'src/lib/json/plantListDB.json',
    );

    // Read and parse the existing JSON file
    const fileContents = await fs.readFile(
      jsonFilePath, 'utf8' 
    );
    const plantList = JSON.parse( fileContents ) as PlantData[];

    // Prepare the data for JSON (excluding the MongoDB _id)
    const {
      _id: _, ...jsonSafeData 
    } = serializedData;

    // Find the index of the plant by its scientific name
    const plantIndex = plantList.findIndex( ( plant ) => {
      return plant.scientificName === jsonSafeData.scientificName;
    } );

    if ( plantIndex !== -1 ) {
      // If it exists in the JSON, merge the updated data
      plantList[ plantIndex ] = {
        ...plantList[ plantIndex ],
        ...jsonSafeData,
      };
    } else {
      // If it's a completely new plant, push it to the array
      plantList.push( jsonSafeData );
    }

    // Write the updated array back to the JSON file
    await fs.writeFile(
      jsonFilePath,
      JSON.stringify(
        plantList, null, 2 
      ),
      'utf8',
    );
    // ------------------------------

    return {
      success: true,
      data   : serializedData,
    };
  } catch ( error ) {
    console.error(
      'Database/File System Error:', error 
    );

    return {
      success: false,
      error:
        'An error occurred while saving to the database or syncing the backup file.',
    };
  }
}
