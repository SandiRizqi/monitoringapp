import React from "react";

export default function DeforestationStats() {
    return (
        <div className="bg-white rounded-md shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Total</h2>
            <div className="space-y-3">
                <div>
                    <p className="text-sm text-gray-500">Total Kejadian</p>
                    <p className="text-xl font-bold">-</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Total Area</p>
                    <p className="text-xl font-bold">-</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Jumlah PT Terlibat</p>
                    <p className="text-xl font-bold">-</p>
                </div>
            </div>
        </div>
    );
}