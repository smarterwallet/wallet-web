export const riskCfg = {
  standard: {
    title: 'Standard Return',
    estimatedReturn: '5%~7%',
    whenFallsToBuy: '10%',
    whenRisesToSell: '10%',
  },
  higher: {
    title: 'Higher Return',
    estimatedReturn: '5%~7%',
    whenFallsToBuy: '10%',
    whenRisesToSell: '10%',
  },
  lower: {
    title: 'Lower Return',
    estimatedReturn: '5%~7%',
    whenFallsToBuy: '10%',
    whenRisesToSell: '10%',
  }
}

export type RiskType = 'standard' | 'higher' | 'lower';