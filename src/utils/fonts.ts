/**
 * Font class utilities for consistent typography across the app
 */

export const fonts = {
  nunito: 'font-nunito',
  homemadeApple: 'font-homemade-apple',
} as const;

/**
 * Combine font class with other classes
 * Usage: cx(fontClasses.heading, 'text-3xl')
 */
export const fontClasses = {
  heading: fonts.homemadeApple,
  body: fonts.nunito,
  button: fonts.nunito,
} as const;
