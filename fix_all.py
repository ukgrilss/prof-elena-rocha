import io
import re

html_path = r'C:\Users\pichau\Desktop\prof-elena-rocha\index.html'
css_path = r'C:\Users\pichau\Desktop\prof-elena-rocha\styles.css'

with io.open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Fix image paths
html = html.replace('\"images/', '\"imagems/')
# Fix checkout link
html = re.sub(r'https://pay\.hotmart\.com/[^\"]+', 'https://pay.lowify.com.br/checkout?product_id=adUzdE', html)
# Cache buster
html = re.sub(r'styles\.css(?:\?v=\d+)?', 'styles.css?v=100', html)

with io.open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)


with io.open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Mobile fixes
old_grid = '''  .hero-inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }'''
new_grid = '''  .hero-inner {
    display: flex;
    flex-direction: column;
    gap: 0;
  }'''
css = css.replace(old_grid, new_grid)

old_text = '''  .hero-text {
    text-align: center;
  }'''
new_text = '''  .hero-text {
    order: 1;
    text-align: center;
    padding-bottom: 24px;
  }'''
css = css.replace(old_text, new_text)

old_car = '''  .hero-carousel {
    order: -1;
    max-width: 360px;
    margin: 0 auto;
    width: 100%;
  }'''
new_car = '''  .hero-carousel {
    order: 2;
    max-width: 100%;
    margin: 0 auto;
    width: 100%;
  }'''
css = css.replace(old_car, new_car)

# Price alignment
old_price = '''.price-main {
  display: flex;
  align-items: baseline;
  gap: 4px;
  line-height: 1;
}'''
new_price = '''.price-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  line-height: 1;
}'''
css = css.replace(old_price, new_price)

with io.open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)

print('Success')
