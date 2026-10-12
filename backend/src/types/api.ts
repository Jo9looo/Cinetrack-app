/**
 * Standard API response envelope used across all CineTrack endpoints.
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
