/**
 * Generate cash flows with growth rate applied
 */
export function generateCashFlows(baseCashFlow, years, growthRate) {
  const flows = []
  for (let t = 0; t < years; t++) {
    flows.push(baseCashFlow * Math.pow(1 + growthRate / 100, t))
  }
  return flows
}

/**
 * NPV = Σ [CFₜ / (1 + r)ᵗ] - Initial Investment
 */
export function calculateNPV(initialInvestment, cashFlows, discountRate) {
  const r = discountRate / 100
  let npv = -initialInvestment
  for (let t = 0; t < cashFlows.length; t++) {
    npv += cashFlows[t] / Math.pow(1 + r, t + 1)
  }
  return npv
}

/**
 * IRR using Newton-Raphson method
 * Finds rate where NPV = 0
 */
export function calculateIRR(initialInvestment, cashFlows, maxIterations = 1000, tolerance = 1e-7) {
  if (!cashFlows.length || initialInvestment <= 0) return null

  const totalCF = cashFlows.reduce((s, c) => s + c, 0)
  if (totalCF <= initialInvestment * 0.01) return null

  let guess = 0.1

  for (let i = 0; i < maxIterations; i++) {
    let npv = -initialInvestment
    let dnpv = 0

    for (let t = 0; t < cashFlows.length; t++) {
      const factor = Math.pow(1 + guess, t + 1)
      npv += cashFlows[t] / factor
      dnpv -= (t + 1) * cashFlows[t] / Math.pow(1 + guess, t + 2)
    }

    if (Math.abs(dnpv) < 1e-15) break

    const newGuess = guess - npv / dnpv

    if (Math.abs(newGuess - guess) < tolerance) {
      return newGuess * 100
    }

    guess = newGuess

    if (guess < -0.99 || guess > 10) {
      return fallbackIRR(initialInvestment, cashFlows)
    }
  }

  return fallbackIRR(initialInvestment, cashFlows)
}

function fallbackIRR(initialInvestment, cashFlows) {
  let low = -0.5
  let high = 5.0

  for (let i = 0; i < 200; i++) {
    const mid = (low + high) / 2
    const npv = calculateNPV(initialInvestment, cashFlows, mid * 100)

    if (Math.abs(npv) < 0.01) return mid * 100
    if (npv > 0) low = mid
    else high = mid
  }

  return ((low + high) / 2) * 100
}

/**
 * ROI = (Total Net Profit / Initial Investment) × 100%
 */
export function calculateROI(initialInvestment, cashFlows) {
  if (initialInvestment <= 0) return null
  const totalCF = cashFlows.reduce((sum, cf) => sum + cf, 0)
  return ((totalCF - initialInvestment) / initialInvestment) * 100
}

/**
 * Payback Period - year when cumulative CF >= investment
 */
export function calculatePaybackPeriod(initialInvestment, cashFlows) {
  if (initialInvestment <= 0) return null
  let cumulative = 0

  for (let t = 0; t < cashFlows.length; t++) {
    cumulative += cashFlows[t]
    if (cumulative >= initialInvestment) {
      const prevCumulative = cumulative - cashFlows[t]
      const fraction = (initialInvestment - prevCumulative) / cashFlows[t]
      return t + fraction
    }
  }

  return null // ไม่คืนทุนภายในช่วงเวลาที่กำหนด
}

/**
 * NPV Sensitivity: varying discount rate
 */
export function calculateNPVSensitivity(initialInvestment, cashFlows, rateMin = 0, rateMax = 30, step = 1) {
  const points = []
  for (let r = rateMin; r <= rateMax; r += step) {
    points.push({
      rate: r,
      npv: calculateNPV(initialInvestment, cashFlows, r),
    })
  }
  return points
}

/**
 * Cumulative cash flow series for chart
 */
export function calculateCumulativeCashFlows(initialInvestment, cashFlows) {
  const series = [{ year: 0, cashFlow: 0, cumulative: -initialInvestment }]
  let cumulative = -initialInvestment

  for (let t = 0; t < cashFlows.length; t++) {
    cumulative += cashFlows[t]
    series.push({
      year: t + 1,
      cashFlow: cashFlows[t],
      cumulative,
    })
  }

  return series
}
