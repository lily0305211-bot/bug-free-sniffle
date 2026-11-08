# Moonbow · 月光祕境 / Godot 單關手感版 0.1

這次是獨立的 Godot 4.6.3 專案，測試一位弓手、三種敵人、三波遭遇戰與實體出口。原本 Twilight-Expedition 的裝備、抽獎、任務、帳號與進度尚未接回；本關也不使用舊存檔。

## 先玩

- Windows：解壓 Windows 試玩包，開啟 `Moonbow.exe`。無需另外安裝 Godot。
- 網頁：將 GitHub 包中的整個 `moonbow` 資料夾上傳到原專案的 `docs`，保持 Pages 為 main / docs。路徑應是 `docs/moonbow/index.html`；部署後在原網站網址尾端加 `moonbow/`。
- 不需要刪除原版檔案，也不要只上傳 HTML。這份引擎版包含 WebAssembly、PCK 場景資料與入口程式。
- 網頁需要 HTTPS、WebGL 2 與 DecompressionStream。單執行緒匯出，不需要額外設定 COOP / COEP 伺服器標頭。
- `game.wasm.gz` 是引擎二進位的 gzip 壓縮檔。入口會串流解壓，單一檔案小於 25 MB，可用 GitHub 網頁上傳。它不能改名，也不是要手動解壓後再上傳。

## 操作

WASD／方向鍵走位，停下自動瞄準並射箭；移動收弓。Space 或 Shift 短衝刺，有短暫無敵與冷卻。Escape 暫停。觸控裝置可拖曳左半邊移動，右側衝刺按鍵；手機效能及觸控尚待實機測試。

近戰守衛會蓄勢揮砍；弩手有瞄準線及三連箭；法師先顯示落雷圈。石柱會阻擋移動與投射物。每波結束選月光祝福，第三波後走入最上方月門完成關卡。

## 製作方式與美術邊界

- 真正的 Godot 3D 執行、碰撞、骨架動畫與貼圖模型，沒有用平面角色圖片冒充立體模型。
- 主角是 KayKit 的現成 CC0 模型與原有動畫，並非 AI 圖轉 3D。模型只是一個可替換的美術起點，尚未做到最終角色品質。
- AI 生成的是森林地表平面材質。樹木、岩石、遺跡使用 CC0 模型，石徑、弓、箭、花草、特效、音效和背景音樂由本專案製作。
- 網站背景為從同一 3D 場景匯出後，用 Blender Cycles 離線渲染的預覽。它沒有 Godot 的完整材質／後製／粒子，不能當作實際瀏覽器遊玩截圖。

## 打開原始專案

使用 Godot 4.6.3 開啟 `project.godot`，按 F6 或 F5 執行。首次會重新匯入模型與材質。修改玩法在 `main.gd`；主要角色資產在 `assets/characters`；關卡素材在 `assets/environment`、`assets/nature`。

所有來源與授權附在 `CREDITS.md` 及 `LICENSES`。未附編輯器，不需要從非官方來源下載外掛。

若要重新輸出網頁，先在 Godot 安裝對應版本的匯出範本。`export_presets.cfg` 可直接用標準 Godot 範本匯出。標準輸出的 wasm 超過 25 MB；若使用 GitHub 網頁上傳，可執行 `python tools/build_web.py`，它會輸出包含壓縮引擎與入口的 `web-output`。

## 已驗證與限制

17 項引擎內自動測試通過：骨架數量與 Idle/Running/Shoot/Death 動畫、首波生成、遮擋視線、箭矢實際傷害、無敵判定、衝刺、死亡移除、掉落、波次選擇、轉場、月門解鎖、出口通關與重試重置。

另驗證巢狀 GitHub 路徑、gzip 串流解壓、解壓後 SHA-256 一致、WebAssembly 格式有效、PCK 大小與入口交接。

已成功匯出 Web 版與 Windows x86-64 版。此環境禁止 GPU / WebGL 視窗，不能宣稱完成 GPU 畫面驗證；Windows 版也未在真正 Windows 裝置執行。遊戲手感、鏡頭、弓與手部對位及手機效能，需要實機回饋後再調整。

這是第一個引擎版可玩試片，不是商業完成品。沒有儲值、帳號或第三方資料收集。
