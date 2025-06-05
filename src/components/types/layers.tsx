export type LayerType = "Point" | "LineString" | "Polygon";

export interface PointGeometry {
  type: "Point";
  coordinates: [number, number];
}

export interface LineStringGeometry {
  type: "LineString";
  coordinates: [number, number][];
}

export interface PolygonGeometry {
  type: "Polygon";
  coordinates: [ [number, number][] ]; // array of LinearRings
}

export type Geometry = PointGeometry | LineStringGeometry | PolygonGeometry;



export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  symbology: string; // can be URL, color code, or JSON config
  geometry?: Geometry
}