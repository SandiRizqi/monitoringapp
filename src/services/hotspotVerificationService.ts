// src/services/hotspotVerificationService.ts
import { BACKEND_URL } from '@/components/conts';

export interface HotspotVerificationData {
  hotspot: string;
  verification_date: string;
  status: 'valid' | 'invalid' | 'uncertain';
  fire_evidence: boolean;
  description?: string;
  photo_urls?: string[];
}

export interface HotspotVerification extends HotspotVerificationData {
  id: number;
  verifier: number;
  created_at: string;
  updated_at: string;
}

export const hotspotVerificationService = {
  async create(data: HotspotVerificationData, token: string): Promise<HotspotVerification> {
    const response = await fetch(`${BACKEND_URL}/data/hotspot-verifications/`, {
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

  async update(id: number, data: Partial<HotspotVerificationData>, token: string): Promise<HotspotVerification> {
    const response = await fetch(`${BACKEND_URL}/data/hotspot-verifications/${id}/`, {
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

  async getList(token: string): Promise<HotspotVerification[]> {
    const response = await fetch(`${BACKEND_URL}/data/hotspot-verifications/`, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch verifications');
    }

    return response.json();
  },

  async getDetail(id: number, token: string): Promise<HotspotVerification> {
    const response = await fetch(`${BACKEND_URL}/data/hotspot-verifications/${id}/`, {
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
    const response = await fetch(`${BACKEND_URL}/data/hotspot-verifications/${id}/`, {
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
