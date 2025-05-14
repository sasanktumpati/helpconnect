// Color constants for the application
export const COLORS = {
  primary: "#1249BF",
  primaryLight: "#3A6AD4",
  primaryDark: "#0D3790",

  // Add other colors as needed
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",

  // Neutral colors
  black: "#000000",
  white: "#FFFFFF",
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
}

// Helper function to convert hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

// Helper function to get RGB string
export function getRgbString(hex: string): string {
  const rgb = hexToRgb(hex)
  return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : ""
}

// Helper function to get RGBA string with opacity
export function getRgbaString(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex)
  return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})` : ""
}
