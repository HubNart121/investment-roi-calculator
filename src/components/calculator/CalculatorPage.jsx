import InputPanel from './InputPanel'
import ResultsPanel from './ResultsPanel'
import CashFlowTable from './CashFlowTable'
import CashFlowChart from '../charts/CashFlowChart'
import SensitivityChart from '../charts/SensitivityChart'

export default function CalculatorPage({
  project,
  results,
  cashFlows,
  chartData,
  sensitivityData,
  onUpdateData,
  onUpdateProject,
}) {
  return (
    <div className="calculator-page">
      {results && <ResultsPanel results={results} />}

      <div className="calculator-grid">
        <div className="calculator-input-section">
          <InputPanel
            project={project}
            onUpdateData={onUpdateData}
            onUpdateProject={onUpdateProject}
          />
        </div>

        <div className="calculator-results-section">
          {cashFlows && cashFlows.length > 0 && (
            <CashFlowTable
              cashFlows={cashFlows}
              initialInvestment={Number(project.data.initialInvestment)}
              onUpdateCashFlows={(cfs) => onUpdateData({ cashFlows: cfs })}
            />
          )}

          {chartData && chartData.length > 1 && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">📊 กราฟกระแสเงินสด</h3>
              </div>
              <CashFlowChart data={chartData} />
            </div>
          )}

          {sensitivityData && sensitivityData.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">📈 NPV Sensitivity Analysis</h3>
              </div>
              <SensitivityChart
                data={sensitivityData}
                currentRate={Number(project.data.discountRate) || 10}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
