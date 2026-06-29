import pathlib
f = 'D:/桌面/Codex/Workspace/formula-recognizer/electron/ipc-handlers.ts'
c = pathlib.Path(f).read_text('utf-8')
old1 = 'const res = await sidecar.call(\"recognize\", { image: result.imageBase64 });'
new1 = 'const res = await sidecar.call(\"recognize\", { image: result.imageBase64 }, 120000);'
old2 = 'const res = await sidecar.call(\"recognize\", { image: imageBase64 });'
new2 = 'const res = await sidecar.call(\"recognize\", { image: imageBase64 }, 120000);'
changes = 0
if old1 in c:
    c = c.replace(old1, new1)
    changes += 1
    print('Fixed line 52')
if old2 in c:
    c = c.replace(old2, new2)
    changes += 1
    print('Fixed line 124')
pathlib.Path(f).write_text(c, encoding='utf-8')
print(f'Done - {changes} changes made')
