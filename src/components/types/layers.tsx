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
  coordinates:  [[number, number][]] ; // array of LinearRings
}

export type Geometry = PointGeometry | LineStringGeometry | PolygonGeometry;



export interface LayerGeom {
  id: string;
  name: string;
  type: LayerType;
  symbology: string; // can be URL, color code, or JSON config
  geometry?: Geometry
}


export interface Layer {
  id?: string;
  geometry_type: string;
  name: string;
  description?: string;
  srid?: number;
  created_at?: string | undefined;
  updated_at?: string | undefined;
  fill_color?: string;
  stroke_color?: string;
  stroke_width?: number;
  marker_size?: number;
  geometry? :PolygonGeometry | null
}
