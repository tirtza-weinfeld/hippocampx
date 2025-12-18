/**
 * ER Diagram Constants
 *
 * Zoom limits and clamp utilities for canvas and table zoom.
 */

export const CANVAS_ZOOM = {
  min: 0.25,
  max: 2,
  step: 1.2,
} as const;

export const TABLE_ZOOM = {
  min: 1,
  max: 2.5,
  step: 1.15,
  preset: 1.5,
} as const;

export function clampCanvasScale(scale: number): number {
  return Math.min(Math.max(scale, CANVAS_ZOOM.min), CANVAS_ZOOM.max);
}

export function clampTableZoom(zoom: number): number {
  return Math.min(Math.max(zoom, TABLE_ZOOM.min), TABLE_ZOOM.max);
}
