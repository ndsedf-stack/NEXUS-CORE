#!/usr/bin/env python3
"""
iOS Effects Fix Patch
Adds iOS-specific CSS optimizations for touch effects, animations, and glow
"""

import re

def patch_html_file(filepath):
    """Add iOS-optimized CSS to HTML file"""
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Find the closing </style> tag
    style_end = content.find('</style>')
    
    if style_end == -1:
        print(f"❌ No </style> found in {filepath}")
        return False
    
    # iOS-optimized CSS
    ios_css = """
    
    /* ========================================
       iOS OPTIMIZATIONS - TOUCH EFFECTS
       ======================================== */
    
    /* Force hardware acceleration on iOS */
    .touch-pop,
    .card-sheen,
    button,
    .animate-entry {
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      -webkit-perspective: 1000;
      perspective: 1000;
    }
    
    /* Enhanced touch feedback for iOS */
    .touch-pop {
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
      cursor: pointer;
      transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1),
                  box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .touch-pop:active {
      transform: scale(0.97) translateZ(0);
      box-shadow: 0 0 20px rgba(0, 234, 255, 0.4),
                  inset 0 0 20px rgba(0, 234, 255, 0.1);
    }
    
    /* Enhanced card sheen for iOS */
    .card-sheen {
      position: relative;
      overflow: hidden;
    }
    
    .card-sheen::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(
        circle at center,
        rgba(0, 234, 255, 0.15) 0%,
        transparent 70%
      );
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      z-index: 1;
    }
    
    .card-sheen:active::before {
      opacity: 1;
    }
    
    .card-sheen::after {
      transition: opacity 0.3s ease, transform 0.6s ease;
      will-change: opacity, transform;
    }
    
    .card-sheen:active::after {
      opacity: 1;
      transform: translateX(100%) translateZ(0);
    }
    
    /* Glow effects - enhanced for iOS */
    .text-shadow-cyan,
    [class*="text-shadow"] {
      text-shadow: 0 0 10px currentColor,
                   0 0 20px currentColor,
                   0 0 30px currentColor;
      -webkit-text-fill-color: currentColor;
    }
    
    /* Neon border glow */
    [class*="border-"][class*="cyan"],
    [class*="border-"][class*="magenta"] {
      box-shadow: 0 0 10px currentColor,
                  inset 0 0 10px rgba(255, 255, 255, 0.1);
    }
    
    /* Progress bar glow */
    #xp-bar,
    [id*="progress"] {
      box-shadow: 0 0 20px var(--cyan),
                  0 0 40px var(--cyan),
                  inset 0 0 10px rgba(255, 255, 255, 0.3);
      filter: brightness(1.2);
    }
    
    /* Button hover states for iOS (use touchstart) */
    button:active,
    [onclick]:active {
      transform: scale(0.95) translateZ(0);
      box-shadow: 0 0 15px rgba(0, 234, 255, 0.5);
      transition: all 0.1s ease;
    }
    
    /* Reactor core animation - iOS optimized */
    @keyframes reactor-pulse {
      0%, 100% { 
        transform: scale(1) translateZ(0);
        opacity: 0.6;
        filter: blur(20px) brightness(1);
      }
      50% { 
        transform: scale(1.1) translateZ(0);
        opacity: 1;
        filter: blur(25px) brightness(1.5);
      }
    }
    
    /* XP Flash animation - iOS optimized */
    @keyframes xp-flash {
      0% { 
        opacity: 0;
        transform: scale(0.8) translateY(20px) translateZ(0);
      }
      50% { 
        opacity: 1;
        transform: scale(1.1) translateY(-10px) translateZ(0);
      }
      100% { 
        opacity: 0;
        transform: scale(1) translateY(-30px) translateZ(0);
      }
    }
    
    .xp-flash {
      animation: xp-flash 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      will-change: transform, opacity;
    }
    
    /* Fade-in animations - iOS optimized */
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px) translateZ(0);
      }
      to {
        opacity: 1;
        transform: translateY(0) translateZ(0);
      }
    }
    
    .animate-entry {
      animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      opacity: 0;
    }
    
    /* Workout cards pulse */
    @keyframes card-pulse {
      0%, 100% {
        box-shadow: 0 0 20px rgba(0, 234, 255, 0.2);
      }
      50% {
        box-shadow: 0 0 40px rgba(0, 234, 255, 0.4),
                    0 0 60px rgba(0, 234, 255, 0.2);
      }
    }
    
    .card-active {
      animation: card-pulse 2s ease-in-out infinite;
    }
    
    /* iOS Safari specific fixes */
    @supports (-webkit-touch-callout: none) {
      /* Disable iOS rubber band effect on fixed elements */
      body {
        position: fixed;
        width: 100%;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
      }
      
      /* Better tap highlighting */
      * {
        -webkit-tap-highlight-color: rgba(0, 234, 255, 0.2);
      }
      
      /* Fix for iOS input zoom */
      input, select, textarea {
        font-size: 16px !important;
      }
    }
    
    /* Performance optimizations */
    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    """
    
    # Insert iOS CSS before </style>
    patched_content = content[:style_end] + ios_css + content[style_end:]
    
    with open(filepath, 'w') as f:
        f.write(patched_content)
    
    return True


def main():
    files = ['index.html', 'workouts.html', 'session.html', 'stats.html']
    
    print("🔧 Patching HTML files with iOS optimizations...\n")
    
    for file in files:
        try:
            if patch_html_file(file):
                print(f"✅ {file} - iOS effects added")
            else:
                print(f"⚠️  {file} - Skipped (no style tag found)")
        except FileNotFoundError:
            print(f"❌ {file} - File not found")
        except Exception as e:
            print(f"❌ {file} - Error: {e}")
    
    print("\n🎉 iOS optimization complete!")
    print("\nNext steps:")
    print("1. git add .")
    print("2. git commit -m '✨ Add iOS-optimized touch effects and animations'")
    print("3. git push origin main")
    print("4. Test on iPhone!")


if __name__ == "__main__":
    main()
