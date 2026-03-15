/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { ObjectId } from 'mongodb'; // Adjust this import path if needed
import { PlantData } from '#@/lib/types/plantBase';
import clientPromise from '#@/lib/connection/mongodb';

export async function upsertSpecimen( data: PlantData ) {
  try {
    // Await the shared connection promise
    const client = await clientPromise;
    const database = client.db( 'botany_db' ); // Replace with your actual database name
    const specimens = database.collection( 'specimens' );

    // Separate the _id from the rest of the data
    const {
      _id, ...updateData
    } = data as any;

    // Query by _id if it exists, otherwise fallback to scientificName
    const query = _id
      ? {
          _id: new ObjectId( _id )
        }
      : {
          scientificName: data.scientificName
        };

    // Upsert the document
    const result = await specimens.findOneAndUpdate(
      query,
      {
        $set: updateData
      },
      {
        returnDocument: 'after', // Returns the updated document
        upsert        : true             // Creates a new document if one isn't found
      }
    );

    if ( !result ) {
      return {
        success: false,
        error  : 'Failed to update or create document.'
      };
    }

    // Convert the MongoDB ObjectId to a string before sending it to the client
    const serializedData = {
      ...result,
      _id: result._id.toString(),
    };

    return {
      success: true,
      data   : serializedData
    };

  } catch ( error ) {
    console.error(
      'Database Error:', error
    );

    return {
      success: false,
      error  : 'An error occurred while saving to the database.'
    };
  }
  // Notice there is no 'finally { await client.close() }' here anymore!
}