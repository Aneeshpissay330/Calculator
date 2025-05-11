import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import CalculatorDisplay from './CalculatorDisplay';
import CalculatorGrid, { CalculatorGridHandle } from './CalculatorGrid';

const Home = () => {
  const navigation = useNavigation();
  const calculatorGridRef = useRef<CalculatorGridHandle>(null);
  const [isScientific, setIsScientific] = useState(false);
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  const handlePress = (label: string) => {
    if (label === 'AC') {
      setExpression('');
      setResult('');
      return;
    }

    if (label === "Backspace") {
      setExpression(prev => prev.slice(0, -1)); // Remove the last character
      return;
    }

    if (label === '=') {
      try {
        let expr = expression
          .replace(/π/g, `${Math.PI}`)
          .replace(/e/g, `${Math.E}`)
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/\^/g, '**');  // Convert ^ to ** for exponentiation

        // Process functions like sin, cos, log, sqrt, abs, etc.
        expr = expr
          .replace(/\bsin(?:\(([^)]+)\)|([^\s()+*/^-]+))/g, (_, a, b) => `Math.sin((${a || b} * Math.PI) / 180)`)
          .replace(/\bcos(?:\(([^)]+)\)|([^\s()+*/^-]+))/g, (_, a, b) => `Math.cos((${a || b} * Math.PI) / 180)`)
          .replace(/\btan(?:\(([^)]+)\)|([^\s()+*/^-]+))/g, (_, a, b) => `Math.tan((${a || b} * Math.PI) / 180)`)
          .replace(/\bsqrt(?:\(([^)]+)\)|([^\s()+*/^-]+))/g, (_, a, b) => `Math.sqrt(${a || b})`)
          .replace(/\blog(?:\(([^)]+)\)|([^\s()+*/^-]+))/g, (_, a, b) => `Math.log10(${a || b})`)
          .replace(/\bln(?:\(([^)]+)\)|([^\s()+*/^-]+))/g, (_, a, b) => `Math.log(${a || b})`)
          .replace(/\babs(?:\(([^)]+)\)|([^\s()+*/^-]+))/g, (_, a, b) => `Math.abs(${a || b})`); // Absolute value function

        const result = Function(`"use strict"; return (${expr})`)(); // Evaluate the expression safely
        setResult(result.toString());
      } catch (err) {
        setResult('Error'); // If there's an error, display 'Error'
      }
      return;
    }

    setExpression(prev => prev + label); // Append the new label to the expression
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => calculatorGridRef.current?.handleToggle()}
          style={({ pressed }) => ({
            marginRight: 15,
            padding: 8,
            borderRadius: 8,
            backgroundColor: pressed ? '#EDE7F6' : 'transparent',
          })}
        >
          <MaterialDesignIcons
            name={isScientific ? 'numeric' : 'function-variant'}
            color="#505050"
            size={24}
          />
        </Pressable>
      ),
    });
  }, [navigation, isScientific]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <CalculatorDisplay expression={expression} result={result} />

      {/* Container to push CalculatorGrid to the bottom */}
      <View style={{ flex: 1 }} />

      {/* CalculatorGrid at the bottom */}
      <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <CalculatorGrid
          ref={calculatorGridRef}
          isScientific={isScientific}
          setIsScientific={setIsScientific}
          onPress={handlePress}
        />
      </View>
    </View>
  );
};

export default Home;
