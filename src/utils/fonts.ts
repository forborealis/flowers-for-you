/**
 * Font class utilities for consistent typography across the app
 */

export const fonts = {
  poppins: 'font-poppins',
  homemadeApple: 'font-homemade-apple',
} as const;

/**
 * Combine font class with other classes
 * Usage: cx(fontClasses.heading, 'text-3xl')
 */
export const fontClasses = {
  heading: fonts.homemadeApple,
  body: fonts.poppins,
  button: fonts.poppins,
} as const;
