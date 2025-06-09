"use client"
import { useDropzone } from "react-dropzone";
import * as shapefile from "shapefile";
import { UploadCloud } from "lucide-react"; 
import { Geometry, Feature, FeatureCollection, GeoJsonProperties, Polygon, MultiPolygon } from 'geojson';
import { Notification } from "./Notification";
import JSZip from "jszip";
import * as toGeoJSON from "@tmcw/togeojson";



interface UploadZoneProps {
  onUpload: (coordinates: [number, number][]) => void;
}



const Dropzone: React.FC<UploadZoneProps> = ({ onUpload }) => {

    const extractCoordinates = (geojson: FeatureCollection<Geometry, GeoJsonProperties>): [number, number][] => {
      if (!geojson.features || geojson.features.length === 0) return [];

      if (geojson.features.length > 1){
        Notification("Error","The record must contain only one feature.");
        return [];
      };
      
      return geojson.features
        .filter((feature) : feature is Feature<Polygon | MultiPolygon, GeoJsonProperties> => feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon")
        .flatMap((feature) =>
          feature.geometry.type === "Polygon"
            ? feature.geometry.coordinates.flat() as [number,number][]
            : feature.geometry.coordinates.flat(2) as [number,number][]
        );
    };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const parseShapefileZip = async (file: File): Promise<[number, number][]> => {
    const zip = new JSZip();
    const unzipped = await zip.loadAsync(file);
    const shpFile = Object.keys(unzipped.files).find((name) => name.endsWith(".shp"));
    const dbfFile = Object.keys(unzipped.files).find((name) => name.endsWith(".dbf"));

    if (!shpFile || !dbfFile) throw new Error("Missing .shp or .dbf file in ZIP.");

    const shpBuffer = await unzipped.files[shpFile].async("arraybuffer");
    const dbfBuffer = await unzipped.files[dbfFile].async("arraybuffer");

    const geojson = await shapefile.read(shpBuffer, dbfBuffer);
    return extractCoordinates(geojson);
  };

  const onDrop  = async (acceptedFiles: File[]) => {

    const file = acceptedFiles[0];
    const fileType = file.name.split(".").pop()?.toLowerCase();

    try {
      let coordinates: [number, number][] = [];

      if (fileType === "geojson") {
        const text = await file.text();
        const geojson = JSON.parse(text);
        coordinates = extractCoordinates(geojson);
      } else if (fileType === "kml" || fileType === "kmz") {
        const text = await readFileAsText(file);
        const kml = new DOMParser().parseFromString(text, "text/xml") as unknown as Document;
        const rawGeojson = toGeoJSON.kml(kml);
        const geojson: FeatureCollection<Geometry, GeoJsonProperties> = {
            type: "FeatureCollection",
            features: rawGeojson.features.filter((feature) : feature is Feature<Geometry, GeoJsonProperties> => feature.geometry !== null),
        };
        coordinates = extractCoordinates(geojson);
      } else if (fileType === "zip") {
        coordinates = await parseShapefileZip(file);
      } else {
        Notification("Error","Unsupported file format.");
      }

      if (coordinates.length > 0) {
        onUpload(coordinates);
        return;
      }
    } catch (err) {
      Notification("Error","Error processing file: " + (err as Error).message);
    }

  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div
  {...getRootProps()}
  className="group relative border border-gray-500 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer h-[160px] bg-gray-50 hover:shadow-lg hover:bg-white transition-all duration-300 ease-in-out"
>
  <input {...getInputProps()} />
  <div className="flex flex-col items-center space-y-2">
    <UploadCloud className="w-10 h-10 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
    <div className="text-center">
      <p className="text-gray-600 text-sm font-medium group-hover:text-blue-600">
        Click to upload or drag & drop
      </p>
      <p className="text-gray-400 text-xs">Shapefile(zip), KML, or GeoJSON</p>
    </div>
  </div>
</div>
  );
};


export default Dropzone