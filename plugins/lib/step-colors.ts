// Tailwind CSS colors in order (simple tuple)
export const COLORS = [
  'red', // 1
  'orange', // 2
  'amber', // 3
  'yellow', // 4
  'lime', // 5
  'green', // 6
  'emerald', // 7
  'teal', // 8
  'cyan', // 9
  'sky', // 10
  'blue', // 11
  'indigo', // 12
  'violet', // 13
  'purple', // 14
  'fuchsia', // 15
  'pink', // 16
  'rose', // 17
  'slate', // 18
  'gray', // 19
  'zinc', // 20
  'neutral', // 21
  'stone', // 22
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