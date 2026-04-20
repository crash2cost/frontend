import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, User, AlertTriangle, CheckCircle, FileX, Trash2,
  ChevronLeft, ChevronRight, Search, Filter, ChevronDown, ChevronUp,
  Image as ImageIcon, X,
} from 'lucide-react';
import { reportApi, type DamageReport } from '../../api/report.api';
import { imageApi } from '../../api/image.api';
import { ADMIN_REPORTS_TEXT, ADMIN_MESSAGES } from './admin.constants';
import styles from './Admin.module.css';

type AdminReportsTabProps = {
  onToast: (message: string, variant: 'success' | 'error') => void;
};

type StatusFilter = 'all' | 'repairable' | 'totalLoss';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const AdminReportsTab = ({ onToast }: AdminReportsTabProps) => {
  const [reports, setReports] = useState<DamageReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [minCost, setMinCost] = useState('');
  const [maxCost, setMaxCost] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Expand
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Thumbnails
  const [thumbnails, setThumbnails] = useState<Map<string, string>>(new Map());
  const blobUrls = useRef<string[]>([]);

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      const response = await reportApi.getAllDamageReports(page, 20);
      setReports(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch {
      onToast(ADMIN_MESSAGES.loadFailed, 'error');
    } finally {
      setLoading(false);
    }
  }, [page, onToast]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  // Load thumbnails for visible reports
  useEffect(() => {
    const loadThumbnails = async () => {
      for (const report of reports) {
        if (report.imageId && !thumbnails.has(report.imageId)) {
          try {
            const blob = await imageApi.getImageBlob(report.imageId);
            const url = URL.createObjectURL(blob);
            blobUrls.current.push(url);
            setThumbnails(prev => new Map(prev).set(report.imageId, url));
          } catch {
            // Image not available
          }
        }
      }
    };
    if (reports.length > 0) loadThumbnails();
  }, [reports]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      blobUrls.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleDelete = async (report: DamageReport) => {
    if (!report.id || !confirm(ADMIN_REPORTS_TEXT.deleteConfirm)) return;
    try {
      await reportApi.adminDeleteReport(report.id);
      onToast(ADMIN_MESSAGES.reportDeleteSuccess, 'success');
      await loadReports();
    } catch {
      onToast(ADMIN_MESSAGES.reportDeleteFailed, 'error');
    }
  };

  // Client-side filtering on current page
  const filteredReports = reports.filter((report) => {
    if (searchQuery && !report.username?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (statusFilter === 'totalLoss' && !report.totalLoss) return false;
    if (statusFilter === 'repairable' && report.totalLoss) return false;
    const min = minCost ? parseFloat(minCost) : null;
    const max = maxCost ? parseFloat(maxCost) : null;
    if (min !== null && report.totalCost < min) return false;
    if (max !== null && report.totalCost > max) return false;
    return true;
  });

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading reports...</p>
      </div>
    );
  }

  if (reports.length === 0 && page === 0) {
    return (
      <div className={styles.emptyState}>
        <FileX size={48} className={styles.emptyIcon} />
        <h3 className={styles.emptyTitle}>{ADMIN_REPORTS_TEXT.emptyTitle}</h3>
        <p className={styles.emptyText}>{ADMIN_REPORTS_TEXT.emptyText}</p>
      </div>
    );
  }

  return (
    <motion.div variants={itemVariants}>
      {/* Toolbar */}
      <div className={styles.reportToolbar}>
        <div className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder={ADMIN_REPORTS_TEXT.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          className={`${styles.filterToggleBtn} ${showFilters ? styles.filterToggleBtnActive : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} />
          Filters
          {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            className={styles.filterBar}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Status</label>
              <div className={styles.filterToggles}>
                {(['all', 'repairable', 'totalLoss'] as StatusFilter[]).map((status) => (
                  <button
                    key={status}
                    className={`${styles.filterToggle} ${statusFilter === status ? styles.filterToggleActive : ''}`}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status === 'all' ? 'All' : status === 'repairable' ? 'Repairable' : 'Total Loss'}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Cost Range</label>
              <div className={styles.costRange}>
                <input
                  type="number"
                  className={styles.filterInput}
                  placeholder="Min"
                  value={minCost}
                  onChange={(e) => setMinCost(e.target.value)}
                />
                <span className={styles.filterRangeSep}>—</span>
                <input
                  type="number"
                  className={styles.filterInput}
                  placeholder="Max"
                  value={maxCost}
                  onChange={(e) => setMaxCost(e.target.value)}
                />
              </div>
            </div>
            {(searchQuery || statusFilter !== 'all' || minCost || maxCost) && (
              <button
                className={styles.clearFilters}
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setMinCost('');
                  setMaxCost('');
                }}
              >
                <X size={14} />
                Clear
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.reportResultInfo}>
        Showing {filteredReports.length} of {totalElements} reports
      </div>

      <div className={styles.reportsGrid}>
        {filteredReports.map((report) => {
          const isExpanded = expandedId === (report.id || report.imageId);
          return (
            <motion.div
              key={report.id || report.imageId}
              className={`${styles.reportCard} ${isExpanded ? styles.reportCardExpanded : ''}`}
              whileHover={!isExpanded ? { y: -4, transition: { duration: 0.2 } } : undefined}
              layout
            >
              {/* Thumbnail */}
              {report.imageId && thumbnails.has(report.imageId) ? (
                <div className={styles.reportThumbnail}>
                  <img
                    src={thumbnails.get(report.imageId)}
                    alt="Damage"
                    className={styles.reportThumbnailImg}
                  />
                </div>
              ) : report.imageId ? (
                <div className={styles.reportThumbnailPlaceholder}>
                  <ImageIcon size={24} />
                </div>
              ) : null}

              <div className={styles.reportHeader}>
                <div className={styles.reportDate}>
                  <Calendar size={14} />
                  {report.assessmentDate
                    ? new Date(report.assessmentDate).toLocaleDateString()
                    : 'N/A'}
                </div>
                <div className={styles.reportHeaderRight}>
                  {report.username && (
                    <div className={styles.ownerBadge}>
                      <User size={12} />
                      {report.username}
                    </div>
                  )}
                  <button
                    className={styles.reportDeleteBtn}
                    onClick={(e) => { e.stopPropagation(); handleDelete(report); }}
                    title="Delete report"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className={styles.reportCost}>
                <span className={styles.reportCostLabel}>Estimated Cost</span>
                <span className={styles.reportCostValue}>
                  {'\u20AA'}{report.totalCost.toLocaleString()}
                </span>
              </div>

              <div className={styles.reportStatusRow}>
                <span
                  className={`${styles.statusBadge} ${
                    report.totalLoss ? styles.totalLoss : styles.repairable
                  }`}
                >
                  {report.totalLoss ? (
                    <><AlertTriangle size={14} /> Total Loss</>
                  ) : (
                    <><CheckCircle size={14} /> Repairable</>
                  )}
                </span>
                {report.assessmentSource && (
                  <span className={styles.reportDamageTag}>
                    {report.assessmentSource}
                  </span>
                )}
                <button
                  className={styles.expandBtn}
                  onClick={() => setExpandedId(isExpanded ? null : (report.id || report.imageId || null))}
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              <AnimatePresence>
                {isExpanded && report.damageAreas && report.damageAreas.length > 0 && (
                  <motion.div
                    className={styles.reportDetails}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className={styles.reportDetailsTitle}>Damage Breakdown</div>
                    {report.damageAreas.map((area, i) => (
                      <div key={i} className={styles.reportDetailRow}>
                        <span className={styles.reportDetailArea}>{area.area}</span>
                        <div className={styles.reportDetailMeta}>
                          <span className={styles.reportDetailSeverity}>
                            Severity: {area.severity}/5
                          </span>
                          <span className={styles.reportDetailCost}>
                            {'\u20AA'}{area.cost.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <ChevronLeft size={16} />
          </button>
          <span className={styles.pageInfo}>
            Page {page + 1} of {totalPages}
          </span>
          <button
            className={styles.pageButton}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default AdminReportsTab;
