<div align="center">

# MathOCR

**鏁板鍏紡OCR宸ュ叿 鈥?鍥剧墖鍏紡璇嗗埆杞崲 LaTeX/MathML锛屽鍒剁矘璐村埌 Word 鍗冲彲缂栬緫**

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License"/>
  <img src="https://img.shields.io/badge/version-1.0.0-blue?style=flat-square" alt="Version"/>
  <img src="https://img.shields.io/badge/platform-Windows%2010%2F11-blue?style=flat-square" alt="Platform"/>
  <img src="https://img.shields.io/badge/python-3.8%2B-blue?style=flat-square" alt="Python"/>
  <img src="https://img.shields.io/badge/build-electron-brightgreen?style=flat-square" alt="Electron"/>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs"/>
  <img src="https://img.shields.io/github/stars/Yu-Zhuohang/MathOCR?style=flat-square" alt="Stars"/>
  <img src="https://img.shields.io/github/release/Yu-Zhuohang/MathOCR?style=flat-square" alt="Release"/>
</p>
[鍔熻兘](#鏍稿績鍔熻兘) 鈥?[瀹夎](#瀹夎) 鈥?[浣跨敤](#浣跨敤鎸囧崡)  鈥?[鎶€鏈爤](#鎶€鏈爤) 鈥?[椤圭洰缁撴瀯](#椤圭洰缁撴瀯) 鈥?[甯歌闂](#甯歌闂) 鈥?[寮€婧愯鍙痌(#璁稿彲璇?

</div>

---

## 绠€浠?
**MathOCR** 鏄竴娆句笓涓氱殑鏁板鍏紡璇嗗埆涓庣紪杈戝伐鍏凤紝鍩轰簬 Electron + React + Python 鍏ㄦ爤鏋舵瀯寮€鍙戙€傝蒋浠堕噰鐢?pix2tex 娣卞害瀛︿範妯″瀷锛岃兘澶熼€氳繃鍏ㄥ眬蹇嵎閿埅鍙栧睆骞曚换鎰忓尯鍩熷唴鐨勬暟瀛﹀叕寮忓浘鍍忥紝鑷姩璇嗗埆骞惰浆鎹负 LaTeX 浠ｇ爜銆傚悓鏃跺唴缃?KaTeX 瀹炴椂鍏紡棰勮寮曟搸鍜?MathML 鏍煎紡杈撳嚭鍔熻兘锛屾敮鎸佸鍒跺埌 Word銆乄PS 绛夋枃妗ｈ蒋浠舵樉绀轰负鍙紪杈戝叕寮忓璞°€傚叏绋嬬绾胯繍琛岋紝鏃犻渶缃戠粶杩炴帴锛屼繚鎶ょ敤鎴锋暟鎹殣绉佸畨鍏ㄣ€?
> **涓轰粈涔堥€夋嫨 MathOCR锛?*
> - 鎴浘璇嗗埆 鈥?蹇嵎閿縺娲伙紝妗嗛€夊嵆鍑虹粨鏋?> - 瀹屽叏绂荤嚎 鈥?鏃犻渶鑱旂綉锛屾墍鏈夋帹鐞嗗潎鍦ㄦ湰鍦板畬鎴愶紝鏁版嵁涓嶅浼?> - 鏀寔MathML鏍煎紡绮樿创 鈥?澶嶅埗鑷?Word 鍗虫樉绀轰负鍙紪杈戝叕寮?> - 楂樺噯纭巼 鈥?鍩轰簬 pix2tex 娣卞害瀛︿範妯″瀷锛岃瘑鍒纭巼楂?> - 浠ｇ爜寮€婧愬厤璐?鈥?閬靛惊 MIT 寮€婧愬崗璁紝鍙緵浜屾寮€鍙?
## 鏍稿績鍔熻兘

| 鍔熻兘 | 璇存槑 |
|------|------|
| 鍥剧墖鍏紡璇嗗埆 | 鎸変笅 Ctrl+Shift+Alt+F 妗嗛€夊睆骞曚换鎰忓尯鍩燂紝鑷姩璇嗗埆鍏紡 |
| LaTeX 缂栬緫 | 鍐呯疆 LaTeX 缂栬緫鍣紝宸︿晶鍐欎唬鐮侊紝鍙充晶瀹炴椂棰勮 |
| MathML 澶嶅埗 | 涓€閿鍒朵负 Word 鍙紪杈戠殑鍏紡鏍煎紡 |
| 鍘嗗彶璁板綍 | 鑷姩淇濆瓨璇嗗埆鍘嗗彶锛屾敮鎸佹煡闃呭拰澶嶇敤 |
| 绯荤粺鎵樼洏 | 鍚庡彴甯搁┗锛屼竴閿懠鍑?|

## 涓嬭浇瀹夎

### 鏂瑰紡涓€锛氫笅杞藉畨瑁呭寘锛堟帹鑽愶級

浠?[Releases](https://github.com/Yu-Zhuohang/MathOCR/releases) 椤甸潰涓嬭浇鏈€鏂扮増瀹夎绋嬪簭锛屽弻鍑昏繍琛屽嵆鍙€?
### 鏂瑰紡浜岋細浠庢簮鐮佽繍琛?
```bash
# 1. 鍏嬮殕浠撳簱
git clone https://github.com/Yu-Zhuohang/MathOCR.git
cd MathOCR

# 2. 瀹夎 Node.js 渚濊禆
npm install

# 3. 瀹夎 Python 渚濊禆
cd engine
pip install -r requirements.txt
cd ..

# 4. 涓嬭浇璇嗗埆妯″瀷锛堥娆¤繍琛岋級
python scripts/download-model.py

# 5. 鍚姩
npm start
```

### 绯荤粺瑕佹眰

| 椤圭洰 | 鎺ㄨ崘閰嶇疆 | 鏈€浣庨厤缃?|
|------|----------|----------|
| 鎿嶄綔绯荤粺 | Windows 10/11 (64-bit) | Windows 10 |
| CPU | Intel i5 鍙婁互涓?| Intel i3 鍙婁互涓?|
| 鍐呭瓨 | 8 GB 鍙婁互涓?| 4 GB |
| 瀛樺偍 | 500 MB 鍙敤绌洪棿 | 100 MB 鍙敤绌洪棿 |
| Python | 3.8 鍙婁互涓?| 3.8 |

## 杞欢鐣岄潰鍙婁娇鐢ㄦ寚鍗?
### 棣栨浣跨敤

1. 鍚姩杞欢鍚庯紝绛夊緟搴曢儴寮曟搸鍔犺浇瀹屾垚锛堥娆＄害30-60绉掞級

![image-20260629205617654](https://raw.githubusercontent.com/Yu-Zhuohang/MathOCR/main/images/image-20260629203725097.png)

2. 鎸変笅蹇嵎閿?**Ctrl+Shift+Alt+F** 鎴栬彍鍗曟寜閽?**Screenshot** 婵€娲绘埅鍥炬ā寮?
![image-20260629203318550](https://raw.githubusercontent.com/Yu-Zhuohang/MathOCR/main/images/image-20260629203318550.png)

3. 榧犳爣鎷栨嫿閫夋嫨鍏紡鍖哄煙

![image-20260629203442838](https://raw.githubusercontent.com/Yu-Zhuohang/MathOCR/main/images/image-20260629203442838.png)

4. 閲婃斁榧犳爣锛岃瘑鍒粨鏋滆嚜鍔ㄦ樉绀?
![image-20260629203420937](https://raw.githubusercontent.com/Yu-Zhuohang/MathOCR/main/images/image-20260629203420937.png)

5. 鐐瑰嚮 Copy LaTeX 鎴?Copy MathML (Word) 澶嶅埗鍏紡

![image-20260629204303653](https://raw.githubusercontent.com/Yu-Zhuohang/MathOCR/main/images/image-20260629204303653.png)

### 鎴浘璇嗗埆

1. 蹇嵎閿埅鍥撅細鎸変笅 Ctrl+Shift+Alt+F
2. 妗嗛€夊叕寮忥細鎸変綇榧犳爣宸﹂敭鎷栨嫿閫夋嫨
3. 鑷姩璇嗗埆锛氭澗寮€鍚庤皟鐢ㄥ紩鎿庤瘑鍒?4. 澶嶅埗缁撴灉锛氱偣鍑诲簳閮ㄥ鍒舵寜閽?
### LaTeX 缂栬緫鍣?
鍦?LaTeX Editor 椤甸潰涓紝宸︿晶涓轰唬鐮佽緭鍏ュ尯锛屽彸渚т负瀹炴椂棰勮鍖猴紝鏀寔鎵嬪姩缂栬緫鍜屼慨鏀瑰叕寮忋€?
![image-20260629203821340](https://raw.githubusercontent.com/Yu-Zhuohang/MathOCR/main/images/image-20260629203821340.png)

![image-20260629203802416](https://raw.githubusercontent.com/Yu-Zhuohang/MathOCR/main/images/image-20260629203802416.png)

### 澶嶅埗鍒?Word

鐐瑰嚮 **Copy MathML (Word)** 鎸夐挳锛岀劧鍚庡湪 Word 涓寜 Ctrl+V 鐩存帴绮樿创锛屽叕寮忓皢鏄剧ず涓哄彲缂栬緫鐨勬爣鍑嗗叕寮忓璞°€?
![image-20260629203834097](https://raw.githubusercontent.com/Yu-Zhuohang/MathOCR/main/images/image-20260629203834097.png)

### 鍘嗗彶璁板綍
鎵€鏈夎瘑鍒垚鍔熺殑鍏紡浼氳嚜鍔ㄤ繚瀛樺埌杞欢鐨勬湰鍦板巻鍙茶褰曟暟鎹簱涓€傚湪"鍘嗗彶璁板綍"椤甸潰涓紝宸︿晶浠ュ垪琛ㄥ舰寮忓睍绀烘墍鏈夊巻鍙茶褰曟潯鐩紝姣忛」鏄剧ず鍏紡鐨?LaTeX 鐗囨鍜岃瘑鍒椂闂淬€傜偣鍑讳换鎰忓巻鍙茶褰曟潯鐩紝鍙充晶浼氬睍绀哄畬鏁寸殑 LaTeX 浠ｇ爜鍜屽搴旂殑 KaTeX 鍏紡棰勮鏁堟灉锛屽悓鏃舵彁渚?Copy LaTeX"鍜?Copy MathML (Word)"鎸夐挳锛屾柟渚块殢鏃跺鐢ㄣ€?
![image-20260629204019996](https://raw.githubusercontent.com/Yu-Zhuohang/MathOCR/main/images/image-20260629204019996.png)

## 蹇嵎鎿嶄綔

| 鎿嶄綔 | 蹇嵎閿?|
|------|--------|
| 鎴浘璇嗗埆 | Ctrl+Shift+Alt+F |
| 鍙栨秷鎴浘 | Escape / 榧犳爣鍙抽敭 |
| 鏄剧ず/闅愯棌绐楀彛 | 宸﹂敭鐐瑰嚮鎵樼洏鍥炬爣 |
| 閫€鍑虹▼搴?| 鍙抽敭鎵樼洏鍥炬爣 -> 閫€鍑?|

## 鎶€鏈爤

| 灞傜骇 | 鎶€鏈?|
|------|------|
| 妗岄潰妗嗘灦 | Electron 33 |
| 鍓嶇 | React 18 + TypeScript |
| 鍏紡娓叉煋 | KaTeX |
| 璇嗗埆寮曟搸 | pix2tex (LaTeX-OCR) |
| 鍚庣 | Python 3.8+ |
| 閫氫俊鍗忚 | JSON-RPC 2.0 |
| 鏁版嵁瀛樺偍 | electron-store |

## 椤圭洰缁撴瀯

```
MathOCR/
|--- electron/               Electron 涓昏繘绋?|   |--- main.ts             绐楀彛绠＄悊銆佺敓鍛藉懆鏈?|   |--- preload.ts          contextBridge API
|   |--- sidecar.ts          Python 寮曟搸绠＄悊
|   |--- overlay.ts          鎴浘瑕嗙洊灞?|   |--- tray.ts             绯荤粺鎵樼洏
|   |--- ipc-handlers.ts     IPC 閫氫俊澶勭悊
|--- engine/                 Python 璇嗗埆寮曟搸
|   |--- server.py           JSON-RPC 鏈嶅姟绔?|   |--- recognizer.py       pix2tex 灏佽
|   |--- requirements.txt    Python 渚濊禆
|--- src/                    React 鍓嶇
|   |--- components/         UI 缁勪欢
|   |--- styles/             鏍峰紡鏂囦欢
|   |--- index.tsx           鍏ュ彛
|--- scripts/                宸ュ叿鑴氭湰
|--- package.json
|--- tsconfig.json
|--- electron-builder.yml
```

## 甯歌闂

### 妯″瀷鍔犺浇缂撴參
棣栨鍚姩鏃堕渶瑕佸姞杞芥繁搴﹀涔犳ā鍨嬶紝鑰楁椂绾?0-60绉掞紝灞炴甯哥幇璞°€傚悗缁惎鍔ㄤ娇鐢ㄧ紦瀛橈紝閫熷害浼氬ぇ骞呮彁鍗囥€?
### 璇嗗埆鍑嗙‘鐜?妯″瀷鐨勮瘑鍒噯纭巼鍙栧喅浜庡叕寮忕殑娓呮櫚搴﹀拰澶嶆潅搴︺€傚缓璁湪璇嗗埆鍓嶇‘淇濆叕寮忓尯鍩熸竻鏅般€佹棤鍣０骞叉壈銆?
### Engine not ready
濡傛灉璇嗗埆寮曟搸鐘舵€佹樉绀?Engine not ready锛岃绛夊緟寮曟搸鍔犺浇瀹屾垚鍚庡啀灏濊瘯璇嗗埆銆傝嫢闀挎椂闂存棤娉曞氨缁紝鍙噸鍚蒋浠躲€?
### 澶嶅埗鍒?Word 鏃犲弽搴?璇风‘淇濅娇鐢ㄧ殑鏄?Word 鎴?WPS 鏈€鏂扮増鏈紝鏀寔 MathML 绮樿创銆傚缓璁娇鐢?Office 2019 鎴?Microsoft 365銆?
## Star 鍘嗗彶

[![Star History Chart](https://api.star-history.com/svg?repos=Yu-Zhuohang/MathOCR&type=Date)](https://star-history.com/#Yu-Zhuohang/MathOCR&Date)

## 璐＄尞

娆㈣繋鎻愪氦 Issue 鍜?Pull Request锛佽纭繚浠ｇ爜椋庢牸涓€鑷村苟娣诲姞鐩稿簲鐨勬祴璇曘€?
## 璁稿彲璇?
[MIT License](/LICENSE) (c) 2026 Yu Zhuohang


