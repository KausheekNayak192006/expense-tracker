import { useState, useCallback } from "react";

export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [error, setError] = useState("");

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const handleAdd = useCallback(() => {
    if (!description.trim()) return setError("Description is required.");
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0)
      return setError("Enter a positive amount.");
    setError("");
    setTransactions((prev) => [
      { id: Date.now(), description: description.trim(), amount: parsed, type },
      ...prev,
    ]);
    setDescription("");
    setAmount("");
  }, [description, amount, type]);

  const handleDelete = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fmt = (n) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div style={styles.root}>
      <style>{css}</style>

      <header style={styles.header}>
        <div style={styles.logo}>₿alance</div>
        <p style={styles.subtitle}>Personal Finance Tracker</p>
      </header>

      {/* Summary Cards */}
      <div style={styles.cards}>
        <div style={{ ...styles.card, ...styles.cardBalance }}>
          <span style={styles.cardLabel}>TOTAL BALANCE</span>
          <span style={{ ...styles.cardValue, color: balance >= 0 ? "#16a34a" : "#dc2626" }}>
            {balance < 0 ? "-" : ""}₹{fmt(Math.abs(balance))}
          </span>
        </div>
        <div style={{ ...styles.card, ...styles.cardIncome }}>
          <span style={styles.cardLabel}>INCOME</span>
          <span style={{ ...styles.cardValue, color: "#16a34a" }}>+₹{fmt(totalIncome)}</span>
        </div>
        <div style={{ ...styles.card, ...styles.cardExpense }}>
          <span style={styles.cardLabel}>EXPENSES</span>
          <span style={{ ...styles.cardValue, color: "#dc2626" }}>-₹{fmt(totalExpenses)}</span>
        </div>
      </div>

      {/* Form */}
      <div style={styles.formCard}>
        <h2 style={styles.formTitle}>New Transaction</h2>
        <div style={styles.formGrid}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Description</label>
            <input
              style={styles.input}
              placeholder="e.g. Salary, Coffee..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="fx-input"
            />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Amount (₹)</label>
            <input
              style={styles.input}
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="fx-input"
            />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Type</label>
            <select
              style={styles.select}
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="fx-input"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.btn} onClick={handleAdd} className="fx-btn">
          + Add Transaction
        </button>
      </div>

      {/* Transaction List */}
      <div style={styles.listSection}>
        <h2 style={styles.listTitle}>
          Transactions{" "}
          <span style={styles.badge}>{transactions.length}</span>
        </h2>
        {transactions.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>📋</div>
            <p>No transactions yet. Add one above!</p>
          </div>
        ) : (
          <ul style={styles.list}>
            {transactions.map((t, i) => (
              <li
                key={t.id}
                style={{
                  ...styles.item,
                  animationDelay: `₹{i * 0.04}s`,
                  borderLeft: `4px solid ₹{t.type === "income" ? "#16a34a" : "#dc2626"}`,
                }}
                className="fx-item"
              >
                <div style={styles.itemInfo}>
                  <span
                    style={{
                      ...styles.itemIcon,
                      background: t.type === "income" ? "#dcfce7" : "#fee2e2",
                      color: t.type === "income" ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {t.type === "income" ? "↑" : "↓"}
                  </span>
                  <div>
                    <span style={styles.itemDesc}>{t.description}</span>
                    <span style={styles.itemType}>{t.type}</span>
                  </div>
                </div>
                <div style={styles.itemRight}>
                  <span
                    style={{
                      ...styles.itemAmount,
                      color: t.type === "income" ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {t.type === "income" ? "+" : "-"}₹{fmt(t.amount)}
                  </span>
                  <button
                    style={styles.delBtn}
                    onClick={() => handleDelete(t.id)}
                    className="fx-del"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: #f1f5f9; }

  .fx-input:focus {
    outline: none;
    border-color: #6366f1 !important;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
  }
  .fx-btn:hover {
    background: #4f46e5 !important;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99,102,241,0.35) !important;
  }
  .fx-btn:active { transform: translateY(0); }
  .fx-del:hover { background: #fee2e2 !important; color: #dc2626 !important; }
  .fx-item {
    animation: slideIn 0.3s ease both;
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0); }
  }
`;

const styles = {
  root: {
    fontFamily: "'Syne', sans-serif",
    background: "#f1f5f9",
    minHeight: "100vh",
    color: "#1e293b",
    padding: "32px 16px 64px",
    maxWidth: 720,
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: 36,
  },
  logo: {
    fontSize: 38,
    fontWeight: 800,
    letterSpacing: "-1px",
    background: "linear-gradient(135deg, #6366f1, #16a34a)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#94a3b8",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    fontFamily: "'JetBrains Mono', monospace",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 14,
    marginBottom: 28,
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: "18px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  cardBalance: {
    gridColumn: "1 / -1",
    background: "linear-gradient(135deg, #ffffff, #f8faff)",
    border: "1px solid #c7d2fe",
  },
  cardIncome: {},
  cardExpense: {},
  cardLabel: {
    fontSize: 10,
    letterSpacing: "0.14em",
    color: "#94a3b8",
    fontFamily: "'JetBrains Mono', monospace",
    textTransform: "uppercase",
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 700,
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "-1px",
  },
  formCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: "24px 28px",
    marginBottom: 28,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 18,
    color: "#1e293b",
    letterSpacing: "-0.3px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 14,
    marginBottom: 14,
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 11,
    color: "#64748b",
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  input: {
    background: "#f8fafc",
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    color: "#1e293b",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 14,
    padding: "10px 14px",
    transition: "border-color 0.2s, box-shadow 0.2s",
    width: "100%",
  },
  select: {
    background: "#f8fafc",
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    color: "#1e293b",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 14,
    padding: "10px 14px",
    transition: "border-color 0.2s",
    width: "100%",
    cursor: "pointer",
  },
  error: {
    color: "#dc2626",
    fontSize: 12,
    marginBottom: 10,
    fontFamily: "'JetBrains Mono', monospace",
  },
  btn: {
    background: "#6366f1",
    border: "none",
    borderRadius: 10,
    color: "#fff",
    cursor: "pointer",
    fontSize: 14,
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    letterSpacing: "0.04em",
    padding: "12px 28px",
    transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
    width: "100%",
  },
  listSection: {},
  listTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: 14,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  badge: {
    background: "#e0e7ff",
    borderRadius: 20,
    color: "#6366f1",
    fontSize: 12,
    fontFamily: "'JetBrains Mono', monospace",
    padding: "2px 9px",
  },
  list: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  item: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    transition: "box-shadow 0.2s",
  },
  itemInfo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  itemIcon: {
    fontSize: 16,
    fontWeight: 700,
    lineHeight: 1,
    flexShrink: 0,
    width: 32,
    height: 32,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  itemDesc: {
    fontSize: 14,
    fontWeight: 600,
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: "#1e293b",
  },
  itemType: {
    fontSize: 10,
    color: "#94a3b8",
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    display: "block",
    marginTop: 2,
  },
  itemRight: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    flexShrink: 0,
  },
  itemAmount: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 15,
    fontWeight: 600,
  },
  delBtn: {
    background: "#f1f5f9",
    border: "none",
    borderRadius: 7,
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 700,
    padding: "5px 8px",
    transition: "background 0.15s, color 0.15s",
  },
  empty: {
    textAlign: "center",
    color: "#94a3b8",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    padding: "48px 0",
    background: "#ffffff",
    borderRadius: 12,
    border: "1px dashed #cbd5e1",
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
};