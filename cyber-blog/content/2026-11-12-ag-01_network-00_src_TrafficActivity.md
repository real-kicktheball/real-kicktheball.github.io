---
{"title":"00_src_TrafficActivity.kt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"01_network/00_src_TrafficActivity.kt · 앱 원본 소스 (Kotlin) — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `01_network/00_src_TrafficActivity.kt` · 앱 원본 소스 (Kotlin).

<pre><code>package owasp.sat.agoat
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.StrictMode
import android.util.Log
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import okhttp3.*
import java.io.IOException
class TrafficActivity : AppCompatActivity() {
    var httpurl= &quot;http://demo.testfire.net&quot;
    var httpsurl= &quot;https://owasp.org&quot;
    var httpsurl1= &quot;https://cve.org&quot;
    private val client = OkHttpClient()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_traffic)

        // Allow network operations on the main thread for this example
        val policy = StrictMode.ThreadPolicy.Builder().permitAll().build()
        StrictMode.setThreadPolicy(policy)

        val HttpButton = findViewById&lt;Button&gt;(R.id.httpButton)
        val HttpsButton = findViewById&lt;Button&gt;(R.id.httpsButton)
        val PinningButton = findViewById&lt;Button&gt;(R.id.PinningButton)
        val PinningButton1 = findViewById&lt;Button&gt;(R.id.PinningButton1)

        //send HTTP request
        HttpButton.setOnClickListener {
            run(httpurl)
        }

        //send HTTPS Request
        HttpsButton.setOnClickListener {
            run(httpsurl)
        }

        //Pinning call - Okhttp3

        PinningButton.setOnClickListener {
            doPinning()
        }

        //Pinning Call - Native
        PinningButton1.setOnClickListener {
            run(httpsurl1)
        }

    }//onCreate


     fun run(url: String) {
         try {
             val request = Request.Builder()
                 .url(url)
                 .build()
             Toast.makeText(this, &quot;Request sent to &quot;+url+&quot; Please intercept using Proxy&quot;, Toast.LENGTH_LONG).show()

             client.newCall(request).enqueue(object : Callback {
                 override fun onFailure(call: Call, e: IOException) {}
                 override fun onResponse(call: Call, response: Response) = println(response.body?.string())
             })
         }
         catch (e:Exception)
         {
             e.printStackTrace()
         }
     }//run

    fun doPinning()
    {
        CoroutineScope(Dispatchers.IO).launch {
            val url=&quot;owasp.org&quot;
            try {
                val pinner1 = CertificatePinner.Builder()
                    .add(url, &quot;sha256/5gsjyidrmWjcLRClfCk+Dd6O0nx1CyFrVUW5wVkwEx0=&quot;)
                    .add(url, &quot;sha256/kIdp6NNEd8wsugYyyIYFsi1ylMCED3hZbSR8ZFsa/A4=&quot;)
                    .add(url, &quot;sha256/mEflZT5enoR1FuXLgYYGqnVEoZvmf9c2bVBpiOjYQ0c=&quot;)
                    .build()
                val client = OkHttpClient.Builder().certificatePinner(pinner1).build()
                val request = Request.Builder()
                    .url(&quot;https://&quot;+url)
                    .build()
                //Toast.makeText(this@TrafficActivity, &quot;Request Sent to https://&quot;+url, Toast.LENGTH_LONG).show()
                val response = client.newCall(request).execute()
                Log.v(&quot;Response&quot;, &quot;${response.body?.string()}&quot;)
            } catch (e: Exception) {
                //Toast.makeText(this@TrafficActivity, &quot;Pinning Verification Failed&quot;, Toast.LENGTH_LONG).show()
                e.printStackTrace()
            }
        }

    }//doPinning*/
}</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
