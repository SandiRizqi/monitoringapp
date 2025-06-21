// src/services/deforestationVerificationService.ts

import { BACKEND_URL } from '@/components/conts';

export interface DeforestationVerificationData {
  alert: string;
  verification_date: string;
  status: 'valid' | 'false_alarm' | 'investigating' | 'resolved';
  area_ha: number;
  description?: string;
  notes?: string;
  photo_urls?: string[];
}

export interface DeforestationVerification extends DeforestationVerificationData {
  id: number;
  verifier: number;
  created: string;
  updated: string;
}

export const deforestationVerificationService = {
  async create(data: DeforestationVerificationData, token: string): Promise<DeforestationVerification> {
    const response = await fetch(`${BACKEND_URL}/data/deforestation-verifications/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create verification');
    }

    return response.json();
  },

  async update(id: number, data: Partial<DeforestationVerificationData>, token: string): Promise<DeforestationVerification> {
    const response = await fetch(`${BACKEND_URL}/data/deforestation-verifications/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to update verification');
    }

    return response.json();
  },

  async getList(token: string): Promise<DeforestationVerification[]> {
    const response = await fetch(`${BACKEND_URL}/data/deforestation-verifications/`, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch verifications');
    }

    return response.json();
  },

  async getDetail(id: number, token: string): Promise<DeforestationVerification> {
    const response = await fetch(`${BACKEND_URL}/data/deforestation-verifications/${id}/`, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch verification detail');
    }

    return response.json();
  },

  async delete(id: number, token: string): Promise<void> {
    const response = await fetch(`${BACKEND_URL}/data/deforestation-verifications/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to delete verification');
    }
  },
};
