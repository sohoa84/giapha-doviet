import familyConfig from './family.config';

export function applyFamilyTheme() {
  const root = document.documentElement;
  const theme = familyConfig.theme || {};

  root.style.setProperty('--family-primary', theme.primary || '#922525');
  root.style.setProperty('--family-primary-dark', theme.primaryDark || '#721919');
  root.style.setProperty('--family-primary-soft', theme.primarySoft || '#fff0f0');
  root.style.setProperty('--family-accent', theme.accent || '#c89b3c');
  root.style.setProperty('--family-header-text', theme.headerText || '#ffffff');

  document.title = familyConfig.siteTitle || 'Gia phả điện tử';
}
