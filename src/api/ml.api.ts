import type { DamageAssessment } from '../types/damage';

export const mlApi = {
  async assessDamage(imageId: string): Promise<DamageAssessment> {
    try {

      return mockAssessDamage(imageId);
    } catch (error) {
      console.error('ML assessment failed:', error);
      throw error;
    }
  }
};

function mockAssessDamage(imageId: string): DamageAssessment {
  const mockScenarios = [
    {
      damageAreas: [
        { area: 'Front Bumper', severity: 3, cost: 1500, description: 'Moderate dent and scratches' }
      ],
      totalCost: 1500,
      totalLoss: false
    },
    {
      damageAreas: [
        { area: 'Front Bumper', severity: 4, cost: 2200, description: 'Severe damage, needs replacement' },
        { area: 'Hood', severity: 2, cost: 800, description: 'Minor dent' }
      ],
      totalCost: 3000,
      totalLoss: false
    },
    {
      damageAreas: [
        { area: 'Driver Door', severity: 3, cost: 1800, description: 'Deep scratches and dent' },
        { area: 'Rear Quarter Panel', severity: 4, cost: 3500, description: 'Major structural damage' },
        { area: 'Taillight', severity: 2, cost: 400, description: 'Cracked lens' }
      ],
      totalCost: 5700,
      totalLoss: false
    },
    {
      damageAreas: [
        { area: 'Front End', severity: 5, cost: 8000, description: 'Complete front end destruction' },
        { area: 'Engine Bay', severity: 5, cost: 12000, description: 'Engine damage detected' },
        { area: 'Frame', severity: 5, cost: 15000, description: 'Frame bent - structural integrity compromised' }
      ],
      totalCost: 35000,
      totalLoss: true
    }
  ];

  const scenario = mockScenarios[Math.floor(Math.random() * mockScenarios.length)];

  return {
    ...scenario,
    assessmentDate: new Date().toISOString(),
    imageId
  };
}
