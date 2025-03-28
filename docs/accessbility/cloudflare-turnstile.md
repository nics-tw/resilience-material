# 使用 Cloudflare Turnstile

Cloudflare Turnstile 提供了一個使用者友善的解決方案，用來替代傳統 CAPTCHA 圖形驗證因難以辨識而造成的使用者通過率偏低問題。本文件將說明 Turnstile 的運作原理以及如何將其套用在網站上。

## 防護機制

### 工作原理

Turnstile 使用多層次的防護機制來識別和阻擋機器人：

1. 瀏覽器特徵分析
   - 分析瀏覽器的各種屬性和行為模式
   - 檢測異常的瀏覽器特徵
   - 識別自動化工具的特徵

2. 行為模式分析
   - 分析使用者的互動模式
   - 識別異常的請求模式
   - 檢測自動化攻擊的特徵

3. 臨時識別碼（Ephemeral IDs）
   - 為每個訪客生成短期有效的唯一識別碼
   - 不依賴 IP 位址進行識別，而是基於瀏覽器特徵及行為模式
   - 即使攻擊者使用不同的 IP 位址，仍可識別惡意行為模式
   - [參考：Cloudflare 部落格 - Ephemeral IDs 介紹](https://blog.cloudflare.com/turnstile-ephemeral-ids-for-fraud-detection/)

### 防護優勢

- 與 CAPTCHA 驗證方式相比，提供更好的使用者體驗、提高人類的通過驗證的比例
- 有效對抗 IP 輪換攻擊
- 保護使用者隱私

### 使用情境

- 登入表單保護
- 註冊頁面防護
- 防止自動化攻擊

## 注意事項與限制

- **必須在後端使用 siteverify API 驗證 Turnstile token**：Turnstile token 可能無效、過期(300秒內有效)或已被使用，若未驗證 token 將導致嚴重的安全漏洞
- 切換頁面時（如：登出->重新登入），需注意是否重設(reset) turnstile 元件的狀態
- 可考慮實作降級機制，在 Turnstile 載入失敗時提供替代方案
- 僅內部使用之系統，需考量防止內部系統被自動化攻擊的必要性，若需使用，需確保系統可以連線到 Cloudflare 伺服器進行驗證

### 免費版本限制

參考：https://www.cloudflare.com/application-services/products/turnstile/

- 不能移除 Cloudflare 的 logo
- 只能建立十個小工具
- 每個小工具最多只能驗證十個網域

## 實作指南

參考：https://developers.cloudflare.com/turnstile/

### 1. 前端實作

在 Turnstile 中，有兩種主要的前端實作方式：

#### HTML

```html
<!-- 在 head 標籤中加入 Turnstile 腳本 -->
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

<!-- 在表單中加入 Turnstile 元件 -->
<form id="my-form">
    <!-- 其他表單欄位 -->
    <div class="cf-turnstile" 
         data-sitekey="your-site-key"
         data-size="flexible"
         data-callback="onTurnstileSuccess">
    </div>
    <button type="submit">提交</button>
</form>
```

#### JavaScript

```javascript
// 初始化 Turnstile
window.onload = function() {
    turnstile.render('#container', {
        sitekey: 'your-site-key',
        size: 'flexible',
        callback: function(token) {
            // 處理驗證成功
            console.log('驗證成功，token:', token);
        }
    });
};

// 表單提交處理
document.getElementById('my-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // 獲取 Turnstile token
    const token = turnstile.getResponse();

    // 發送表單數據到後端
    const formData = new FormData(this);
    formData.append('cf-turnstile-response', token);

    try {
        const response = await fetch('/api/submit', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            console.log('submit success');
        } else {
            console.error('submit fail');
        }
    } catch (error) {
        console.error(error);
    }
});
```

#### 參數說明

JavaScript 使用 `sitekey` 作為參數名稱，HTML 使用 `data-sitekey` 作為屬性名稱，其他參數也遵循相同規則，例如：

- JavaScript: `theme`, HTML: `data-theme`
- JavaScript: `size`, HTML: `data-size`

其他可以使用的參數請參考：https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#configurations

### 2. 後端驗證

#### Node.js 實作

```javascript
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

const TURNSTILE_SECRET_KEY = 'your-secret-key';

app.post('/api/submit', async (req, res) => {
    const token = req.body['cf-turnstile-response'];
    
    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                secret: TURNSTILE_SECRET_KEY,
                response: token
            })
        });

        const data = await response.json();

        if (data.success) {
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
        console.error(error);
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
