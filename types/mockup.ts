export interface FrameZone {
  /** Position gauche (% du template) */
  x: number;
  /** Position haut (% du template) */
  y: number;
  /** Largeur zone (% du template) */
  width: number;
  /** Hauteur zone (% du template) */
  height: number;
  /** CSS perspective value */
  perspective?: number;
  /** Inclinaison X (angle du mur) */
  rotateX?: number;
  /** Inclinaison Y (angle latéral) */
  rotateY?: number;
}

export interface ShadowConfig {
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
}

export interface MockupTemplate {
  id: string;
  sizeName: string;
  label: string;
  labelEn: string;
  templateImageUrl: string;
  frameZone: FrameZone;
  shadowConfig?: ShadowConfig;
  /** Native image width (for correct aspect ratio rendering) */
  imageWidth?: number;
  /** Native image height (for correct aspect ratio rendering) */
  imageHeight?: number;
}
