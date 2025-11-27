#!/usr/bin/env python3
"""
Fix iOS scroll blocking issue
Removes the problematic 'position: fixed' from body in iOS CSS
"""

import re

def fix_file(filepath):
    """Remove position: fixed from iOS-specific CSS"""
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"⚠️  {filepath} - File not found")
        return False
    
    # Pattern to find and replace the problematic CSS
    pattern = r'(@supports \(-webkit-touch-callout: none\) \{[\s\S]*?body \{[^}]*?)position: fixed;([^}]*?width: 100%;[^}]*?overflow-y: scroll;)'
    
    replacement = r'\1\2'  # Remove position: fixed but keep the rest
    
    # Also simplify to just keep -webkit-overflow-scrolling
    simplified_pattern = r'@supports \(-webkit-touch-callout: none\) \{[\s\S]*?/\* Disable iOS rubber band effect on fixed elements \*/[\s\S]*?body \{[\s\S]*?position: fixed;[\s\S]*?width: 100%;[\s\S]*?overflow-y: scroll;[\s\S]*?-webkit-overflow-scrolling: touch;[\s\S]*?\}'
    
    simplified_replacement = '''@supports (-webkit-touch-callout: none) {
      /* iOS smooth scrolling */
      body {
        -webkit-overflow-scrolling: touch;
      }'''
    
    new_content = re.sub(simplified_pattern, simplified_replacement, content)
    
    if new_content == content:
        # Try simpler pattern
        new_content = content.replace(
            'position: fixed;\n        width: 100%;\n        overflow-y: scroll;',
            '/* position: fixed; REMOVED - blocks scroll */\n        /* width: 100%; */\n        /* overflow-y: scroll; */'
        )
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✅ {filepath} - Scroll fixed!")
        return True
    else:
        print(f"ℹ️  {filepath} - No changes needed or pattern not found")
        return False


def main():
    files = ['index.html', 'workouts.html', 'session.html', 'stats.html']
    
    print("🔧 Fixing iOS scroll blocking issue...\n")
    
    fixed_count = 0
    for file in files:
        if fix_file(file):
            fixed_count += 1
    
    print(f"\n✅ Fixed {fixed_count} files!")
    print("\nManual fix if script didn't work:")
    print("In each HTML file, find this CSS:")
    print("""
    @supports (-webkit-touch-callout: none) {
      body {
        position: fixed;  ← DELETE THIS LINE
        width: 100%;      ← DELETE THIS LINE
        overflow-y: scroll; ← DELETE THIS LINE
        -webkit-overflow-scrolling: touch; ← KEEP THIS LINE
      }
    }
    """)


if __name__ == "__main__":
    main()
