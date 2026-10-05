
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [activePage, setActivePage] = useState("Dashboard");

  const [showForm, setShowForm] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [aiMessage, setAiMessage] = useState("");
  const [showAiModal, setShowAiModal] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    event: "",
    notes: "",
    follow_up_status: "Pending",
  });

  /* =====================================================
     FETCH LEADS
     ===================================================== */

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/leads/`, {
        params: {
          search: search || undefined,
          follow_up_status: status || undefined,
        },
      });

      setLeads(response.data);
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching leads:", error);
      setErrorMessage(
        "Unable to connect to the backend. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [search, status]);

  /* =====================================================
     FORM
     ===================================================== */

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      email: "",
      event: "",
      notes: "",
      follow_up_status: "Pending",
    });

    setEditingLeadId(null);
    setShowForm(false);
  };

  const openAddLead = () => {
    setEditingLeadId(null);

    setFormData({
      name: "",
      company: "",
      email: "",
      event: "",
      notes: "",
      follow_up_status: "Pending",
    });

    setShowForm(true);
  };

  const handleSubmitLead = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editingLeadId) {
        await axios.put(
          `${API_URL}/leads/${editingLeadId}`,
          formData
        );
      } else {
        await axios.post(`${API_URL}/leads/`, formData);
      }

      resetForm();

      await fetchLeads();
    } catch (error) {
      console.error("Error saving lead:", error);

      setErrorMessage(
        error.response?.data?.detail ||
          "Failed to save lead."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     EDIT
     ===================================================== */

  const handleEditLead = (lead) => {
    setFormData({
      name: lead.name || "",
      company: lead.company || "",
      email: lead.email || "",
      event: lead.event || "",
      notes: lead.notes || "",
      follow_up_status:
        lead.follow_up_status || "Pending",
    });

    setEditingLeadId(lead.id);
    setShowForm(true);
  };

  /* =====================================================
     DELETE
     ===================================================== */

  const handleDeleteLead = async (leadId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/leads/${leadId}`);

      await fetchLeads();
    } catch (error) {
      console.error("Error deleting lead:", error);

      setErrorMessage("Failed to delete lead.");
    }
  };

  /* =====================================================
     AI FOLLOW-UP
     ===================================================== */

  const handleAiFollowUp = async (leadId) => {
    try {
      setAiLoading(true);
      setAiMessage("");
      setShowAiModal(true);

      const response = await axios.post(
        `${API_URL}/leads/${leadId}/ai-draft`
      );

      setAiMessage(response.data.follow_up_message);
    } catch (error) {
      console.error("AI follow-up error:", error);

      setShowAiModal(false);

      setErrorMessage(
        error.response?.data?.detail ||
          "Unable to generate AI follow-up."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(aiMessage);

      alert("AI message copied!");
    } catch (error) {
      console.error("Copy error:", error);

      alert("Unable to copy message.");
    }
  };

  /* =====================================================
     STATISTICS
     ===================================================== */

  const totalLeads = leads.length;

  const pendingLeads = leads.filter(
    (lead) => lead.follow_up_status === "Pending"
  ).length;

  const contactedLeads = leads.filter(
    (lead) => lead.follow_up_status === "Contacted"
  ).length;

  const completedLeads = leads.filter(
    (lead) => lead.follow_up_status === "Completed"
  ).length;

  const followUpRequired = leads.filter(
    (lead) =>
      lead.follow_up_status === "Follow-up Required"
  ).length;

  /* =====================================================
     SIDEBAR NAVIGATION
     ===================================================== */

  const handleNavigation = (page) => {
    setActivePage(page);

    if (page === "Leads") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  /* =====================================================
     RENDER
     ===================================================== */

  return (
    <div className="app-shell">

      {/* =================================================
          SIDEBAR
          ================================================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">

          <div className="logo-box">
            ✦
          </div>

          <div>
            <h2>AI Lead</h2>
            <span>Manager</span>
          </div>

        </div>

        <div className="sidebar-section-title">
          MAIN
        </div>

        <nav className="sidebar-nav">

          <button
            className={
              activePage === "Dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              handleNavigation("Dashboard")
            }
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            className={
              activePage === "Leads"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              handleNavigation("Leads")
            }
          >
            <span>◉</span>
            Leads

            <small>{totalLeads}</small>
          </button>

          <button
            className={
              activePage === "AI Follow-ups"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              handleNavigation("AI Follow-ups")
            }
          >
            <span>✦</span>
            AI Follow-ups

            <small>{followUpRequired}</small>
          </button>

          <button
            className={
              activePage === "Analytics"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              handleNavigation("Analytics")
            }
          >
            <span>◒</span>
            Analytics
          </button>

        </nav>

        <div className="sidebar-section-title">
          SYSTEM
        </div>

        <nav className="sidebar-nav">

          <button className="nav-item">
            <span>⚙</span>
            Settings
          </button>

          <button className="nav-item">
            <span>?</span>
            Help & Support
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="user-card">

            <div className="user-avatar">
              A
            </div>

            <div className="user-info">
              <strong>Atharva</strong>
              <span>Administrator</span>
            </div>

            <span className="user-menu">
              ⋮
            </span>

          </div>

        </div>

      </aside>

      {/* =================================================
          MAIN CONTENT
          ================================================= */}

      <main className="main-content">

        {/* TOP BAR */}

        <header className="topbar">

          <div>

            <div className="breadcrumb">
              Workspace
              <span>/</span>
              {activePage}
            </div>

            <h1>
              {activePage === "Dashboard"
                ? "Good afternoon, Atharva 👋"
                : activePage}
            </h1>

            <p>
              Manage your event leads and follow-ups
              from one place.
            </p>

          </div>

          <div className="topbar-actions">

            <div className="system-status">
              <span className="online-dot"></span>
              API Online
            </div>

            <button
              className="add-lead-button"
              onClick={openAddLead}
            >
              <span>+</span>
              Add Lead
            </button>

          </div>

        </header>

        {/* ERROR */}

        {errorMessage && (
          <div className="error-banner">

            <span>⚠</span>

            <span>
              {errorMessage}
            </span>

            <button
              onClick={() =>
                setErrorMessage("")
              }
            >
              ×
            </button>

          </div>
        )}

        {/* =================================================
            DASHBOARD
            ================================================= */}

        <section className="dashboard-content">

          {/* STATS */}

          <div className="stats-grid">

            <div className="stat-card purple">

              <div className="stat-top">

                <div className="stat-icon">
                  👥
                </div>

                <span className="stat-trend">
                  +12%
                </span>

              </div>

              <p>Total Leads</p>

              <h2>{totalLeads}</h2>

              <span className="stat-description">
                All event contacts
              </span>

            </div>

            <div className="stat-card orange">

              <div className="stat-top">

                <div className="stat-icon">
                  ⏳
                </div>

                <span className="stat-trend">
                  Active
                </span>

              </div>

              <p>Pending</p>

              <h2>{pendingLeads}</h2>

              <span className="stat-description">
                Need attention
              </span>

            </div>

            <div className="stat-card blue">

              <div className="stat-top">

                <div className="stat-icon">
                  ✉
                </div>

                <span className="stat-trend">
                  Working
                </span>

              </div>

              <p>Contacted</p>

              <h2>{contactedLeads}</h2>

              <span className="stat-description">
                Conversations started
              </span>

            </div>

            <div className="stat-card green">

              <div className="stat-top">

                <div className="stat-icon">
                  ✓
                </div>

                <span className="stat-trend">
                  Done
                </span>

              </div>

              <p>Completed</p>

              <h2>{completedLeads}</h2>

              <span className="stat-description">
                Successfully followed up
              </span>

            </div>

          </div>

          {/* QUICK AI PANEL */}

          <div className="ai-banner">

            <div className="ai-banner-icon">
              ✦
            </div>

            <div className="ai-banner-content">

              <div className="ai-label">
                AI POWERED
              </div>

              <h2>
                Generate smarter follow-ups
              </h2>

              <p>
                Select any lead below and let AI
                create a personalized follow-up
                message based on your interaction notes.
              </p>

            </div>

            <div className="ai-banner-glow"></div>

          </div>

          {/* LEADS HEADER */}

          <div className="content-header">

            <div>

              <div className="title-with-count">

                <h2>
                  Recent Leads
                </h2>

                <span>
                  {totalLeads}
                </span>

              </div>

              <p>
                Your latest event contacts
              </p>

            </div>

            <button
              className="view-all-button"
              onClick={() =>
                handleNavigation("Leads")
              }
            >
              View all →
            </button>

          </div>

          {/* SEARCH */}

          <div className="toolbar">

            <div className="search-box">

              <span>⌕</span>

              <input
                type="text"
                placeholder="Search by name, company, email or event..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              <option value="">
                All statuses
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Contacted">
                Contacted
              </option>

              <option value="Follow-up Required">
                Follow-up Required
              </option>

              <option value="Completed">
                Completed
              </option>

            </select>

          </div>

          {/* LEADS */}

          {loading && leads.length === 0 && (
            <div className="loading-container">

              <div className="spinner"></div>

              <p>
                Loading your leads...
              </p>

            </div>
          )}

          {!loading && leads.length === 0 && (
            <div className="empty-state">

              <div className="empty-icon">
                ◉
              </div>

              <h3>
                No leads found
              </h3>

              <p>
                Start building your event pipeline
                by adding your first lead.
              </p>

              <button
                className="add-lead-button"
                onClick={openAddLead}
              >
                + Add your first lead
              </button>

            </div>
          )}

          {leads.length > 0 && (
            <div className="lead-grid">

              {leads.map((lead) => (

                <div
                  className="lead-card"
                  key={lead.id}
                >

                  <div className="lead-card-top">

                    <div className="lead-person">

                      <div className="avatar">
                        {lead.name
                          ? lead.name
                              .charAt(0)
                              .toUpperCase()
                          : "?"}
                      </div>

                      <div>

                        <h3>
                          {lead.name}
                        </h3>

                        <p>
                          {lead.company}
                        </p>

                      </div>

                    </div>

                    <span
                      className={`status status-${lead.follow_up_status
                        ?.toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {lead.follow_up_status}
                    </span>

                  </div>

                  <div className="lead-divider"></div>

                  <div className="lead-info">

                    <div className="info-item">

                      <span className="info-icon">
                        @
                      </span>

                      <div>
                        <small>
                          EMAIL
                        </small>

                        <p>
                          {lead.email}
                        </p>
                      </div>

                    </div>

                    <div className="info-item">

                      <span className="info-icon">
                        ◈
                      </span>

                      <div>
                        <small>
                          EVENT
                        </small>

                        <p>
                          {lead.event}
                        </p>
                      </div>

                    </div>

                  </div>

                  <div className="notes">

                    <small>
                      INTERACTION NOTES
                    </small>

                    <p>
                      {lead.notes ||
                        "No interaction notes available."}
                    </p>

                  </div>

                  <div className="lead-actions">

                    <button
                      className="action-edit"
                      onClick={() =>
                        handleEditLead(lead)
                      }
                    >
                      ✎ Edit
                    </button>

                    <button
                      className="action-delete"
                      onClick={() =>
                        handleDeleteLead(lead.id)
                      }
                    >
                      × Delete
                    </button>

                    <button
                      className="action-ai"
                      onClick={() =>
                        handleAiFollowUp(lead.id)
                      }
                    >
                      ✦ Generate AI Follow-up
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </section>

      </main>

      {/* =================================================
          ADD / EDIT MODAL
          ================================================= */}

      {showForm && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>

                <div className="modal-icon">
                  {editingLeadId
                    ? "✎"
                    : "+"}
                </div>

                <div>
                  <h2>
                    {editingLeadId
                      ? "Edit Lead"
                      : "Add New Lead"}
                  </h2>

                  <p>
                    {editingLeadId
                      ? "Update lead information."
                      : "Add a new event contact."}
                  </p>
                </div>

              </div>

              <button
                className="close-button"
                onClick={resetForm}
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmitLead}
            >

              <label>
                Lead Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={handleInputChange}
                required
              />

              <label>
                Company
              </label>

              <input
                type="text"
                name="company"
                placeholder="e.g. Acme Corporation"
                value={formData.company}
                onChange={handleInputChange}
                required
              />

              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <label>
                Event
              </label>

              <input
                type="text"
                name="event"
                placeholder="e.g. Tech Summit 2026"
                value={formData.event}
                onChange={handleInputChange}
                required
              />

              <label>
                Interaction Notes
              </label>

              <textarea
                name="notes"
                placeholder="What did you discuss with this lead?"
                value={formData.notes}
                onChange={handleInputChange}
                rows="4"
              />

              <label>
                Follow-up Status
              </label>

              <select
                name="follow_up_status"
                value={
                  formData.follow_up_status
                }
                onChange={handleInputChange}
              >

                <option value="Pending">
                  Pending
                </option>

                <option value="Contacted">
                  Contacted
                </option>

                <option value="Follow-up Required">
                  Follow-up Required
                </option>

                <option value="Completed">
                  Completed
                </option>

              </select>

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="add-lead-button"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : editingLeadId
                    ? "Update Lead"
                    : "Create Lead"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =================================================
          AI MODAL
          ================================================= */}

      {showAiModal && (

        <div className="modal-overlay">

          <div className="ai-modal">

            <div className="ai-modal-header">

              <div className="ai-modal-title">

                <div className="ai-modal-icon">
                  ✦
                </div>

                <div>

                  <h2>
                    AI Follow-up
                  </h2>

                  <p>
                    Personalized message generated
                    by your local AI
                  </p>

                </div>

              </div>

              <button
                className="close-button"
                onClick={() => {
                  setShowAiModal(false);
                  setAiMessage("");
                }}
              >
                ×
              </button>

            </div>

            {aiLoading ? (

              <div className="ai-loading">

                <div className="ai-spinner"></div>

                <h3>
                  Creating your message...
                </h3>

                <p>
                  Ollama is analyzing the
                  interaction notes.
                </p>

              </div>

            ) : (

              <>

                <div className="generated-label">
                  GENERATED MESSAGE
                </div>

                <div className="ai-message-box">
                  {aiMessage}
                </div>

                <div className="ai-modal-footer">

                  <span>
                    ✦ Generated locally with Ollama
                  </span>

                  <div>

                    <button
                      className="copy-button"
                      onClick={handleCopyMessage}
                    >
                      ▣ Copy Message
                    </button>

                    <button
                      className="cancel-button"
                      onClick={() => {
                        setShowAiModal(false);
                        setAiMessage("");
                      }}
                    >
                      Close
                    </button>

                  </div>

                </div>

              </>

            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default App;

