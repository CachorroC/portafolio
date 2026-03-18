// app/page.tsx
import SpecimenEditSelection from 'components/specimenEditSelection';
import clientPromise from 'lib/connection/mongodb';
import { PlantData } from 'types/plantBase';
import MasonryHolder from '#@/app/herbs/masonryHolder';
import DataGridDemo from 'components/specimenDataGrid';
import { Suspense } from 'react';
import { Loader } from 'components/Loader/main-loader';
import sleep from 'lib/helpers/sleep';
import { MasonryLoader } from 'components/Loader/client-loaders';

/*
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
 */
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
/*
async function JSONDataMasonryHolder () {
  const data = await getJSONData();
  await sleep( 8000 );

  return (
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
  );
} */

async function DbDataGridDemo() {
  const data = await getDatabaseData();

  await sleep( 5000 );

  return (
    <DataGridDemo rows={ data} />
  );
}

async function DatabaseMasonryHolder () {
  const databaseData = await getDatabaseData();
  await sleep( 1000 );

  return (
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
  );
}

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<Loader/>}><DbDataGridDemo /></Suspense>
      <Suspense fallback={<MasonryLoader />}><DatabaseMasonryHolder /></Suspense>
    </>
  );
}
