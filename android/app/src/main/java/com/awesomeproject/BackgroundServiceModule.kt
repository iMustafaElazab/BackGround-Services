package com.awesomeproject

import android.annotation.SuppressLint
import android.content.Intent
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class BackgroundServiceModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val TAG = "BackgroundServiceModule"
    private val CHANNEL_ID = "BackgroundServiceChannel"

    override fun getName(): String {
        return "BackgroundServiceModule"
    }

    @ReactMethod
    fun startService(promise: Promise) {
        try {
            Log.d(TAG, "startService called")
            val serviceIntent = Intent(reactApplicationContext, BackgroundService::class.java)
            reactApplicationContext.startService(serviceIntent)
            promise.resolve("Service started")
        } catch (e: Exception) {
            Log.e(TAG, "Error starting service", e)
            promise.reject("Error", e)
        }
    }

    @ReactMethod
    fun stopService(promise: Promise) {
        try {
            Log.d(TAG, "stopService called")
            val serviceIntent = Intent(reactApplicationContext, BackgroundService::class.java)
            reactApplicationContext.stopService(serviceIntent)
            promise.resolve("Service stopped")
        } catch (e: Exception) {
            Log.e(TAG, "Error stopping service", e)
            promise.reject("Error", e)
        }
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    fun triggerNotification(promise: Promise) {
        try {
            val notification = NotificationCompat.Builder(reactApplicationContext, CHANNEL_ID)
                .setContentTitle("Test Notification")
                .setContentText("This is a test notification")
                .setSmallIcon(R.drawable.ic_android_black_24dp) // Ensure you have a valid drawable icon
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .build()

            val manager = NotificationManagerCompat.from(reactApplicationContext)
            manager.notify(2, notification)
            promise.resolve("Notification triggered")
        } catch (e: Exception) {
            Log.e(TAG, "Error triggering notification", e)
            promise.reject("Error", e)
        }
    }
}
