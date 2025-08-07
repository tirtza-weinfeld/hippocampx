// Tailwind CSS color order
const TAILWIND_COLORS = [
  'red',      // 1
  'orange',   // 2
  'amber',    // 3
  'yellow',   // 4
  'lime',     // 5
  'green',    // 6
  'emerald',  // 7
  'teal',     // 8
  'cyan',     // 9
  'sky',      // 10
  'blue',     // 11
  'indigo',   // 12
  'violet',   // 13
  'purple',   // 14
  'fuchsia',  // 15
  'pink',     // 16
  'rose',     // 17
  'brown',     // 18
  'gray',     // 19
];

// Color configurations for each Tailwind color
const COLOR_CONFIGS = {
  red: {
    text: 'text-red-600 dark:text-red-400 shadow-red-400/20 dark:shadow-red-300/20',
    gradient: 'from-red-500 to-red-600 via-red-800 dark:from-red-200 dark:to-red-200 dark:via-red-200',
    background: 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200',
  },
  orange: {
    text: 'text-orange-600 dark:text-orange-400 shadow-orange-400/20 dark:shadow-orange-300/20',
    gradient: 'from-orange-500 to-orange-600 via-orange-800 dark:from-orange-200 dark:to-orange-200 dark:via-orange-200',
    background: 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 text-orange-800 dark:text-orange-200',
  },
  amber: {
    text: 'text-amber-600 dark:text-amber-400 shadow-amber-400/20 dark:shadow-amber-300/20',
    gradient: 'from-amber-500 to-amber-600 via-amber-800 dark:from-amber-200 dark:to-amber-200 dark:via-amber-200',
    background: 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200',
  },
  yellow: {
    text: 'text-yellow-600 dark:text-yellow-400 shadow-yellow-400/20 dark:shadow-yellow-300/20',
    gradient: 'from-yellow-500 to-yellow-600 via-yellow-800 dark:from-yellow-200 dark:to-yellow-200 dark:via-yellow-200',
    background: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200',
  },
  lime: {
    text: 'text-lime-600 dark:text-lime-400 shadow-lime-400/20 dark:shadow-lime-300/20',
    gradient: 'from-lime-500 to-lime-600 via-lime-800 dark:from-lime-200 dark:to-lime-200 dark:via-lime-200',
    background: 'bg-lime-100 dark:bg-lime-900/30 border-lime-300 dark:border-lime-700 text-lime-800 dark:text-lime-200',
  },
  green: {
    text: 'text-green-600 dark:text-green-400 shadow-green-400/20 dark:shadow-green-300/20',
    gradient: 'from-green-500 to-green-600 via-green-800 dark:from-green-200 dark:to-green-200 dark:via-green-200',
    background: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200',
  },
  emerald: {
    text: 'text-emerald-600 dark:text-emerald-400 shadow-emerald-400/20 dark:shadow-emerald-300/20',
    gradient: 'from-emerald-500 to-emerald-600 via-emerald-800 dark:from-emerald-200 dark:to-emerald-200 dark:via-emerald-200',
    background: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200',
  },
  teal: {
    text: 'text-teal-600 dark:text-teal-400 shadow-teal-400/20 dark:shadow-teal-300/20',
    gradient: 'from-teal-500 to-teal-600 via-teal-800 dark:from-teal-200 dark:to-teal-200 dark:via-teal-200',
    background: 'bg-teal-100 dark:bg-teal-900/30 border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-200',
  },
  cyan: {
    text: 'text-cyan-600 dark:text-cyan-400 shadow-cyan-400/20 dark:shadow-cyan-300/20',
    gradient: 'from-cyan-500 to-cyan-600 via-cyan-800 dark:from-cyan-200 dark:to-cyan-200 dark:via-cyan-200',
    background: 'bg-cyan-100 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-700 text-cyan-800 dark:text-cyan-200',
  },
  sky: {
    text: 'text-sky-600 dark:text-sky-400 shadow-sky-400/20 dark:shadow-sky-300/20',
    gradient: 'from-sky-500 to-sky-600 via-sky-800 dark:from-sky-200 dark:to-sky-200 dark:via-sky-200',
    background: 'bg-sky-100 dark:bg-sky-900/30 border-sky-300 dark:border-sky-700 text-sky-800 dark:text-sky-200',
  },
  blue: {
    text: 'text-blue-600 dark:text-blue-400 shadow-blue-400/20 dark:shadow-blue-300/20',
    gradient: 'from-blue-500 to-blue-600 via-blue-800 dark:from-blue-200 dark:to-blue-200 dark:via-blue-200',
    background: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200',
  },
  indigo: {
    text: 'text-indigo-600 dark:text-indigo-400 shadow-indigo-400/20 dark:shadow-indigo-300/20',
    gradient: 'from-indigo-500 to-indigo-600 via-indigo-800 dark:from-indigo-200 dark:to-indigo-200 dark:via-indigo-200',
    background: 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700 text-indigo-800 dark:text-indigo-200',
  },
  violet: {
    text: 'text-violet-600 dark:text-violet-400 shadow-violet-400/20 dark:shadow-violet-300/20',
    gradient: 'from-violet-500 to-violet-600 via-violet-800 dark:from-violet-200 dark:to-violet-200 dark:via-violet-200',
    background: 'bg-violet-100 dark:bg-violet-900/30 border-violet-300 dark:border-violet-700 text-violet-800 dark:text-violet-200',
  },
  purple: {
    text: 'text-purple-600 dark:text-purple-400 shadow-purple-400/20 dark:shadow-purple-300/20',
    gradient: 'from-purple-500 to-purple-600 via-purple-800 dark:from-purple-200 dark:to-purple-200 dark:via-purple-200',
    background: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-200',
  },
  fuchsia: {
    text: 'text-fuchsia-600 dark:text-fuchsia-400 shadow-fuchsia-400/20 dark:shadow-fuchsia-300/20',
    gradient: 'from-fuchsia-500 to-fuchsia-600 via-fuchsia-800 dark:from-fuchsia-200 dark:to-fuchsia-200 dark:via-fuchsia-200',
    background: 'bg-fuchsia-100 dark:bg-fuchsia-900/30 border-fuchsia-300 dark:border-fuchsia-700 text-fuchsia-800 dark:text-fuchsia-200',
  },
  pink: {
    text: 'text-pink-600 dark:text-pink-400 shadow-pink-400/20 dark:shadow-pink-300/20',
    gradient: 'from-pink-500 to-pink-600 via-pink-800 dark:from-pink-200 dark:to-pink-200 dark:via-pink-200',
    background: 'bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700 text-pink-800 dark:text-pink-200',
  },
  rose: {
    text: 'text-rose-600 dark:text-rose-400 shadow-rose-400/20 dark:shadow-rose-300/20',
    gradient: 'from-rose-500 to-rose-600 via-rose-800 dark:from-rose-200 dark:to-rose-200 dark:via-rose-200',
    background: 'bg-rose-100 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200',
  },
  brown : {
    text: 'text-stone-600 dark:text-stone-400 shadow-stone-400/20 dark:shadow-stone-300/20',
    gradient: 'from-stone-500 to-stone-600 via-stone-800 dark:from-stone-200 dark:to-stone-200 dark:via-stone-200',
    background: 'bg-stone-100 dark:bg-stone-900/30 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200',
  },
  gray: {
    text: 'text-gray-600 dark:text-gray-400 shadow-gray-400/20 dark:shadow-gray-300/20',
    gradient: 'from-gray-500 to-gray-600 via-gray-800 dark:from-gray-200 dark:to-gray-200 dark:via-gray-200',
    background: 'bg-gray-100 dark:bg-gray-900/30 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200',
  },
} as const;

