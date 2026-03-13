// ─────────────────────────────────────────────────────────
// App.jsx  –  Root component & navigation controller
// ─────────────────────────────────────────────────────────
import React, { useState } from "react";
import "./styles/global.css";
import "./styles/components.css";

import BottomNav           from "./components/BottomNav";
import PatientList         from "./screens/PatientList";
import AddPatientWizard    from "./screens/AddPatientWizard";
import PatientDetail       from "./screens/PatientDetail";
import { TrackerScreen, AlertsScreen } from "./screens/TrackerAndAlerts";
import usePatients         from "./hooks/usePatients";

export default function App() {
  const { patients, loading, savePatient, deletePatient, alertCount } = usePatients();

  // Main tab: "patients" | "tracker" | "alerts"
  const [tab, setTab] = useState("patients");

  // Sub-view within patients tab: "list" | "add" | "detail"
  const [view,            setView]           = useState("list");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // ── Dismissed alert IDs ──────────────────────────────────
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  // ── Build real-time alerts array from patients ───────────
  const allAlerts = [];
  patients.forEach((p) => {
    if (p.tbsa >= 40) {
      allAlerts.push({
        id: `${p.id}-tbsa`,
        patientId: p.id,
        patientName: p.name,
        type: "tbsa",
        msg: "TBSA ≥ 40% — Specialist burn centre referral strongly recommended.",
        time: "Ongoing",
        currentRate: p.hourly_rate,
      });
    }
    if (p._alert) {
      allAlerts.push({
        id: `${p.id}-urine`,
        patientId: p.id,
        patientName: p.name,
        type: "urine",
        msg: "Low urine output detected. Consider increasing fluid rate by ~20% and consulting a senior physician.",
        time: p._alertTime ? new Date(p._alertTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now",
        currentRate: p.hourly_rate,
      });
    }
  });
  const activeAlerts = allAlerts.filter((a) => !dismissedAlerts.includes(a.id));
  const realAlertCount = activeAlerts.length;

  // ── Handlers ────────────────────────────────────────────
  async function handleSavePatient(patient) {
    await savePatient(patient);
    setSelectedPatient(patient);
    setView("detail");
  }

  async function handleDeletePatient(id) {
    if (!window.confirm("Remove this patient?")) return;
    await deletePatient(id);
    if (selectedPatient?.id === id) {
      setSelectedPatient(null);
      setView("list");
    }
  }

  function openDetail(patient) {
    setSelectedPatient(patient);
    setView("detail");
    setTab("patients");
  }

  // Called from PatientDetail when urine is logged or rate changed
  function handlePatientUpdate(updated) {
    setSelectedPatient(updated);
    savePatient(updated);
    // If alert cleared, dismiss it
    if (!updated._alert) {
      setDismissedAlerts((d) => [...d, `${updated.id}-urine`]);
    }
  }

  // Called from AlertsScreen "Increase Rate" button
  async function handleIncreaseRate(patientId, newRate) {
    const p = patients.find((x) => x.id === patientId);
    if (!p) return;
    const newDrip = Math.round(p.drip_rate * 1.2);
    const updated = { ...p, hourly_rate: newRate, drip_rate: newDrip, _alert: false };
    await savePatient(updated);
    setDismissedAlerts((d) => [...d, `${patientId}-urine`]);
    if (selectedPatient?.id === patientId) setSelectedPatient(updated);
  }

  // ── Full-screen views (wizard & detail have their own header) ──
  if (view === "add") {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100dvh" }}>
        <AddPatientWizard
          onSave={handleSavePatient}
          onCancel={() => setView("list")}
        />
      </div>
    );
  }

  if (view === "detail" && selectedPatient) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100dvh" }}>
        <PatientDetail
          patient={selectedPatient}
          onBack={() => { setView("list"); setSelectedPatient(null); }}
          onPatientUpdate={handlePatientUpdate}
        />
      </div>
    );
  }

  // ── Main shell (header + bottom nav) ──────────────────
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100dvh", background: "var(--bg)", position: "relative" }}>
      {/* App-wide header */}
      <header style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: "14px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky", top: 0, zIndex: 50,
        boxShadow: "var(--shadow-sm)",
      }}>
        <div>
          <p style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.5px", color: "var(--text)" }}>
            💉 Drip-Rate
          </p>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--primary)", letterSpacing: "0.3px" }}>
            Emergency Burn Care Assistant
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {realAlertCount > 0 && (
            <button
              onClick={() => setTab("alerts")}
              style={{
                background: "var(--danger-light)", border: "1px solid var(--danger-mid)",
                borderRadius: "var(--radius-sm)", padding: "6px 12px",
                cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                fontFamily: "inherit",
              }}
            >
              <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--danger)", display: "inline-block" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--danger)" }}>
                {realAlertCount} ALERT{realAlertCount > 1 ? "S" : ""}
              </span>
            </button>
          )}
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            🏥
          </div>
        </div>
      </header>

      {/* Tab content */}
      <main style={{ overflowY: "auto" }}>
        {tab === "patients" && (
          <PatientList
            patients={patients}
            loading={loading}
            onSelectPatient={openDetail}
            onAddPatient={() => setView("add")}
            onDeletePatient={handleDeletePatient}
          />
        )}
        {tab === "tracker" && <TrackerScreen patients={patients} />}
        {tab === "alerts"  && (
          <AlertsScreen
            activeAlerts={activeAlerts}
            onDismiss={(id) => setDismissedAlerts((d) => [...d, id])}
            onIncreaseRate={handleIncreaseRate}
          />
        )}
      </main>

      <BottomNav tab={tab} setTab={setTab} alertCount={realAlertCount} />
    </div>
  );
}
