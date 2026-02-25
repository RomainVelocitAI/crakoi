import type { MockupTemplate } from "@/types/mockup";

export const MOCKUP_TEMPLATES: MockupTemplate[] = [
  {
    id: "desk-postcard-s",
    sizeName: "S",
    label: "Carte postale sur un bureau",
    labelEn: "Postcard on a desk",
    templateImageUrl: "/mockup-templates/desk-postcard.png",
    imageWidth: 1344,
    imageHeight: 768,
    frameZone: {
      x: 11.5,
      y: 23,
      width: 8.5,
      height: 28,
    },
    shadowConfig: {
      offsetX: 2,
      offsetY: 3,
      blur: 8,
      color: "rgba(0,0,0,0.15)",
    },
  },
  {
    id: "nightstand-frame-m",
    sizeName: "M",
    label: "Cadre sur une table de chevet",
    labelEn: "Frame on a nightstand",
    templateImageUrl: "/mockup-templates/nightstand-frame.png",
    imageWidth: 2720,
    imageHeight: 1568,
    frameZone: {
      x: 76.5,
      y: 8,
      width: 15.0,
      height: 31.5,
    },
    shadowConfig: {
      offsetX: 2,
      offsetY: 4,
      blur: 10,
      color: "rgba(0,0,0,0.15)",
    },
  },
  {
    id: "livingroom-wall-l",
    sizeName: "L",
    label: "Grand tirage dans un salon",
    labelEn: "Large print in a living room",
    templateImageUrl: "/mockup-templates/livingroom-wall.png",
    imageWidth: 2720,
    imageHeight: 1568,
    frameZone: {
      x: 38.0,
      y: 27.0,
      width: 18.0,
      height: 21.3,
    },
    shadowConfig: {
      offsetX: 0,
      offsetY: 4,
      blur: 12,
      color: "rgba(0,0,0,0.1)",
    },
  },
  {
    id: "livingroom-wall-xl",
    sizeName: "XL",
    label: "Très grand tirage dans un espace ouvert",
    labelEn: "Extra large print in an open space",
    templateImageUrl: "/mockup-templates/livingroom-wall-xl.png",
    imageWidth: 2720,
    imageHeight: 1568,
    frameZone: {
      x: 35.2,
      y: 29.2,
      width: 25.8,
      height: 30.0,
    },
  },
];

export function getTemplateBySize(sizeName: string): MockupTemplate | undefined {
  return MOCKUP_TEMPLATES.find((t) => t.sizeName === sizeName);
}
