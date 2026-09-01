import codecs
try:
    with codecs.open(r'C:\Users\pichau\Desktop\prof-elena-rocha\index.html', 'r', 'utf-8') as f:
        text = f.read()
    print('Valid UTF-8!')
except UnicodeDecodeError:
    print('Invalid UTF-8!')
