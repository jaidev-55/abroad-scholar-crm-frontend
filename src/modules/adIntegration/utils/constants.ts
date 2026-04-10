import type { ElementType } from "react";
import { RiMetaLine, RiGoogleLine } from "react-icons/ri";

export interface PlatformConfig {
  icon: ElementType;
  color: string;
  bg: string;
  border: string;
  tag: string;
  label: string;
}

export const PLATFORM_CONFIG: Record<string, PlatformConfig> = {
  META: {
    icon: RiMetaLine,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    tag: "blue",
    label: "Meta Ads",
  },
  GOOGLE: {
    icon: RiGoogleLine,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    tag: "green",
    label: "Google Ads",
  },
};
