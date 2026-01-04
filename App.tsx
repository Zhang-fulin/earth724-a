import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useState } from 'react';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          source={{ uri: 'https://www.webcad.online/index.html' }}
          style={styles.webview}
          onLoadStart={() => { setLoading(true); console.log('start'); }}
          onLoadEnd={() => { console.log('end'); setTimeout(() => setLoading(false), 3000); }}
          overScrollMode="never"
          bounces={false}  
        />
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color="#000" />
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
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
