// app/page.tsx
import SpecimenForm from '#@/components/specimenForm';
import { PlantData } from '#@/lib/types/plantBase';
import { promises as fs } from 'fs';
import path from 'path';
import Image from 'next/image';

async function getData() {
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

export default async function HomePage() {
  const data = await getData();

  return (
    <div>
      <h1>Data from JSON file</h1>
      {data.map( (
        plant, index
      ) => {
        return (
          <div key={index} style={{
            marginBottom: '40px' 
          }}
          >
            <SpecimenForm initialData={ plant } />
          </div>
        );
      } )}
    </div>
  );
}
