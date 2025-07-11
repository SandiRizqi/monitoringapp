// src/components/widget/LayerDownload.tsx
import { Download } from 'lucide-react';
import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Layer } from '../types/layers';
import shpwrite from "@mapbox/shp-write";
// import JSZip from 'jszip';
import { useSession } from 'next-auth/react';
import { BACKEND_URL } from '@/components/conts';

interface LayerDownloadModalProps {
    isOpen: boolean;
    onClose: () => void;
    layer: Layer | null;
}

const LayerDownloadModal: React.FC<LayerDownloadModalProps> = ({ isOpen, onClose, layer }) => {
    const [fileName, setFileName] = useState("");
    const [format, setFormat] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();

    const convertGeoJSONtoKML = (geojson: GeoJSON.FeatureCollection): string => {
        const header = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>`;

        const footer = `  </Document>
</kml>`;

        const placemarks = geojson.features.map((feature, index) => {
            if (!feature.geometry) return "";

            let coordinates = "";
            if (feature.geometry.type === "Polygon") {
                coordinates = (feature.geometry.coordinates as number[][][])[0]
                    .map((coord) => coord.join(","))
                    .join(" ");
            }

            return `    <Placemark>
      <name>${feature.properties?.name || `Feature ${index + 1}`}</name>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>${coordinates}</coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>`;
        });

        return header + placemarks.join("\n") + footer;
    };

    const downloadBlob = (url: string, format: string) => {
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const fetchLayerGeometry = async (): Promise<GeoJSON.FeatureCollection> => {
        if (!layer || !session?.user?.token) {
            throw new Error("Layer or session not available");
        }

        const response = await fetch(`${BACKEND_URL}/data/user-aois/?id=${layer.id}&geom=true`, {
            headers: {
                'Authorization': `Token ${session.user.token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch layer geometry');
        }

        const data = await response.json();
        return data;
    };

    const downloadGeoJSON = async () => {
        try {
            setLoading(true);
            const geojsonData = await fetchLayerGeometry();
            const blob = new Blob([JSON.stringify(geojsonData, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            downloadBlob(url, 'geojson');
        } catch (error) {
            setError("Failed to download GeoJSON: " + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const downloadKML = async () => {
        try {
            setLoading(true);
            const geojsonData = await fetchLayerGeometry();
            const kmlData = convertGeoJSONtoKML(geojsonData);
            const blob = new Blob([kmlData], { type: "application/vnd.google-earth.kml+xml" });
            const url = URL.createObjectURL(blob);
            downloadBlob(url, 'kml');
        } catch (error) {
            setError("Failed to download KML: " + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const downloadShapefile = async () => {
        try {
            setLoading(true);
            const geojsonData = await fetchLayerGeometry();

            const options: shpwrite.ZipOptions = {
                outputType: "blob",
                compression: "STORE",
            };

            const blob = await shpwrite.zip(geojsonData, options) as Blob;
            const url = URL.createObjectURL(blob);
            downloadBlob(url, 'zip');
        } catch (error) {
            setError("Failed to download Shapefile: " + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!fileName.trim() || !format) {
            setError("Please enter a filename and select a format.");
            return;
        }

        setError("");

        if (format === "geojson") downloadGeoJSON();
        else if (format === "kml") downloadKML();
        else if (format === "zip") downloadShapefile();
        else setError("Choose the file format.");
    };

    useEffect(() => {
        if (isOpen && layer) {
            setFileName(layer.name || "layer");
            setFormat("");
            setError("");
            setLoading(false);
        }
    }, [isOpen, layer]);

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl">
                    <DialogTitle className="text-lg font-semibold text-gray-900 mb-4">
                        Download Layer: {layer?.name}
                    </DialogTitle>

                    <p className="text-sm text-gray-600 mb-4">
                        Choose which format you would like to receive and your download will begin immediately.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                File Name
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                placeholder="Enter filename"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Format
                            </label>
                            <select
                                className="w-full px-3 py-2 border text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                                required
                            >
                                <option value="">Select format</option>
                                <option value="geojson">GeoJSON</option>
                                <option value="kml">KML</option>
                                <option value="zip">Shapefile (ZIP)</option>
                            </select>
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDownload}
                                disabled={loading || !fileName.trim() || !format}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Downloading...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download size={16} />
                                        <span>Download</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default LayerDownloadModal;
