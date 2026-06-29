; Formula Recognizer Inno Setup Script
#define MyAppName "Formula Recognizer"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Formula Recognizer"
#define MyAppExeName "Formula Recognizer.exe"

[Setup]
AppId={{F0A1B2C3-D4E5-6789-ABCD-EF0123456789}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=no
DisableDirPage=no
OutputDir=D:\桌面\Codex\Workspace\formula-recognizer\installer-output
OutputBaseFilename=FormulaRecognizer_Setup_v2
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=lowest
DisableWelcomePage=no
LicenseFile=D:\桌面\Codex\Workspace\formula-recognizer\license.txt

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "chinesesimplified"; MessagesFile: "compiler:Languages\ChineseSimplified.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: checkedonce

[Files]
Source: "D:\桌面\Codex\Workspace\formula-recognizer\dist-app\win-unpacked\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{userdesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon
Name: "{group}\Run Engine Setup"; Filename: "{app}\resources\engine\setup.bat"; WorkingDir: "{app}\resources\engine"

[Run]
Filename: "{app}\resources\engine\setup.bat"; Description: "Install Python dependencies"; Flags: postinstall shellexec skipifsilent; WorkingDir: "{app}\resources\engine"
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#MyAppName}}"; Flags: nowait postinstall skipifsilent
