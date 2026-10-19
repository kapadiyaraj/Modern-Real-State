



import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  X,
  ExternalLink,
} from "lucide-react";

import "./AdminKYC.css";

const API_BASE = "http://localhost:5000";

const KYC_API = `${API_BASE}/api/subadmin/kyc`;

// ======================================================
// AUTH
// ======================================================

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("userToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("accessToken") ||
    "";

  const cleanToken = String(token)
    .replace(/^Bearer\s+/i, "")
    .trim();

  return cleanToken
    ? {
        Authorization: `Bearer ${cleanToken}`,
      }
    : {};
};

// ======================================================
// COMPONENT
// ======================================================

const AdminKYC = () => {
  const [kycList, setKycList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedKyc, setSelectedKyc] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // ======================================================
  // FETCH ALL KYC
  // ======================================================

  const fetchKYC = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${KYC_API}/all`, {
        method: "GET",
        headers: {
          ...getAuthHeaders(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch KYC requests"
        );
      }

      setKycList(data.data || []);
    } catch (error) {
      console.error("FETCH KYC ERROR:", error);
      alert(error.message || "Unable to load KYC requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKYC();
  }, []);

  // ======================================================
  // FILTER
  // ======================================================

  const filteredKyc = useMemo(() => {
    return kycList.filter((item) => {
      const status = String(item.status || "").toLowerCase();

      const user = item.userId || {};

      const searchableText = [
        item.firstName,
        item.lastName,
        item.phone,
        item.idNumber,
        item.panNumber,
        user.firstName,
        user.lastName,
        user.email,
        user.role,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(
        search.toLowerCase()
      );

      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [kycList, search, statusFilter]);

  // ======================================================
  // STATUS
  // ======================================================

  const getStatusClass = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "approved":
        return "approved";

      case "rejected":
        return "rejected";

      default:
        return "pending";
    }
  };

  // ======================================================
  // DOCUMENT URL
  // ======================================================

  const getDocumentUrl = (document) => {
    if (!document) return "";

    if (
      document.startsWith("http://") ||
      document.startsWith("https://")
    ) {
      return document;
    }

    return `${API_BASE}/${document.replace(/^\/+/, "")}`;
  };

  // ======================================================
  // CHECK IMAGE
  // ======================================================

  const isImageDocument = (document) => {
    if (!document) return false;

    return /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(
      document.split("?")[0]
    );
  };

  // ======================================================
  // OPEN DETAILS
  // ======================================================

  const openDetails = (item) => {
    setSelectedKyc(item);
    setShowModal(true);
  };

  // ======================================================
  // CLOSE DETAILS
  // ======================================================

  const closeDetails = () => {
    setShowModal(false);
    setSelectedKyc(null);
  };

  // ======================================================
  // APPROVE
  // ======================================================

  const approveKYC = async () => {
    if (!selectedKyc?._id) return;

    const confirmApprove = window.confirm(
      "Are you sure you want to approve this KYC?"
    );

    if (!confirmApprove) return;

    try {
      setActionLoading(true);

      const response = await fetch(
        `${KYC_API}/${selectedKyc._id}/approve`,
        {
          method: "PUT",
          headers: {
            ...getAuthHeaders(),
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "KYC approval failed"
        );
      }

      alert("KYC approved successfully");

      setShowModal(false);
      setSelectedKyc(null);

      await fetchKYC();
    } catch (error) {
      console.error("APPROVE KYC ERROR:", error);

      alert(
        error.message || "Unable to approve KYC"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ======================================================
  // OPEN REJECT MODAL
  // ======================================================

  const openRejectModal = (item = selectedKyc) => {
    if (!item?._id) return;

    setSelectedKyc(item);
    setRejectReason("");
    setRejectModal(true);
  };

  // ======================================================
  // REJECT
  // ======================================================

  const rejectKYC = async () => {
    if (!selectedKyc?._id) return;

    if (!rejectReason.trim()) {
      alert("Please enter rejection reason");
      return;
    }

    try {
      setActionLoading(true);

      const response = await fetch(
        `${KYC_API}/${selectedKyc._id}/reject`,
        {
          method: "PUT",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rejectionReason: rejectReason.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "KYC rejection failed"
        );
      }

      alert("KYC rejected successfully");

      setRejectModal(false);
      setShowModal(false);
      setSelectedKyc(null);
      setRejectReason("");

      await fetchKYC();
    } catch (error) {
      console.error("REJECT KYC ERROR:", error);

      alert(
        error.message || "Unable to reject KYC"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ======================================================
  // DOCUMENT VIEWER
  // ======================================================

  const renderDocument = (document, title) => {
    if (!document) {
      return (
        <div className="kyc-document-empty">
          <FileText size={22} />
          <span>No document uploaded</span>
        </div>
      );
    }

    const url = getDocumentUrl(document);
    const image = isImageDocument(document);

    return (
      <div className="kyc-document-card">
        <div className="kyc-document-title">
          <div>
            <strong>{title}</strong>
            <span>
              {image ? "Image Document" : "PDF Document"}
            </span>
          </div>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open full document"
          >
            <ExternalLink size={16} />
          </a>
        </div>

        <div className="kyc-document-preview">
          {image ? (
            <img
              src={url}
              alt={title}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement.innerHTML =
                  "<span>Unable to preview image</span>";
              }}
            />
          ) : (
            <iframe
              src={url}
              title={title}
              width="100%"
              height="280"
              style={{
                border: "none",
                borderRadius: "6px",
              }}
            />
          )}
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="kyc-document-view-btn"
        >
          <Eye size={15} />
          View Full Document
        </a>
      </div>
    );
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="admin-kyc-loading">
        <RefreshCw size={20} className="spin" />
        <span>Loading KYC requests...</span>
      </div>
    );
  }

  // ======================================================
  // COUNTS
  // ======================================================

  const pendingCount = kycList.filter(
    (item) =>
      String(item.status).toLowerCase() === "pending"
  ).length;

  const approvedCount = kycList.filter(
    (item) =>
      String(item.status).toLowerCase() === "approved"
  ).length;

  const rejectedCount = kycList.filter(
    (item) =>
      String(item.status).toLowerCase() === "rejected"
  ).length;

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="admin-kyc-page">
      {/* HEADER */}
      <div className="admin-kyc-header">
        <div>
          <h1>Sub-Admin KYC Verification</h1>

          <p>
            Review and manage KYC verification requests
            submitted by Sub-Admins.
          </p>
        </div>

        <button
          className="kyc-refresh-btn"
          onClick={fetchKYC}
          disabled={loading}
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* FILTERS */}
      <div className="kyc-filter-box">
        <div className="kyc-search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search by name, email, phone or ID..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* STATS */}
      <div className="kyc-stats">
        <div className="kyc-stat-card">
          <div className="kyc-stat-icon">
            <FileText size={21} />
          </div>

          <div>
            <span>Total KYC</span>
            <strong>{kycList.length}</strong>
          </div>
        </div>

        <div className="kyc-stat-card">
          <div className="kyc-stat-icon">
            <RefreshCw size={21} />
          </div>

          <div>
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </div>
        </div>

        <div className="kyc-stat-card">
          <div className="kyc-stat-icon">
            <CheckCircle size={21} />
          </div>

          <div>
            <span>Approved</span>
            <strong>{approvedCount}</strong>
          </div>
        </div>

        <div className="kyc-stat-card">
          <div className="kyc-stat-icon">
            <XCircle size={21} />
          </div>

          <div>
            <span>Rejected</span>
            <strong>{rejectedCount}</strong>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="kyc-table-wrapper">
        <table className="kyc-table">
          <thead>
            <tr>
              <th>Sub-Admin</th>
              <th>Email</th>
              <th>Phone</th>
              <th>ID Type</th>
              <th>Status</th>
              <th>Documents</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredKyc.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="kyc-empty-row"
                >
                  <FileText size={28} />
                  <span>
                    No KYC requests found.
                  </span>
                </td>
              </tr>
            ) : (
              filteredKyc.map((item) => {
                const user = item.userId || {};

                const fullName =
                  `${item.firstName || user.firstName || ""} ${
                    item.lastName || user.lastName || ""
                  }`.trim();

                return (
                  <tr key={item._id}>
                    <td>
                      <div className="kyc-user-name">
                        {fullName || "N/A"}
                      </div>
                    </td>

                    <td>
                      {user.email || "N/A"}
                    </td>

                    <td>
                      {item.phone || "N/A"}
                    </td>

                    <td>
                      {item.idType || "N/A"}
                    </td>

                    <td>
                      <span
                        className={`kyc-status ${getStatusClass(
                          item.status
                        )}`}
                      >
                        {item.status || "pending"}
                      </span>
                    </td>

                    <td>
                      <div className="kyc-document-mini">
                        {item.idDocument ? (
                          <span title="ID document available">
                            ID ✓
                          </span>
                        ) : (
                          <span>ID —</span>
                        )}

                        {item.addressProof ? (
                          <span title="Address proof available">
                            Address ✓
                          </span>
                        ) : (
                          <span>Address —</span>
                        )}
                      </div>
                    </td>

                    <td>
                      <button
                        className="kyc-view-btn"
                        onClick={() =>
                          openDetails(item)
                        }
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ==================================================
          DETAILS MODAL
      ================================================== */}

      {showModal && selectedKyc && (
        <div
          className="kyc-modal-overlay"
          onClick={closeDetails}
        >
          <div
            className="kyc-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* MODAL HEADER */}
            <div className="kyc-modal-header">
              <div>
                <h2>
                  KYC Verification Details
                </h2>

                <p>
                  Review Sub-Admin information and
                  uploaded documents.
                </p>
              </div>

              <button
                className="kyc-modal-close"
                onClick={closeDetails}
              >
                <X size={20} />
              </button>
            </div>

            {/* STATUS */}
            <div className="kyc-modal-status">
              <strong>Status</strong>

              <span
                className={`kyc-status ${getStatusClass(
                  selectedKyc.status
                )}`}
              >
                {selectedKyc.status || "pending"}
              </span>
            </div>

            {/* PERSONAL DETAILS */}
            <div className="kyc-detail-section">
              <h3>Personal Details</h3>

              <div className="kyc-detail-grid">
                <div>
                  <label>First Name</label>
                  <strong>
                    {selectedKyc.firstName ||
                      "N/A"}
                  </strong>
                </div>

                <div>
                  <label>Last Name</label>
                  <strong>
                    {selectedKyc.lastName ||
                      "N/A"}
                  </strong>
                </div>

                <div>
                  <label>Phone</label>
                  <strong>
                    {selectedKyc.phone || "N/A"}
                  </strong>
                </div>

                <div>
                  <label>Date of Birth</label>
                  <strong>
                    {selectedKyc.dateOfBirth ||
                      "N/A"}
                  </strong>
                </div>

                <div className="full">
                  <label>Address</label>
                  <strong>
                    {selectedKyc.address || "N/A"}
                  </strong>
                </div>

                <div>
                  <label>City</label>
                  <strong>
                    {selectedKyc.city || "N/A"}
                  </strong>
                </div>

                <div>
                  <label>State</label>
                  <strong>
                    {selectedKyc.state || "N/A"}
                  </strong>
                </div>

                <div>
                  <label>Pincode</label>
                  <strong>
                    {selectedKyc.pincode || "N/A"}
                  </strong>
                </div>
              </div>
            </div>

            {/* IDENTITY */}
            <div className="kyc-detail-section">
              <h3>Identity Verification</h3>

              <div className="kyc-detail-grid">
                <div>
                  <label>ID Type</label>
                  <strong>
                    {selectedKyc.idType ||
                      "N/A"}
                  </strong>
                </div>

                <div>
                  <label>ID Number</label>
                  <strong>
                    {selectedKyc.idNumber ||
                      "N/A"}
                  </strong>
                </div>

                <div>
                  <label>PAN Number</label>
                  <strong>
                    {selectedKyc.panNumber ||
                      "N/A"}
                  </strong>
                </div>
              </div>
            </div>

            {/* ==================================================
                DOCUMENTS
            ================================================== */}

            <div className="kyc-detail-section">
              <h3>KYC Documents</h3>

              <div className="kyc-document-grid">
                {renderDocument(
                  selectedKyc.idDocument,
                  "ID Document"
                )}

                {renderDocument(
                  selectedKyc.addressProof,
                  "Address Proof"
                )}
              </div>
            </div>

            {/* BANK DETAILS */}
            <div className="kyc-detail-section">
              <h3>Bank Details</h3>

              <div className="kyc-detail-grid">
                <div>
                  <label>
                    Account Holder Name
                  </label>

                  <strong>
                    {selectedKyc.accountHolderName ||
                      "N/A"}
                  </strong>
                </div>

                <div>
                  <label>Bank Name</label>

                  <strong>
                    {selectedKyc.bankName ||
                      "N/A"}
                  </strong>
                </div>

                <div>
                  <label>Account Number</label>

                  <strong>
                    {selectedKyc.accountNumber ||
                      "N/A"}
                  </strong>
                </div>

                <div>
                  <label>IFSC Code</label>

                  <strong>
                    {selectedKyc.ifscCode ||
                      "N/A"}
                  </strong>
                </div>

                <div>
                  <label>Branch Name</label>

                  <strong>
                    {selectedKyc.branchName ||
                      "N/A"}
                  </strong>
                </div>
              </div>
            </div>

            {/* REJECTION REASON */}
            {selectedKyc.status ===
              "rejected" &&
              selectedKyc.rejectionReason && (
                <div className="kyc-rejection-box">
                  <strong>
                    Rejection Reason
                  </strong>

                  <p>
                    {
                      selectedKyc.rejectionReason
                    }
                  </p>
                </div>
              )}

            {/* ACTIONS */}
            {String(
              selectedKyc.status
            ).toLowerCase() === "pending" && (
              <div className="kyc-modal-actions">
                <button
                  className="kyc-reject-btn"
                  onClick={() =>
                    openRejectModal(
                      selectedKyc
                    )
                  }
                  disabled={actionLoading}
                >
                  <XCircle size={16} />
                  Reject
                </button>

                <button
                  className="kyc-approve-btn"
                  onClick={approveKYC}
                  disabled={actionLoading}
                >
                  <CheckCircle size={16} />
                  {actionLoading
                    ? "Processing..."
                    : "Approve"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================
          REJECT MODAL
      ================================================== */}

      {rejectModal && selectedKyc && (
        <div className="kyc-modal-overlay">
          <div className="kyc-reject-modal">
            <div className="kyc-modal-header">
              <div>
                <h2>
                  Reject KYC
                </h2>

                <p>
                  Please provide a reason for
                  rejecting this KYC.
                </p>
              </div>

              <button
                className="kyc-modal-close"
                onClick={() =>
                  setRejectModal(false)
                }
              >
                <X size={20} />
              </button>
            </div>

            <textarea
              value={rejectReason}
              onChange={(e) =>
                setRejectReason(
                  e.target.value
                )
              }
              placeholder="Enter rejection reason..."
              rows={5}
            />

            <div className="kyc-modal-actions">
              <button
                className="kyc-cancel-btn"
                onClick={() =>
                  setRejectModal(false)
                }
                disabled={actionLoading}
              >
                Cancel
              </button>

              <button
                className="kyc-reject-btn"
                onClick={rejectKYC}
                disabled={actionLoading}
              >
                <XCircle size={16} />

                {actionLoading
                  ? "Rejecting..."
                  : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminKYC;