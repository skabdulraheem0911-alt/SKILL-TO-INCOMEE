import React, { useState, useEffect } from 'react';
import { MapPin, Download, AlertOctagon, TrendingUp, Filter, ShieldAlert, BarChart } from 'lucide-react';
import { api } from '../lib/api';
import { Language, TRANSLATIONS } from '../lib/translations';

interface AdminViewProps {
  currentRole: string;
  language: Language;
}

export const AdminView: React.FC<AdminViewProps> = ({
  currentRole,
  language
}) => {
  const t = TRANSLATIONS[language];
  const [demandData, setDemandData] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');

  const districts = ["All", "Pune", "Mumbai City & Suburban", "Nagpur", "Nashik", "Chhatrapati Sambhajinagar", "Thane", "Kolhapur", "Solapur", "Amravati"];

  useEffect(() => {
    loadData();
  }, [selectedDistrict, selectedSkill]);

  const loadData = async () => {
    try {
      const [demand, anom] = await Promise.all([
        api.getDistrictDemand(selectedDistrict, selectedSkill),
        api.getAnomalies(currentRole)
      ]);
      setDemandData(demand);
      setAnomalies(anom);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportCSV = () => {
    const headers = "District,Skill,Demand Level,Demand Score,Growth Rate %,Open Positions,Primary Industry\n";
    const rows = demandData.map(d =>
      `"${d.district}","${d.skill_id}","${d.demand_level}",${d.demand_score},${d.growth_rate_pct},${d.open_positions},"${d.primary_industry}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Maharashtra_Skill_Demand_Intelligence_${selectedDistrict}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner & Export */}
      <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#f59e0b', fontWeight: 700, letterSpacing: '0.05em' }}>
            Statewide Governance & Policy Intelligence (Module L)
          </div>
          <h2 style={{ fontSize: '1.35rem', color: '#f8fafc', margin: '0.2rem 0 0 0' }}>
            {t.nav_admin_intelligence}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
            Regional Maharashtra skill gaps, industry demand forecasts, and automated governance anomalies.
          </p>
        </div>

        <button onClick={handleExportCSV} className="btn-primary" style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)' }}>
          <Download size={16} /> Export Intelligence (CSV)
        </button>
      </div>

      {/* District & Skill Filters */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.75rem', display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Filter size={16} color="#94a3b8" />
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>Filter District:</span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            style={{
              background: 'rgba(30, 41, 59, 0.9)',
              color: '#f8fafc',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '0.45rem 1rem',
              fontSize: '0.82rem'
            }}
          >
            {districts.map(d => (
              <option key={d} value={d} style={{ background: '#0f172a' }}>{d}</option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
          Showing <strong>{demandData.length}</strong> active regional skill indices across Maharashtra.
        </div>
      </div>

      {/* SIH Differentiator 9: Anomaly Detection on Admin Dashboard */}
      {anomalies.length > 0 && (
        <div className="glass-panel" style={{ padding: '1.5rem 1.75rem', borderLeft: '4px solid #f43f5e' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <AlertOctagon size={20} color="#f43f5e" />
            <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', margin: 0 }}>
              AI Governance Anomaly Detection (Z-Score Spikes)
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {anomalies.map((anom, idx) => (
              <div key={idx} style={{ background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.25)', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <strong style={{ color: '#fda4af', fontSize: '0.92rem' }}>{anom.entity}</strong>
                  <span className="badge badge-high" style={{ fontSize: '0.68rem' }}>
                    z = {anom.z_score}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#f8fafc', marginTop: '0.35rem', fontWeight: 600 }}>
                  {anom.metric}: <span style={{ color: '#fb7185' }}>{anom.value}</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0.4rem 0 0 0' }}>
                  {anom.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Maharashtra Skill Demand Table & Heatmap */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={18} color="#38bdf8" /> {t.district_heatmap}
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: '#94a3b8' }}>
                <th style={{ padding: '0.75rem 1rem' }}>District</th>
                <th style={{ padding: '0.75rem 1rem' }}>Skill</th>
                <th style={{ padding: '0.75rem 1rem' }}>Demand Score</th>
                <th style={{ padding: '0.75rem 1rem' }}>Projected Growth</th>
                <th style={{ padding: '0.75rem 1rem' }}>Open Job Positions</th>
                <th style={{ padding: '0.75rem 1rem' }}>Dominant Industry</th>
              </tr>
            </thead>
            <tbody>
              {demandData.slice(0, 15).map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#f8fafc' }}>
                    {row.district}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#38bdf8' }}>
                    {row.skill_id.toUpperCase()}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${row.demand_score}%`, height: '100%', background: row.demand_score > 75 ? '#ef4444' : '#f59e0b' }} />
                      </div>
                      <span style={{ fontWeight: 700, color: row.demand_score > 75 ? '#f87171' : '#fcd34d' }}>
                        {row.demand_score}/100
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#34d399', fontWeight: 600 }}>
                    +{row.growth_rate_pct}% YoY
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>
                    {row.open_positions.toLocaleString()}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#94a3b8' }}>
                    {row.primary_industry}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
