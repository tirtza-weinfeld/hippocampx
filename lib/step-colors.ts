// Tailwind CSS colors in order (simple tuple)
export const COLORS = [
  'red',
  'orange', 
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
] as const;

// Type for valid color names
export type ColorName = typeof COLORS[number];







// Helper functions
export const getStepColor = (stepNumber: number): ColorName => {
  return COLORS[(stepNumber - 1) % COLORS.length];
};

export const getColorStep = (colorName: ColorName): number => {
  return COLORS.indexOf(colorName) + 1;
};

export const isValidColorName = (colorName: string): colorName is ColorName => {
  return COLORS.includes(colorName as ColorName);
}; 

export const isValidStepNumber = (stepNumber: number): stepNumber is number => {
  return stepNumber >= 1 && stepNumber <= COLORS.length;
}; 