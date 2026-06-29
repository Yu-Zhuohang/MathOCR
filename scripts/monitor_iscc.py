import subprocess, os, time
pf = r"D:\桌面\Codex\Workspace\formula-recognizer\release\FormulaRecognizer_Setup.exe"
while True:
    r = subprocess.run(["powershell","-c","Get-Process ISCC -ErrorAction SilentlyContinue | Select-Object Id"], capture_output=True,text=True)
    running = "Id" in r.stdout
    sz = os.path.getsize(pf)/1e6 if os.path.exists(pf) else 0
    print("["+time.strftime("%H:%M:%S")+"] "+f"{sz:.1f} MB ISCC="+("RUN" if running else "DONE"))
    if not running and sz > 10:
        break
    time.sleep(30)
print("FINISHED")
