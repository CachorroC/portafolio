// app/page.tsx
import SpecimenEditSelection from '#@/components/specimenEditSelection';
import clientPromise from '#@/lib/connection/mongodb';
import { PlantData } from '#@/lib/types/plantBase';
import { promises as fs } from 'fs';
import path from 'path';
import MasonryHolder from './masonryHolder';
import DataGridDemo from '#@/components/specimenDataGrid';

async function getJSONData() {
  // Construct the absolute path to the JSON file
  const filePath = path.join(
    process.cwd(), 'src/lib/json/plantListDB.json'
  );

  // Read the file content
  const fileContents = await fs.readFile(
    filePath, 'utf8'
  );

  // Parse the JSON data into a JavaScript object
  const data = JSON.parse( fileContents );

  return data as PlantData[];
}

async function getDatabaseData (): Promise<PlantData[]> {
  const client = await clientPromise;
  const database = client.db( 'botany_db' ); // Replace with your actual database name
  const specimens = database.collection<PlantData>( 'specimens' );
  const data = await specimens.find( {} )
    .toArray();

  return data.map( ( item ) => {
    return {
      ...item,
      _id: item._id.toString()
    };
  } );

}

export default async function HomePage() {
  const data = await getJSONData();
  const databaseData = await getDatabaseData();

  return (
    <>

      <div>
        <h1>Data from JSON file</h1>
        <MasonryHolder>
          {data.map( (
            plant, index
          ) => {
            return (
              <div key={index}>
                <SpecimenEditSelection plantData={plant} />
              </div>
            );
          } )}
        </MasonryHolder>
        <DataGridDemo rows={ data} />
        <MasonryHolder>
          {databaseData.map( (
            plant, index
          ) => {
            return (
              <div key={index}>
                <SpecimenEditSelection plantData={plant} />
              </div>
            );
          } )}
        </MasonryHolder>
      </div>
    </>
  );
}
