import pathlib
f = 'D:/桌面/Codex/Workspace/formula-recognizer/electron/main.ts'
c = pathlib.Path(f).read_text('utf-8')
print('quit in c:', 'quit' in c)
print('shutdown in c:', 'shutdown' in c)
print('app.on in c:', 'app.on' in c)
idx = c.find('sidecar')
if idx >= 0:
    print('sidecar context:', c[max(0,idx-50):idx+300])
else:
    print('NOT FOUND')
idx2 = c.find('quit')
if idx2 >= 0:
    print('quit context:', c[max(0,idx2-100):idx2+200])
