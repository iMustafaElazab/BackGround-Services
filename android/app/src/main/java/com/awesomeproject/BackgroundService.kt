package com.awesomeproject

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.os.SystemClock
import android.util.Log
import androidx.core.app.NotificationCompat
import com.facebook.react.ReactApplication
import com.facebook.react.ReactInstanceManager
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule

class BackgroundService : Service() {

    private val TAG = "BackgroundService"
    private val CHANNEL_ID = "BackgroundServiceChannel"
    private val NOTIFICATION_ID = 1
    private var startTime: Long = 0
    private lateinit var handler: Handler
    private lateinit var timerRunnable: Runnable

    override fun onCreate() {
        super.onCreate()
        Log.d(TAG, "Service created")
        createNotificationChannel()

        startTime = SystemClock.elapsedRealtime()
        handler = Handler(Looper.getMainLooper())
        timerRunnable = object : Runnable {
            override fun run() {
                val elapsedTime = SystemClock.elapsedRealtime() - startTime
                val seconds = (elapsedTime / 1000).toInt()
                val minutes = seconds / 60
                val remainingSeconds = seconds % 60

                val time = String.format("%02d:%02d", minutes, remainingSeconds)
                sendNotificationToReactNative("Service running: $time")

                handler.postDelayed(this, 1000)
            }
        }

        handler.post(timerRunnable)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d(TAG, "Service started")
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.d(TAG, "Service destroyed")
        handler.removeCallbacks(timerRunnable)
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val serviceChannel = NotificationChannel(
                CHANNEL_ID,
                "Background Service Channel",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(serviceChannel)
        }
    }

    private fun sendNotificationToReactNative(message: String) {
        val reactInstanceManager: ReactInstanceManager =
            (application as ReactApplication).reactNativeHost.reactInstanceManager
        val currentReactContext: ReactContext? = reactInstanceManager.currentReactContext
        if (currentReactContext != null) {
            currentReactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("backgroundServiceNotification", message)
        }
    }
}
