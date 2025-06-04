export type LayerType = "point" | "polyline" | "polygon";

export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  symbology: string; // can be URL, color code, or JSON config
}