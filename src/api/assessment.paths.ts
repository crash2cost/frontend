import { API_BASE_PATHS, API_PATH_SEGMENTS } from '../constants/api.constants';

export const ASSESSMENTS_BASE_PATH = API_BASE_PATHS.assessments;
export const ASSESSMENTS_ALL_PATH = `${ASSESSMENTS_BASE_PATH}/${API_PATH_SEGMENTS.all}`;
export const buildAssessmentPath = (assessmentId: string) =>
  `${ASSESSMENTS_BASE_PATH}/${assessmentId}`;
export const buildAssessmentImagePath = (imageId: string) =>
  `${ASSESSMENTS_BASE_PATH}/${API_PATH_SEGMENTS.image}/${imageId}`;
