// Theme configuration file
// This is the central place to manage your website's theme colors

/**
 * Updates the theme variables at runtime
 * @param theme A partial theme object with the properties to update
 */
export function updateTheme(theme: Partial<ThemeConfig>) {
  const root = document.documentElement;
  
  // Update CSS variables based on provided theme
  Object.entries(theme).forEach(([key, value]) => {
    if (value && typeof value === 'object') {
      // Handle nested objects like primary.50, primary.100 etc.
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        const cssVarName = `--color-${key}-${nestedKey}`;
        if (nestedValue) {
          root.style.setProperty(cssVarName, nestedValue as string);
        }
      });
    } else if (key.includes('-')) {
      // Handle direct component variables like card-bg-gradient-from
      root.style.setProperty(`--${key}`, value as string);
    }
  });
  
  // Update component-specific variables if specified
  if (theme.components) {
    Object.entries(theme.components).forEach(([component, componentTheme]) => {
      Object.entries(componentTheme).forEach(([property, value]) => {
        const cssVarName = `--${component}-${property}`;
        root.style.setProperty(cssVarName, value as string);
      });
    });
  }
}

// Default theme settings
export const defaultTheme: ThemeConfig = {
  // Color palettes
  primary: {
    '50': '#ecfdf5',
    '100': '#d1fae5',
    '200': '#a7f3d0',
    '300': '#6ee7b7', 
    '400': '#34d399',
    '500': '#059669',
    '600': '#047857',
    '700': '#065f46',
    '800': '#064e3b',
    '900': '#022c22'
  },
  secondary: {
    '50': '#eff6ff',
    '100': '#dbeafe',
    '200': '#bfdbfe',
    '300': '#93c5fd',
    '400': '#60a5fa',
    '500': '#3b82f6',
    '600': '#2563eb',
    '700': '#1d4ed8',
    '800': '#1e40af',
    '900': '#1e3a8a'
  },
  
  // Component-specific
  components: {
    card: {
      'bg-gradient-from': 'var(--color-primary-50)',
      'bg-gradient-to': 'var(--color-secondary-50)',
      'border-color': 'var(--color-primary-200)',
      'icon-color': 'var(--color-primary-600)',
      'brutalism-border-color': 'var(--color-primary-200)'
    },
    button: {
      'primary-bg': 'var(--color-primary-600)',
      'primary-hover': 'var(--color-primary-700)',
      'secondary-bg': 'var(--color-secondary-600)',
      'secondary-hover': 'var(--color-secondary-700)'
    },
    badge: {
      'primary-bg': 'var(--color-primary-50)',
      'primary-text': 'var(--color-primary-700)',
      'secondary-bg': 'var(--color-secondary-50)',
      'secondary-text': 'var(--color-secondary-700)'
    },
    filter: {
      'button-bg': 'var(--color-secondary-500)',
      'button-hover': 'var(--color-secondary-600)'
    },
    link: {
      'color': 'var(--color-secondary-600)',
      'hover': 'var(--color-secondary-700)'
    }
  }
};

// Preset theme variations you can easily switch between
export const themePresets = {
  default: defaultTheme,
  
  // Blue theme 
  blue: {
    primary: {
      '50': '#eff6ff',
      '100': '#dbeafe',
      '200': '#bfdbfe',
      '300': '#93c5fd',
      '400': '#60a5fa',
      '500': '#3b82f6',
      '600': '#2563eb',
      '700': '#1d4ed8',
      '800': '#1e40af',
      '900': '#1e3a8a'
    },
    secondary: {
      '50': '#f0f9ff',
      '100': '#e0f2fe',
      '200': '#bae6fd',
      '300': '#7dd3fc',
      '400': '#38bdf8',
      '500': '#0ea5e9',
      '600': '#0284c7',
      '700': '#0369a1',
      '800': '#075985',
      '900': '#0c4a6e'
    },
    components: {
      card: {
        'bg-gradient-from': 'var(--color-primary-50)',
        'bg-gradient-to': 'var(--color-secondary-50)',
        'border-color': 'var(--color-primary-200)',
        'icon-color': 'var(--color-primary-600)',
        'brutalism-border-color': 'var(--color-primary-200)'
      }
    }
  },
  
  // Purple theme
  purple: {
    primary: {
      '50': '#faf5ff',
      '100': '#f3e8ff',
      '200': '#e9d5ff',
      '300': '#d8b4fe',
      '400': '#c084fc',
      '500': '#a855f7',
      '600': '#9333ea',
      '700': '#7e22ce',
      '800': '#6b21a8',
      '900': '#581c87'
    },
    secondary: {
      '50': '#f5f3ff',
      '100': '#ede9fe',
      '200': '#ddd6fe',
      '300': '#c4b5fd',
      '400': '#a78bfa',
      '500': '#8b5cf6',
      '600': '#7c3aed',
      '700': '#6d28d9',
      '800': '#5b21b6',
      '900': '#4c1d95'
    },
    components: {
      card: {
        'bg-gradient-from': 'var(--color-primary-50)',
        'bg-gradient-to': 'var(--color-secondary-50)',
        'border-color': 'var(--color-primary-200)',
        'icon-color': 'var(--color-primary-600)',
        'brutalism-border-color': 'var(--color-primary-200)'
      }
    }
  },
  
  // Amber theme
  amber: {
    primary: {
      '50': '#fffbeb',
      '100': '#fef3c7',
      '200': '#fde68a',
      '300': '#fcd34d',
      '400': '#fbbf24',
      '500': '#f59e0b',
      '600': '#d97706',
      '700': '#b45309',
      '800': '#92400e',
      '900': '#78350f'
    },
    secondary: {
      '50': '#fff7ed',
      '100': '#ffedd5',
      '200': '#fed7aa',
      '300': '#fdba74',
      '400': '#fb923c',
      '500': '#f97316',
      '600': '#ea580c',
      '700': '#c2410c',
      '800': '#9a3412',
      '900': '#7c2d12'
    },
    components: {
      card: {
        'bg-gradient-from': 'var(--color-primary-50)',
        'bg-gradient-to': 'var(--color-secondary-50)',
        'border-color': 'var(--color-primary-200)',
        'icon-color': 'var(--color-primary-600)',
        'brutalism-border-color': 'var(--color-primary-200)'
      }
    }
  }
};

// Theme configuration type definitions
export interface ThemeConfig {
  primary?: ColorPalette;
  secondary?: ColorPalette;
  accent?: ColorPalette;
  gray?: ColorPalette;
  success?: ColorPalette;
  warning?: ColorPalette;
  error?: ColorPalette;
  components?: {
    card?: ComponentTheme;
    button?: ComponentTheme;
    badge?: ComponentTheme;
    filter?: ComponentTheme;
    link?: ComponentTheme;
    [key: string]: ComponentTheme | undefined;
  };
  [key: string]: any;
}

interface ColorPalette {
  '50'?: string;
  '100'?: string;
  '200'?: string;
  '300'?: string;
  '400'?: string;
  '500'?: string;
  '600'?: string;
  '700'?: string;
  '800'?: string;
  '900'?: string;
  [key: string]: string | undefined;
}

interface ComponentTheme {
  [key: string]: string;
}