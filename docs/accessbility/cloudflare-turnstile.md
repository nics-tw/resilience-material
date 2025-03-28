# Cloudflare Turnstile 無障礙指南

## 概述
Cloudflare Turnstile 是一個用戶友好且注重隱私的 CAPTCHA 替代方案，可幫助保護網站免受濫用。本文件說明在網站上實施 Turnstile 時需要注意的無障礙考量。

## 機器人防護機制

### 工作原理
Turnstile 使用多層次的防護機制來識別和阻擋機器人：

1. 瀏覽器特徵分析
   - 分析瀏覽器的各種屬性和行為模式
   - 檢測異常的瀏覽器特徵
   - 識別自動化工具的特徵

2. 臨時識別碼（Ephemeral IDs）
   - 為每個訪客生成短期有效的唯一識別碼
   - 不依賴 IP 位址進行識別
   - 即使攻擊者使用不同的 IP 位址，仍可識別惡意行為模式
   - [參考：Cloudflare 部落格 - Ephemeral IDs 介紹](https://blog.cloudflare.com/turnstile-ephemeral-ids-for-fraud-detection/)

3. 行為模式分析
   - 分析使用者的互動模式
   - 識別異常的請求模式
   - 檢測自動化攻擊的特徵

### 防護優勢
- 不依賴傳統的 CAPTCHA 驗證方式
- 提供無縫的使用者體驗
- 有效對抗 IP 輪換攻擊
- 保護使用者隱私
- 降低誤判率

### 使用情境
- 登入表單保護
- 註冊頁面防護
- 高價值交易保護
- 防止自動化攻擊

## 使用限制與要求

### 免費版本限制
- 每月請求限制：100,000 次
- 每個網域最多 100 個 Turnstile 元件
- 每個元件每秒最多 10 次驗證請求
- 不支援自訂域名（Custom Domain）

### 技術依賴
- 需要 JavaScript 支援
- 需要網路連接以進行驗證
- 需要 Cloudflare 的 CDN 服務
- 支援所有現代瀏覽器（Chrome、Firefox、Safari、Edge）
- 支援行動裝置瀏覽器

### 相容性考量
- 如果使用者停用 JavaScript，需要提供備用驗證方案
- 建議實作降級機制，在 Turnstile 載入失敗時提供替代方案
- 需要考慮離線使用情境的處理方式

### 效能考量
- 首次載入時需要下載約 20KB 的 JavaScript
- 驗證過程約需 100-300ms
- 建議使用 async/defer 屬性優化載入效能
- 考慮使用 CDN 快取優化載入速度

## 無障礙要求

### 1. 螢幕閱讀器相容性
- Turnstile 元件自動支援螢幕閱讀器
- 元件提供適當的 ARIA 標籤和角色
- 無需額外的螢幕閱讀器實作

### 2. 鍵盤導航
- 元件完全支援鍵盤操作
- 使用者可以使用 Tab 和 Enter 鍵導航並與元件互動
- 焦點指示器清晰可見，符合 WCAG 2.1 要求

### 3. 視覺無障礙
- 元件支援高對比模式
- 文字在放大至 200% 時仍保持可讀性
- 不依賴顏色作為唯一的資訊傳達方式

## 實作指南

### 1. 前端實作

#### 基本 HTML 實作
```html
<!-- 在 head 標籤中加入 Turnstile 腳本 -->
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

<!-- 在表單中加入 Turnstile 元件 -->
<form id="my-form">
    <!-- 其他表單欄位 -->
    <div class="cf-turnstile" 
         data-sitekey="your-site-key"
         data-theme="light"
         data-callback="onTurnstileSuccess">
    </div>
    <button type="submit">提交</button>
</form>
```

#### JavaScript 實作
```javascript
// 初始化 Turnstile
window.onload = function() {
    turnstile.render('#container', {
        sitekey: 'your-site-key',
        theme: 'light',
        callback: function(token) {
            // 處理驗證成功
            console.log('驗證成功，token:', token);
        },
        'error-callback': function() {
            // 處理驗證失敗
            console.log('驗證失敗');
        }
    });
};

// 表單提交處理
document.getElementById('my-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // 獲取 Turnstile token
    const token = turnstile.getResponse();
    if (!token) {
        alert('請完成人機驗證');
        return;
    }

    // 發送表單數據到後端
    const formData = new FormData(this);
    formData.append('cf-turnstile-response', token);

    try {
        const response = await fetch('/api/submit', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('提交成功！');
            turnstile.reset(); // 重置驗證
        } else {
            throw new Error('提交失敗');
        }
    } catch (error) {
        console.error('錯誤:', error);
        alert('提交失敗，請重試');
    }
});
```

### 2. 後端驗證

#### Node.js 實作
```javascript
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const TURNSTILE_SECRET_KEY = 'your-secret-key';

app.post('/api/submit', async (req, res) => {
    const token = req.body['cf-turnstile-response'];
    
    try {
        const response = await axios.post(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            null,
            {
                params: {
                    secret: TURNSTILE_SECRET_KEY,
                    response: token
                }
            }
        );

        if (response.data.success) {
            // 驗證成功，處理表單提交
            res.json({ success: true });
        } else {
            // 驗證失敗
            res.status(400).json({ 
                success: false, 
                error: '驗證失敗' 
            });
        }
    } catch (error) {
        console.error('Turnstile 驗證錯誤:', error);
        res.status(500).json({ 
            success: false, 
            error: '伺服器錯誤' 
        });
    }
});
```

#### .NET C# 實作
```csharp
using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

public class TurnstileController : ControllerBase
{
    private readonly string _secretKey = "your-secret-key";
    private readonly HttpClient _httpClient;

    public TurnstileController(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    [HttpPost("api/submit")]
    public async Task<IActionResult> SubmitForm([FromForm] FormData formData)
    {
        try
        {
            // 驗證 Turnstile token
            var verificationResponse = await VerifyTurnstileToken(formData.TurnstileResponse);
            
            if (verificationResponse.Success)
            {
                // 驗證成功，處理表單提交
                return Ok(new { success = true });
            }
            
            // 驗證失敗
            return BadRequest(new { 
                success = false, 
                error = "驗證失敗" 
            });
        }
        catch (Exception ex)
        {
            // 處理其他錯誤
            return StatusCode(500, new { 
                success = false, 
                error = "伺服器錯誤" 
            });
        }
    }

    private async Task<TurnstileResponse> VerifyTurnstileToken(string token)
    {
        var content = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("secret", _secretKey),
            new KeyValuePair<string, string>("response", token)
        });

        var response = await _httpClient.PostAsync(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify", 
            content
        );

        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();
        
        return JsonSerializer.Deserialize<TurnstileResponse>(responseString);
    }
}

// 資料模型
public class FormData
{
    public string TurnstileResponse { get; set; }
    // 其他表單欄位...
}

public class TurnstileResponse
{
    public bool Success { get; set; }
    public string[] ErrorCodes { get; set; }
    public string Hostname { get; set; }
    public string ChallengeTs { get; set; }
}
```

### 3. 自訂選項
- `data-theme`：支援 'light' 和 'dark' 主題
- `data-size`：支援 'normal' 和 'compact' 尺寸
- `data-language`：支援多種語言以提升無障礙性
- `data-callback`：驗證成功時的回調函數
- `data-error-callback`：驗證失敗時的回調函數

### 4. 錯誤處理
- 確保在驗證失敗時提供清晰的錯誤訊息
- 實作適當的重試機制
- 考慮網路連接問題的處理方式
- 提供備用的驗證方式（如需要）

## WCAG 合規性
Turnstile 符合以下 WCAG 2.1 Level AA 要求：
- 1.1.1 非文字內容 (Level A)
- 1.3.1 資訊和關係 (Level A)
- 1.3.2 有意義的順序 (Level A)
- 1.4.3 對比度（最小）(Level AA)
- 1.4.4 調整文字大小 (Level AA)
- 2.1.1 鍵盤 (Level A)
- 2.1.2 無鍵盤陷阱 (Level A)
- 2.4.3 焦點順序 (Level A)
- 2.4.6 標題和標籤 (Level AA)

## 測試建議
1. 使用螢幕閱讀器測試（NVDA、VoiceOver、JAWS）
2. 驗證鍵盤導航功能
3. 檢查高對比模式相容性
4. 測試不同縮放等級
5. 使用無障礙測試工具進行驗證
6. 測試各種錯誤情況的處理
7. 驗證後端 API 的錯誤處理機制

## 其他資源
- [Cloudflare Turnstile 文件](https://developers.cloudflare.com/turnstile/)