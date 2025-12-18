export interface DamageArea {
  area: string;
  severity: number; // 1-5
  cost: number;
  description?: string;
}

export interface DamageAssessment {
  id?: string;
  userId?: string;
  imageId: string;
  damageAreas: DamageArea[];
  totalCost: number;
  totalLoss: boolean;
  assessmentDate: string;
}
