# -*- coding: utf-8 -*-
import io

def fix_file(filepath):
    with io.open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    replacements = {
        'Ã©': 'é', 'Ã³': 'ó', 'Ã£': 'ã', 'Ã§': 'ç', 'Ãµ': 'õ', 'Ãº': 'ú', 'Ã¢': 'â', 'Ãª': 'ê', 'Ã­': 'í', 
        'â€”': '—', 'â†’': '→', 'â†“': '↓', 'â¤ï¸': '❤️', 'ðŸ’³': '💳', 'ðŸ”¥': '🔥', 'ðŸ’›': '💛', 
        'âœ…': '✅', 'ðŸ“¦': '📦', 'ðŸŽ´': '🎴', 'ðŸ–¼ï¸': '🖼️', 'ðŸŽ': '🎁', 'ðŸŽ¨': '🎨', 'ðŸ‘•': '👕', 
        'ðŸ“±': '📱', 'ðŸŽ¡': '🎡', 'ðŸ“‹': '📋', 'ðŸ·ï¸': '🏷️', 'âœ✨': '✨', 'ðŸ‘‰': '👉', 'ðŸš€': '🚀', 
        'Â©': '©', 'Ã': 'í', 'âââââ': '⭐⭐⭐⭐⭐', 'Ã‚': 'Â', 'Ã”': 'Ô', 'Ã ': 'Á', 'Ãš': 'Ú'
    }
    
    for broken, fixed in replacements.items():
        text = text.replace(broken, fixed)
        
    with io.open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Replaced substrings!")

fix_file(r'C:\Users\pichau\Desktop\prof-elena-rocha\estilo-novo.css')