// design-system-comprehensive.ts

// Type definitions for precise styling control
export interface ColorStop {
  color: string;
  position: number;
}

export interface GradientConfig {
  type: 'linear' | 'radial';
  angle?: number;
  stops: ColorStop[];
}

export interface ShadowConfig {
  offsetX: number;
  offsetY: number;
  blurRadius: number;
  spreadRadius?: number;
  color: string;
}

export interface ComponentState {
  default: ComponentStyle;
  hover?: Partial<ComponentStyle>;
  active?: Partial<ComponentStyle>;
  disabled?: Partial<ComponentStyle>;
  focus?: Partial<ComponentStyle>;
}

export interface ComponentStyle {
  background?: string | GradientConfig;
  border?: string;
  borderRadius?: number | string;
  shadow?: ShadowConfig;
  color?: string;
  padding?: string;
  margin?: string;
}

// Comprehensive Design System Configuration
export const mentalWellnessDesignSystem = {
  // Precise Color Mappings by Context
  colorSystem: {
    // Emotion-specific color schemes
    emotions: {
      happy: {
        primary: "#FFB3D1",
        secondary: "#FF8FB3",
        background: "#FFF0F5",
        circle: "#FFB3D1",
        circleAccent: "#FF69B4"
      },
      calm: {
        primary: "#A8E6CF",
        secondary: "#7ED4AD",
        background: "#F0FFF4",
        circle: "#A8E6CF",
        circleAccent: "#20B2AA"
      },
      neutral: {
        primary: "#E8E8E8",
        secondary: "#D3D3D3",
        background: "#F8F8F8",
        circle: "#E8E8E8",
        circleAccent: "#A9A9A9"
      }
    },

    // System colors for UI elements
    system: {
      background: {
        light: "#FFFFFF",
        dark: "#1A1A1A",
        overlay: "rgba(0, 0, 0, 0.8)"
      },
      text: {
        primary: "#FFFFFF",
        secondary: "#666666",
        accent: "#333333",
        onDark: "#FFFFFF",
        onLight: "#1A1A1A"
      },
      interactive: {
        primary: "#007AFF",
        secondary: "#5AC8FA",
        success: "#34C759",
        warning: "#FF9500",
        error: "#FF3B30"
      }
    }
  },

  // Element-specific styling with precise color application
  elementStyling: {
    // Emotion Circle Component
    emotionCircle: {
      container: {
        default: {
          background: "transparent",
          borderRadius: "50%",
          shadow: {
            offsetX: 0,
            offsetY: 8,
            blurRadius: 24,
            color: "rgba(0, 0, 0, 0.15)"
          },
          padding: "0px",
          margin: "auto"
        }
      },
      circle: {
        happy: {
          default: {
            background: "#FFB3D1",
            border: "none",
            borderRadius: "50%"
          }
        },
        calm: {
          default: {
            background: "#A8E6CF",
            border: "none", 
            borderRadius: "50%"
          }
        },
        neutral: {
          default: {
            background: "#E8E8E8",
            border: "none",
            borderRadius: "50%"
          }
        }
      },
      face: {
        strokeColor: "#000000",
        strokeWidth: "2px",
        fill: "none"
      }
    },

    // Card Components
    cards: {
      onboardingCard: {
        container: {
          default: {
            background: "#FFFFFF",
            border: "none",
            borderRadius: "16px",
            shadow: {
              offsetX: 0,
              offsetY: 4,
              blurRadius: 8,
              color: "rgba(0, 0, 0, 0.08)"
            },
            padding: "32px 24px"
          }
        },
        icon: {
          background: "#2766E1",
          borderRadius: "50%",
          size: "72px"
        },
        title: {
          color: "#222222",
          fontSize: "24pt",
          fontWeight: "700",
          textAlign: "center",
          margin: "20px 0 12px 0"
        },
        subtitle: {
          color: "#666666",
          fontSize: "14pt",
          fontWeight: "400",
          textAlign: "center",
          maxWidth: "260px"
        }
      },
      
      activityCard: {
        container: {
          default: {
            background: "#2C2C2E",
            border: "none",
            borderRadius: "16px",
            shadow: {
              offsetX: 0,
              offsetY: 2,
              blurRadius: 8,
              color: "rgba(0, 0, 0, 0.1)"
            },
            padding: "16px"
          },
          hover: {
            background: "#3C3C3E",
            shadow: {
              offsetX: 0,
              offsetY: 4,
              blurRadius: 16,
              color: "rgba(0, 0, 0, 0.2)"
            }
          }
        },
        title: {
          color: "#FFFFFF",
          // DO NOT apply card background colors to text
        },
        subtitle: {
          color: "#999999",
          // DO NOT apply card shadow to text elements
        }
      },

      specialCard: {
        container: {
          default: {
            background: {
              type: 'linear',
              angle: 135,
              stops: [
                { color: "#5AC8FA", position: 0 },
                { color: "#007AFF", position: 100 }
              ]
            } as GradientConfig,
            border: "none",
            borderRadius: "16px",
            shadow: {
              offsetX: 0,
              offsetY: 4,
              blurRadius: 12,
              color: "rgba(90, 200, 250, 0.3)"
            },
            padding: "20px"
          }
        },
        content: {
          color: "#FFFFFF",
          // DO NOT apply gradient backgrounds to content text
        },
        playIcon: {
          background: "rgba(255, 255, 255, 0.2)",
          color: "#FFFFFF",
          borderRadius: "50%",
          // DO NOT apply card gradients to icons
        }
      }
    },

    // Button Components with State Management
    buttons: {
      primary: {
        default: {
          background: "#FFFFFF",
          color: "#1A1A1A",
          border: "none",
          borderRadius: "24px",
          padding: "12px 32px",
          shadow: {
            offsetX: 0,
            offsetY: 2,
            blurRadius: 4,
            color: "rgba(0, 0, 0, 0.1)"
          }
        },
        hover: {
          background: "#F0F0F0",
          shadow: {
            offsetX: 0,
            offsetY: 4,
            blurRadius: 8,
            color: "rgba(0, 0, 0, 0.15)"
          }
        },
        active: {
          background: "#E0E0E0",
          shadow: {
            offsetX: 0,
            offsetY: 1,
            blurRadius: 2,
            color: "rgba(0, 0, 0, 0.2)"
          }
        }
      },

      secondary: {
        default: {
          background: "transparent",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "0px",
          padding: "8px 16px"
        },
        hover: {
          color: "#E0E0E0"
        }
      },

      emotionSelector: {
        default: {
          background: "#48484A",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "20px",
          padding: "8px 16px"
        },
        active: {
          // Context-specific: Anxiety gets blue, other emotions get respective colors
          anxiety: {
            background: "#5AC8FA",
            color: "#FFFFFF"
          },
          apathy: {
            background: "#A8E6CF",
            color: "#1A1A1A"
          }
        },
        hover: {
          background: "#58585A"
        }
      }
    },

    // Navigation and Tab Components
    navigation: {
      tabBar: {
        container: {
          default: {
            background: "rgba(255, 255, 255, 0.95)",
            border: "none",
            borderRadius: "0px",
            shadow: {
              offsetX: 0,
              offsetY: -1,
              blurRadius: 4,
              color: "rgba(0, 0, 0, 0.1)"
            }
          }
        },
        icons: {
          default: {
            color: "#8E8E93",
            background: "none"
            // DO NOT apply tab bar background to individual icons
          },
          active: {
            color: "#007AFF",
            background: "none"
          }
        }
      },

      profileIcon: {
        container: {
          default: {
            background: "transparent",
            border: "2px solid #FFFFFF",
            borderRadius: "50%"
          }
        },
        // DO NOT apply navigation colors to profile images
      }
    },

    // Background Treatments by Screen Type
    screenBackgrounds: {
      moodSelection: {
        happy: {
          background: "#FFB3D1",
          overlay: "rgba(0, 0, 0, 0.4)"
          // Overlay applies to bottom section only, not entire screen
        },
        calm: {
          background: "#A8E6CF", 
          overlay: "rgba(0, 0, 0, 0.4)"
        },
        worried: {
          background: "#1A1A1A",
          overlay: "none"
        }
      },

      dashboard: {
        background: "#F2F2F7",
        // DO NOT apply mood colors to dashboard background
      }
    },

    // Text Hierarchy with Precise Color Application
    typography: {
      screenTitle: {
        color: "#FFFFFF",
        // Applied to questions like "How do you feel today?"
        // DO NOT use for card content or button text
      },
      cardTitle: {
        color: "#FFFFFF",
        // Applied specifically to card headings
      },
      cardSubtitle: {
        color: "#999999",
        // Applied to duration/time indicators in cards
      },
      tagText: {
        color: "#FFFFFF",
        // Applied to emotion selector buttons
        // DO NOT apply card colors to tags
      },
      bodyText: {
        color: "#1A1A1A",
        // Applied to settings menu items and general content
      }
    }
  },

  // Component Animations and Interactions
  interactions: {
    emotionCircle: {
      idle: "gentle pulse animation (scale 1.0 to 1.02)",
      tap: "scale down to 0.95, then bounce back to 1.0"
    },
    buttons: {
      tap: "scale down to 0.96, duration 150ms",
      release: "scale back to 1.0, duration 200ms with ease-out"
    },
    cards: {
      hover: "elevate shadow, duration 200ms",
      tap: "slight scale down to 0.98"
    },
    emotionTags: {
      selection: "smooth color transition 300ms, scale up to 1.05 then back to 1.0"
    }
  },

  // Visual Effect Rules and Restrictions
  visualEffectRules: {
    shadows: {
      // ONLY apply to these elements:
      applyTo: ["cards", "buttons", "emotionCircles", "tabBar"],
      // NEVER apply to these elements:
      doNotApplyTo: ["text", "icons", "gradients", "overlays"]
    },
    
    gradients: {
      // ONLY apply to these contexts:
      applyTo: ["specialCards", "screenBackgrounds"],
      // NEVER apply to these elements:
      doNotApplyTo: ["buttons", "emotionCircles", "text", "icons", "navigationElements"]
    },

    borderRadius: {
      // Element-specific radius values:
      emotionCircles: "50%",
      cards: "16px", 
      buttons: "24px",
      emotionTags: "20px",
      profileImages: "50%"
    }
  },

  // Critical "DO NOT" Rules for AI Implementation
  preventMisapplication: {
    colorMisuse: [
      "DO NOT apply emotion circle colors to card backgrounds",
      "DO NOT apply card gradient backgrounds to button elements", 
      "DO NOT apply button colors to text elements",
      "DO NOT apply screen background colors to individual components",
      "DO NOT use navigation icon colors for action buttons"
    ],
    
    effectMisuse: [
      "DO NOT apply card shadows to text elements",
      "DO NOT apply screen gradients to small UI components",
      "DO NOT apply emotion circle animations to static text",
      "DO NOT use button border radius on card containers",
      "DO NOT apply overlay colors as primary backgrounds"
    ],

    contextMisuse: [
      "DO NOT use mood-specific colors outside their emotional context",
      "DO NOT apply dashboard styling to mood selection screens", 
      "DO NOT use card styling patterns for button components",
      "DO NOT apply tab bar treatments to main content areas"
    ]
  },

  // Implementation Guidelines for Cursor AI
  implementationContext: {
    // When creating onboarding screens:
    onboardingScreens: {
      backgroundRule: "Use pure white (#FFFFFF) background for clean, minimal layout",
      cardRule: "Full-width white card with 16px corner radius and soft 8px blur shadow",
      iconRule: "72px circle in sky blue (#2766E1) with white person-plus icon",
      typographyRule: "Bold 24pt charcoal (#222) title, regular 14pt gray (#666) subtitle with 260px max-width",
      paddingRule: "32px top/bottom, 24px left/right internal padding"
    },

    // When creating emotion selection screens:
    emotionScreens: {
      backgroundRule: "Use emotion-specific background color for entire screen",
      overlayRule: "Apply dark overlay (rgba(0,0,0,0.4)) only to bottom 30% for text readability",
      circleRule: "Center emotion circle with matching emotion color, no gradient",
      buttonRule: "Use white primary button with dark text for contrast"
    },

    // When creating activity cards:
    activityCards: {
      containerRule: "Dark background (#2C2C2E) with 16px border radius and subtle shadow",
      contentRule: "White text for titles, gray (#999999) for subtitles",
      iconRule: "White icons on transparent or light overlay background, never inherit card background"
    },

    // When creating navigation elements:
    navigationElements: {
      tabBarRule: "Light background with top shadow, individual icons change color only",
      profileRule: "Circular with white border, never apply system colors to profile image itself"
    }
  }

} as const;

// Export type for external usage
export type DesignSystem = typeof mentalWellnessDesignSystem;

// Utility functions for safe style application
export const getEmotionColors = (emotion: 'happy' | 'calm' | 'neutral') => {
  return mentalWellnessDesignSystem.colorSystem.emotions[emotion];
};

export const getComponentStyle = (component: string, element: string, state: string = 'default') => {
  const elementPath = mentalWellnessDesignSystem.elementStyling[component as keyof typeof mentalWellnessDesignSystem.elementStyling];
  return elementPath?.[element as keyof typeof elementPath]?.[state as keyof any];
};

export const validateColorApplication = (targetElement: string, colorType: string): boolean => {
  // Validation logic to prevent misapplication
  const restrictions = mentalWellnessDesignSystem.preventMisapplication;
  // Implementation would check against DO NOT rules
  return true; // Simplified for example
};

export default mentalWellnessDesignSystem;