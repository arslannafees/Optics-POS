/**
 * @file fabrication.js
 * @description Schema for Lens Fabrication Jobs and Job History Logs.
 */

export function initFabrication(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS fabrication_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    shop_id INTEGER REFERENCES shops(id),
    branch_id INTEGER,
    status TEXT DEFAULT 'queued',
    priority TEXT DEFAULT 'normal',
    patient_name TEXT,
    frame_info TEXT,
    lens_info TEXT,
    prescription_data TEXT,
    optician_notes TEXT,
    fabricator_notes TEXT,
    flag_reason TEXT,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.exec(`CREATE TABLE IF NOT EXISTS fabrication_job_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL REFERENCES fabrication_jobs(id) ON DELETE CASCADE,
    status TEXT,
    note TEXT,
    updated_by INTEGER,
    updated_by_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Indexes for performance
  const idx = db.prepare("SELECT name FROM sqlite_master WHERE type='index' AND name=?");
  if (!idx.get('idx_fabrication_jobs_order_id')) {
    db.exec("CREATE INDEX idx_fabrication_jobs_order_id ON fabrication_jobs(order_id)");
  }
  if (!idx.get('idx_fabrication_jobs_shop_status')) {
    db.exec("CREATE INDEX idx_fabrication_jobs_shop_status ON fabrication_jobs(shop_id, status)");
  }
  if (!idx.get('idx_fabrication_job_logs_job_id')) {
    db.exec("CREATE INDEX idx_fabrication_job_logs_job_id ON fabrication_job_logs(job_id)");
  }
}
