import os, sys, urllib.request

checkpoint_dir = r'C:\Users\Admin\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.11_qbz5n2kfra8p0\LocalCache\local-packages\Python311\site-packages\pix2tex\model\checkpoints'
proxy_prefix = 'https://registry.npmmirror.com/download?url='
gh_base = 'https://github.com/lukas-blecher/LaTeX-OCR/releases/download/v0.0.1'

for fname, path in [('weights.pth', '/weights.pth'), ('image_resizer.pth', '/image_resizer.pth')]:
    dest = os.path.join(checkpoint_dir, fname)
    url = proxy_prefix + gh_base + path
    print('Downloading', fname, '...')
    sys.stdout.flush()
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        resp = urllib.request.urlopen(req, timeout=300)
        total = int(resp.headers.get('content-length', 0))
        dl = 0
        with open(dest + '.tmp', 'wb') as f:
            while True:
                chunk = resp.read(65536)
                if not chunk:
                    break
                f.write(chunk)
                dl += len(chunk)
                if total > 0 and dl % (1024*1024) < 65536:
                    print('  %d/%d MB (%d%%)' % (dl/1024/1024, total/1024/1024, dl*100/total))
                    sys.stdout.flush()
        os.rename(dest + '.tmp', dest)
        print('  OK - %d MB' % (dl/1024/1024))
    except Exception as e:
        print('  FAILED:', e)
        sys.exit(1)

print('Model weights downloaded successfully!')
