import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Download,
  LifeBuoy,
  LineChart,
  Search,
  Settings,
  Users,
  WalletCards,
} from 'lucide-react'
import './style.css'

const accounts = [
  { name: 'BrightCo', plan: 'Scale', mrr: 4200, health: 'Healthy', tickets: 2, owner: 'Alya' },
  { name: 'Northwind Labs', plan: 'Growth', mrr: 2800, health: 'Watch', tickets: 6, owner: 'Zia' },
  { name: 'Meridian Ops', plan: 'Scale', mrr: 5100, health: 'Healthy', tickets: 1, owner: 'Ken' },
  { name: 'Fabrikam Retail', plan: 'Starter', mrr: 900, health: 'Risk', tickets: 9, owner: 'Zia' },
  { name: 'Cloudline Studio', plan: 'Growth', mrr: 2300, health: 'Healthy', tickets: 3, owner: 'Mei' },
]

const events = [
  'Northwind requested workflow API access',
  'BrightCo upgraded 12 seats',
  'Fabrikam opened billing escalation',
  'Cloudline completed onboarding',
]

function App() {
  const [segment, setSegment] = useState('All')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(accounts[0])
  const [exported, setExported] = useState(false)

  const filtered = useMemo(() => {
    return accounts.filter((account) => {
      const matchesSegment = segment === 'All' || account.health === segment
      const matchesQuery = account.name.toLowerCase().includes(query.toLowerCase())
      return matchesSegment && matchesQuery
    })
  }, [segment, query])

  const totalMrr = accounts.reduce((sum, account) => sum + account.mrr, 0)

  return (
    <main className="dashboard">
      <aside className="sidebar">
        <div className="brand"><LineChart size={20} /><strong>InsightDesk</strong></div>
        <button className="active"><BarChart3 size={17} /> Overview</button>
        <button><Users size={17} /> Customers</button>
        <button><LifeBuoy size={17} /> Support</button>
        <button><WalletCards size={17} /> Billing</button>
        <button><Settings size={17} /> Settings</button>
      </aside>

      <section className="content">
        <header className="header">
          <div>
            <h1>Subscription operations dashboard</h1>
            <p>Revenue, retention, support health, and account activity in one operator view.</p>
          </div>
          <div className="header-actions">
            <button><CalendarDays size={16} /> Last 30 days</button>
            <button className="primary" onClick={() => setExported(true)}><Download size={16} /> Export report</button>
          </div>
        </header>

        {exported && <div className="toast">Report export prepared for the filtered account segment.</div>}

        <section className="kpis">
          <Kpi label="MRR" value={`RM ${totalMrr.toLocaleString()}`} delta="+12.4%" icon={WalletCards} />
          <Kpi label="Trial conversion" value="28.6%" delta="+4.1%" icon={ArrowUpRight} />
          <Kpi label="Churn risk" value="1 account" delta="Needs review" icon={Users} />
          <Kpi label="Open tickets" value="21" delta="-16%" icon={LifeBuoy} />
        </section>

        <section className="workgrid">
          <article className="chart-panel">
            <div className="panel-title">
              <strong>Revenue trend</strong>
              <span>MRR by week</span>
            </div>
            <svg viewBox="0 0 640 240" className="chart" role="img" aria-label="Revenue line chart">
              <polyline points="20,190 120,164 220,170 320,126 420,112 520,84 620,66" fill="none" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="20,210 120,194 220,184 320,158 420,132 520,112 620,98" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity=".65" />
              {[20,120,220,320,420,520,620].map((x, index) => <circle key={x} cx={x} cy={[190,164,170,126,112,84,66][index]} r="5" fill="#2563eb" />)}
            </svg>
          </article>

          <article className="table-panel">
            <div className="table-tools">
              <div className="segments">
                {['All', 'Healthy', 'Watch', 'Risk'].map((item) => (
                  <button key={item} className={segment === item ? 'selected' : ''} onClick={() => setSegment(item)}>{item}</button>
                ))}
              </div>
              <label className="search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search accounts" /></label>
            </div>

            <table>
              <thead>
                <tr><th>Account</th><th>Plan</th><th>MRR</th><th>Health</th><th>Tickets</th><th></th></tr>
              </thead>
              <tbody>
                {filtered.map((account) => (
                  <tr key={account.name}>
                    <td>{account.name}</td>
                    <td>{account.plan}</td>
                    <td>RM {account.mrr.toLocaleString()}</td>
                    <td><span className={`status ${account.health.toLowerCase()}`}>{account.health}</span></td>
                    <td>{account.tickets}</td>
                    <td><button className="view" onClick={() => setSelected(account)}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        </section>
      </section>

      <aside className="activity">
        <div className="account-card">
          <span>Selected account</span>
          <h2>{selected.name}</h2>
          <p>{selected.plan} plan • Owner {selected.owner}</p>
          <div className={`large-status ${selected.health.toLowerCase()}`}>{selected.health}</div>
        </div>

        <div className="notes">
          <strong>Account notes</strong>
          <p>{selected.name} has {selected.tickets} open tickets and RM {selected.mrr.toLocaleString()} monthly recurring revenue.</p>
          <button>Schedule review</button>
        </div>

        <div className="feed">
          <strong>Recent activity</strong>
          {events.map((event) => <p key={event}>{event}</p>)}
        </div>
      </aside>
    </main>
  )
}

function Kpi({ label, value, delta, icon: Icon }) {
  return (
    <article className="kpi">
      <Icon size={18} />
      <span>{label}</span>
      <strong>{value}</strong>
      <em>{delta}</em>
    </article>
  )
}

createRoot(document.getElementById('app')).render(<App />)
