import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, Image, Text } from 'react-native';
import { SafeAreaView, SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useState, useEffect, useRef } from 'react';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const MOBILE_INJECT = `
  (function() {
    var meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      document.head.appendChild(meta);
    }
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.documentElement.style.webkitTextSizeAdjust = '100%';
  })();
  true;
`;

const LOAD_TIMEOUT = 15000;

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const webviewRef = useRef<WebView>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  // 加载超时兜底
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (!loaded) setLoaded(true);
    }, LOAD_TIMEOUT);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleLoadEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setLoaded(true), 500);
  };

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={{ height: insets.top, backgroundColor: '#000' }} />
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <WebView
          ref={webviewRef}
          source={{ uri: 'https://www.webcad.online/index.html' }}
          style={styles.webview}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          onHttpError={handleError}
          overScrollMode="never"
          bounces={false}
          injectedJavaScript={MOBILE_INJECT}
          scalesPageToFit={false}
          setBuiltInZoomControls={false}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
        />
        {error && (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorText}>加载失败，请检查网络连接</Text>
            <Text style={styles.retryText} onPress={() => { setError(false); setLoaded(false); webviewRef.current?.reload(); }}>
              点击重试
            </Text>
          </View>
        )}
        {!loaded && (
          <View style={styles.loadingOverlay}>
            <Image source={require('./assets/adaptive-icon.png')} style={styles.splashIcon} />
            <ActivityIndicator color="#fff" size="large" style={styles.spinner} />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  splashIcon: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 40,
    marginTop: -60,
  },
  spinner: {
    marginTop: 0,
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  retryText: {
    color: '#4af',
    fontSize: 16,
  },
});
