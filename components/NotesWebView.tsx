import { useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import WebView from "react-native-webview";
import { buildNotesWebViewHTML } from "../lib/notesHTML";
import { colors } from "../lib/theme";

interface NotesWebViewProps {
  content: string;
}

// Minimum height while KaTeX loads / height hasn't been reported yet
const MIN_HEIGHT = 120;

export default function NotesWebView({ content }: NotesWebViewProps) {
  const [height, setHeight] = useState(MIN_HEIGHT);
  const [ready, setReady] = useState(false);

  const html = buildNotesWebViewHTML(content);

  return (
    <View style={[styles.container, { height: ready ? height : MIN_HEIGHT }]}>
      {!ready && (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
      <WebView
        source={{ html }}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        originWhitelist={["*"]}
        // KaTeX scripts postMessage the rendered body height
        onMessage={(e) => {
          const h = Number(e.nativeEvent.data);
          if (h > 0) {
            setHeight(h + 16); // small buffer for rounding
            setReady(true);
          }
        }}
        style={[styles.webview, !ready && styles.hidden]}
        // Transparent background so the parent card shows through
        backgroundColor="transparent"
        // Allow CDN requests for KaTeX
        mixedContentMode="always"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  hidden: {
    opacity: 0,
    position: "absolute",
  },
  loader: {
    height: MIN_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
});
