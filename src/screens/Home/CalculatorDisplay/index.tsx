import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CustomText from '../../../components/CustomText';

interface CalculatorDisplayProps {
  expression: string;
  result: string;
}

const CalculatorDisplay = ({ expression, result }: CalculatorDisplayProps) => {
  const expressionScrollViewRef = useRef<ScrollView>(null); // Reference for expression ScrollView
  const resultScrollViewRef = useRef<ScrollView>(null); // Reference for result ScrollView

  // Auto-scroll to the end whenever the expression changes
  useEffect(() => {
    if (expressionScrollViewRef.current) {
      expressionScrollViewRef.current.scrollToEnd({ animated: true });
    }
    if (resultScrollViewRef.current) {
      resultScrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [expression, result]);

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#d4d4d2', // Updated background color
    borderRadius: 16, // Modern rounded design
    padding: 24, // Increase padding for better spacing
    margin: 20, // Spacing around the display
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.25, // Shadow opacity
    shadowRadius: 3.5, // Shadow radius
    elevation: 5, // Elevation for Android
    borderWidth: 1, // Border width
    borderColor: '#cccccc', // Border color
  },
  expressionScroll: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    minHeight: 40, // Ensures expression section is visible
  },
  resultScroll: {
    flexGrow: 1,
    justifyContent: 'flex-end', // Center the result
    marginTop: 12, // Extra space between expression and result
    minHeight: 60, // Increase height to allow multi-line results
  },
  expression: {
    textAlign: 'center', // Center align for better readability
    color: '#505050', // Updated text color
    fontSize: 24, // Increased font size
    fontWeight: '500', // Slightly bolder weight
  },
  result: {
    textAlign: 'center', // Center-align result text
    fontSize: 42, // Increase font size significantly
    fontWeight: '700', // Make result text bold
    color: '#505050', // Updated text color
    flexWrap: 'wrap', // Allow multi-line display
  },
});

export default CalculatorDisplay;
