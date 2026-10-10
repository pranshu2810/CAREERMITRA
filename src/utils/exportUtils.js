// Export utilities: PDF generation and share link creation
import jsPDF from 'jspdf';

/**
 * Export a career roadmap as a PDF document.
 */
export async function exportRoadmapPDF(roadmap, career) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = margin;

  // ── Helper: check page overflow ──
  const checkPage = (needed = 10) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // ── Header ──
  doc.setFillColor(14, 10, 46);
  doc.rect(0, 0, pageW, 45, 'F');

  doc.setTextColor(196, 181, 253);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('CareerMitra', margin, 18);

  doc.setTextColor(240, 236, 255);
  doc.setFontSize(14);
  doc.text(`${career.icon || ''} ${career.title} — Career Roadmap`, margin, 30);

  doc.setTextColor(168, 160, 204);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date(roadmap.generatedAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}  |  Skill Match: ${roadmap.skillMatch}%  |  Timeline: ${roadmap.timelineMonths} months`, margin, 40);

  y = 58;

  // ── AI Summary ──
  doc.setFillColor(22, 18, 62);
  doc.roundedRect(margin, y, contentW, 36, 4, 4, 'F');
  doc.setTextColor(167, 139, 250);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('AI Summary', margin + 6, y + 8);
  doc.setTextColor(200, 195, 230);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const summaryLines = doc.splitTextToSize(roadmap.aiSummary || '', contentW - 12);
  doc.text(summaryLines.slice(0, 3), margin + 6, y + 16);
  y += 44;

  // ── Stats ──
  const stats = [
    { label: 'Avg Salary', value: career.avgSalary },
    { label: 'Growth Rate', value: career.growthRate },
    { label: 'Demand', value: career.demand },
    { label: 'Category', value: career.category },
  ];
  const colW = contentW / stats.length;
  stats.forEach((stat, i) => {
    const sx = margin + i * colW;
    doc.setFillColor(16, 12, 48);
    doc.roundedRect(sx, y, colW - 3, 18, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(240, 236, 255);
    doc.text(stat.value, sx + (colW - 3) / 2, y + 8, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(168, 160, 204);
    doc.text(stat.label.toUpperCase(), sx + (colW - 3) / 2, y + 15, { align: 'center' });
  });
  y += 26;

  // ── Roadmap Phases ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(196, 181, 253);
  doc.text('Learning Roadmap', margin, y);
  y += 8;

  roadmap.phases.forEach((phase, pi) => {
    checkPage(40);

    // Phase header bar
    doc.setFillColor(30, 24, 80);
    doc.roundedRect(margin, y, contentW, 12, 3, 3, 'F');
    doc.setTextColor(196, 181, 253);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`Phase ${pi + 1}: ${phase.phase}  |  ${phase.duration}`, margin + 5, y + 8);
    y += 16;

    // Tasks
    const tasks = phase.tasks || [];
    tasks.forEach((task, ti) => {
      checkPage(8);
      const taskTitle = typeof task === 'object' ? (task.title || String(task)) : String(task);
      const priority = typeof task === 'object' ? task.priority : 'learn';
      const hours = typeof task === 'object' ? task.estimatedHours : 15;

      doc.setFillColor(12, 9, 36);
      doc.rect(margin + 4, y, contentW - 4, 7, 'F');
      doc.setTextColor(240, 236, 255);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text(`□  ${taskTitle}`, margin + 8, y + 5);
      doc.setTextColor(100, 100, 150);
      doc.setFontSize(7.5);
      doc.text(`${priority}  ~${hours}h`, pageW - margin - 2, y + 5, { align: 'right' });
      y += 9;
    });
    y += 4;
  });

  // ── Recommendations ──
  if (roadmap.recommendations?.length) {
    checkPage(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(103, 232, 249);
    doc.text('AI Recommendations', margin, y);
    y += 7;
    roadmap.recommendations.forEach((rec) => {
      checkPage(8);
      const lines = doc.splitTextToSize(rec, contentW - 8);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(200, 195, 230);
      doc.text(lines, margin + 4, y);
      y += lines.length * 5 + 3;
    });
  }

  // ── Footer ──
  doc.setFillColor(14, 10, 46);
  doc.rect(0, pageH - 14, pageW, 14, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 95, 140);
  doc.text('CareerMitra — Navigate Your Career Galaxy | careermitra.app', pageW / 2, pageH - 5, { align: 'center' });

  // ── Save ──
  doc.save(`CareerMitra_${career.title.replace(/\s+/g, '_')}_Roadmap.pdf`);
}

/**
 * Generate a shareable text summary of a roadmap.
 */
export function generateShareText(roadmap, career) {
  return `🚀 My CareerMitra AI Roadmap for ${career.title}

📊 Skill Match: ${roadmap.skillMatch}%
📅 Timeline: ${roadmap.timelineMonths} months
📈 Growth: ${career.growthRate} | 💰 ${career.avgSalary}

🗺️ Phases:
${roadmap.phases.map((p, i) => `  ${i + 1}. ${p.phase} (${p.duration})`).join('\n')}

💡 Tip: "${roadmap.recommendations?.[0] || 'Stay consistent!'}"

Start your journey at careermitra.app`;
}
