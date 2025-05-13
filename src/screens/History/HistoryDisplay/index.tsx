import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CustomText from '../../../components/CustomText';

interface HistoryDisplayProps {
  expression: string;
  result: string;
  timestamp: number; // Unix timestamp in ms
}

const HistoryDisplay = ({ expression, result, timestamp }: HistoryDisplayProps) => {
  const expressionScrollViewRef = useRef<ScrollView>(null);
  const resultScrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    expressionScrollViewRef.current?.scrollToEnd({ animated: true });
    resultScrollViewRef.current?.scrollToEnd({ animated: true });
  }, [expression, result]);

  const formatDate = (ts: number) => {
    const date = new Date(ts);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={expressionScrollViewRef}
        horizontal
        contentContainerStyle={styles.expressionScroll}
        showsHorizontalScrollIndicator={false}
      >
        <CustomText style={styles.expression}>{expression}</CustomText>
      </ScrollView>
      <ScrollView
        ref={resultScrollViewRef}
        horizontal
        contentContainerStyle={styles.resultScroll}
        showsHorizontalScrollIndicator={false}
      >
        <CustomText style={styles.result}>{result}</CustomText>
      </ScrollView>
      <View style={styles.timestampContainer}>
        <CustomText style={styles.timestamp}>{formatDate(timestamp)}</CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f7',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
    color: '#505050',
  },
  result: {
    fontSize: 32,
    fontWeight: '700',
    color: '#505050',
  },
  timestampContainer: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default HistoryDisplay;
