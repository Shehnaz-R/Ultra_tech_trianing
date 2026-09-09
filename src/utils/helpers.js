
// Toast event bus
export function showToast(message, type = 'info', title = null) {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('ops-toast', { detail: { message, type, title } });
    window.dispatchEvent(event);
  }
}

// 7-day Auto-Escalation SLA calculation
export function calculateCountdown(daysElapsed) {
  const daysLeft = Math.max(0, 7 - (daysElapsed || 0));
  if (daysElapsed >= 7 || daysLeft === 0) {
    return { status: 'Escalated to HR', overdue: true, daysLeft: 0, pillClass: 'status-escalated' };
  } else if (daysLeft <= 1) {
    return { status: 'Urgent', overdue: false, daysLeft, pillClass: 'status-resubmit' };
  } else if (daysLeft <= 3) {
    return { status: 'Warning', overdue: false, daysLeft, pillClass: 'status-pending' };
  } else {
    return { status: 'Safe', overdue: false, daysLeft, pillClass: 'status-completed' };
  }
}

// CSV Exporter (enforcing zero compensation fields)
export function downloadCSV(rows, filename) {
  const forbidden = ['salary', 'compensation', 'ctc', 'pay_scale', 'payroll'];
  const sanitizedRows = rows.map(row => 
    row.map(cell => {
      let str = String(cell || '').replace(/"/g, '""');
      forbidden.forEach(term => {
        const reg = new RegExp(term, 'gi');
        str = str.replace(reg, '[REDACTED]');
      });
      return `"${str}"`;
    })
  );

  const csvContent = "data:text/csv;charset=utf-8," + sanitizedRows.map(r => r.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast(`Exported ${filename} successfully! (Zero-compensation enforced)`, 'success');
}
