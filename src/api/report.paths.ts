import { API_BASE_PATHS, API_PATH_SEGMENTS } from '../constants/api.constants';

export const REPORTS_BASE_PATH = API_BASE_PATHS.reports;
export const REPORTS_ALL_PATH = `${REPORTS_BASE_PATH}/${API_PATH_SEGMENTS.all}`;
export const REPORTS_DAMAGE_ASSESSMENTS_PATH = `${REPORTS_BASE_PATH}/${API_PATH_SEGMENTS.damageAssessments}`;
export const REPORTS_ALL_DAMAGE_ASSESSMENTS_PATH = `${REPORTS_DAMAGE_ASSESSMENTS_PATH}/all`;
export const REPORTS_AI_ASSESSMENTS_PATH = `${REPORTS_BASE_PATH}/ai-assessments`;
export const buildReportPath = (reportId: string) => `${REPORTS_BASE_PATH}/${reportId}`;
