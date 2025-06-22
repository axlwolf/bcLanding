import db from './db'
import type { CTAConfigInstance } from './models/ctaConfig'

export async function getAllCTAConfig(): Promise<CTAConfigInstance[]> {
  return db.getAllCTAConfig()
}

export async function getCTAConfigById(id: number): Promise<CTAConfigInstance | null> {
  return db.getCTAConfigById(id)
}

export async function getCTAConfigByType(cta_type: string): Promise<CTAConfigInstance | null> {
  return db.getCTAConfigByType(cta_type)
}

export async function insertCTAConfig(
  instance: Omit<CTAConfigInstance, 'id' | 'updated_at'>
): Promise<number> {
  return db.insertCTAConfig(instance)
}

export async function updateCTAConfig(
  id: number,
  updates: Partial<Omit<CTAConfigInstance, 'id' | 'updated_at'>>
): Promise<void> {
  return db.updateCTAConfig(id, updates)
}

export async function deleteCTAConfig(id: number): Promise<void> {
  return db.deleteCTAConfig(id)
}