// Legacy arrays for backward compatibility (will be removed in future)
export const STEP_COLORS = TAILWIND_COLORS.map(color => COLOR_CONFIGS[color as keyof typeof COLOR_CONFIGS].text);
export const STEP_GRADIENTS = TAILWIND_COLORS.map(color => COLOR_CONFIGS[color as keyof typeof COLOR_CONFIGS].gradient);
export const STEP_BACKGROUNDS = TAILWIND_COLORS.map(color => COLOR_CONFIGS[color as keyof typeof COLOR_CONFIGS].background);

// New functions that support both numbers and color names
export const getStepColor = (stepNumber: number): string => {
  const colorName = TAILWIND_COLORS[(stepNumber - 1) % TAILWIND_COLORS.length];
  return COLOR_CONFIGS[colorName as keyof typeof COLOR_CONFIGS].text;
};

export const getStepGradient = (stepNumber: number): string => {
  const colorName = TAILWIND_COLORS[(stepNumber - 1) % TAILWIND_COLORS.length];
  return COLOR_CONFIGS[colorName as keyof typeof COLOR_CONFIGS].gradient;
};

export const getStepBackground = (stepNumber: number): string => {
  const colorName = TAILWIND_COLORS[(stepNumber - 1) % TAILWIND_COLORS.length];
  return COLOR_CONFIGS[colorName as keyof typeof COLOR_CONFIGS].background;
};

// New functions for color names
export const getColorText = (colorName: string): string => {
  const config = COLOR_CONFIGS[colorName as keyof typeof COLOR_CONFIGS];
  return config ? config.text : COLOR_CONFIGS.blue.text; // fallback to blue
};

export const getColorGradient = (colorName: string): string => {
  const config = COLOR_CONFIGS[colorName as keyof typeof COLOR_CONFIGS];
  return config ? config.gradient : COLOR_CONFIGS.blue.gradient; // fallback to blue
};

export const getColorBackground = (colorName: string): string => {
  const config = COLOR_CONFIGS[colorName as keyof typeof COLOR_CONFIGS];
  return config ? config.background : COLOR_CONFIGS.blue.background; // fallback to blue
};

// Helper to check if a string is a valid color name
export const isValidColorName = (colorName: string): boolean => {
  return colorName in COLOR_CONFIGS;
}; 