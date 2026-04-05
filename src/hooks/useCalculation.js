import { useMemo } from 'react'
import {
  generateCashFlows,
  calculateNPV,
  calculateIRR,
  calculateROI,
  calculatePaybackPeriod,
  calculateNPVSensitivity,
  calculateCumulativeCashFlows,
} from '../utils/calculations'

export function useCalculation(projectData) {
  return useMemo(() => {
    if (!projectData) {
      return { results: null, chartData: null, sensitivityData: null }
    }

    const {
      initialInvestment,
      years,
      discountRate,
      growthRate,
      baseCashFlow,
      cashFlows: manualCashFlows,
    } = projectData

    const inv = Number(initialInvestment) || 0
    const yrs = Number(years) || 0
    const dr = Number(discountRate) || 0
    const gr = Number(growthRate) || 0
    const base = Number(baseCashFlow) || 0

    if (inv <= 0 || yrs <= 0) {
      return { results: null, chartData: null, sensitivityData: null }
    }

    // Use manual cash flows if provided, otherwise generate from base + growth
    let cashFlows
    if (manualCashFlows && manualCashFlows.length === yrs && manualCashFlows.some((v) => Number(v) > 0)) {
      cashFlows = manualCashFlows.map((v) => Number(v) || 0)
    } else if (base > 0) {
      cashFlows = generateCashFlows(base, yrs, gr)
    } else {
      return { results: null, chartData: null, sensitivityData: null }
    }

    const npv = calculateNPV(inv, cashFlows, dr)
    const irr = calculateIRR(inv, cashFlows)
    const roi = calculateROI(inv, cashFlows)
    const paybackPeriod = calculatePaybackPeriod(inv, cashFlows)
    const chartData = calculateCumulativeCashFlows(inv, cashFlows)
    const sensitivityData = calculateNPVSensitivity(inv, cashFlows, 0, Math.max(30, dr * 2), 1)

    return {
      results: { npv, irr, roi, paybackPeriod },
      cashFlows,
      chartData,
      sensitivityData,
    }
  }, [projectData])
}
