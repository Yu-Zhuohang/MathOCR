import pathlib
p = pathlib.Path('D:/桌面/Codex/Workspace/formula-recognizer/electron/sidecar.ts')
c = p.read_text('utf-8')
old = 'return { cmd: "python", args: [p] };'
new = 'return { cmd: this.findPython(), args: [p] };'
if old in c:
    c = c.replace(old, new)
    p.write_text(c, encoding='utf-8')
    print('Fixed getPythonCommand()')
else:
    print('Pattern not found in source')
