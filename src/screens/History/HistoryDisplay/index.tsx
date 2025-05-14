// src/screens/HistoryDisplay.tsx

import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CustomText from '../../../components/CustomText';

interface HistoryDisplayProps {
  expression: string;
  result: string;
  timestamp: number; // Unix ms
  isDarkMode: boolean;
}

const HistoryDisplay: React.FC<HistoryDisplayProps> = ({
  expression,
  result,
  timestamp,
  isDarkMode,
}) => {
  const exprRef = useRef<ScrollView>(null);
  const resRef  = useRef<ScrollView>(null);

  useEffect(() => {
    exprRef.current?.scrollToEnd({ animated: true });
    resRef.current?.scrollToEnd({ animated: true });
  }, [expression, result]);

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };

  // Only use #505050 (dark) and #d4d4d2 (light)
  const bgColor     = isDarkMode ? '#505050' : '#d4d4d2';
  const borderColor = isDarkMode ? '#d4d4d2' : '#505050';
  const textColor   = isDarkMode ? '#d4d4d2' : '#505050';

  return (
    <View style={[styles.container, { backgroundColor: bgColor, borderColor }]}>
      <ScrollView
        ref={exprRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.expressionScroll}
      >
        <CustomText style={[styles.expression, { color: textColor }]}>
          {expression}
        </CustomText>
      </ScrollView>
      <ScrollView
        ref={resRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.resultScroll}
      >
        <CustomText style={[styles.result, { color: textColor }]}>
          {result}
        </CustomText>
      </ScrollView>
      <View style={styles.timestampContainer}>
        <CustomText style={[styles.timestamp, { color: textColor }]}>
          {formatDate(timestamp)}
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 1,
  },
  expressionScroll: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    minHeight: 30,
  },
  resultScroll: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    marginTop: 8,
    minHeight: 45,
  },
  expression: {
    fontSize: 20,
    fontWeight: '500',
  },
  result: {
    fontSize: 32,
    fontWeight: '700',
  },
  timestampContainer: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default HistoryDisplay;
