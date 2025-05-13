import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { addHistoryItem } from '../../features/history';
import { colors } from '../../theme/colors';
import CalculatorDisplay from './CalculatorDisplay';
import CalculatorGrid, { CalculatorGridHandle } from './CalculatorGrid';

export type RootStackParamList = {
  History: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'History'>;

const Home = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const calculatorGridRef = useRef<CalculatorGridHandle>(null);
  const [isScientific, setIsScientific] = useState(false);
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  const dispatch = useDispatch();

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
          .replace(/\^/g, '**');

        expr = expr
          .replace(/\bsin(?:\(([^)]+)\)|([^\s()+*/^-]+))/g, (_, a, b) => `Math.sin((${a || b} * Math.PI) / 180)`)
          .replace(/\bcos(?:\(([^)]+)\)|([^\s()+*/^-]+))/g, (_, a, b) => `Math.cos((${a || b} * Math.PI) / 180)`)
          .replace(/\btan(?:\(([^)]+)\)|([^\s()+*/^-]+))/g, (_, a, b) => `Math.tan((${a || b} * Math.PI) / 180)`)
          .replace(/\bsqrt(?:\(([^)]+)\)|([^\s()+*/^-]+))/g, (_, a, b) => `Math.sqrt(${a || b})`)
          .replace(/\blog(?:\(([^)]+)\)|([^\s()+*/^-]+))/g, (_, a, b) => `Math.log10(${a || b})`)
          .replace(/\bln(?:\(([^)]+)\)|([^\s()+*/^-]+))/g, (_, a, b) => `Math.log(${a || b})`)
          .replace(/\babs(?:\(([^)]+)\)|([^\s()+*/^-]+))/g, (_, a, b) => `Math.abs(${a || b})`);

        const result = Function(`"use strict"; return (${expr})`)();
        const resultString = result.toString();
        setResult(resultString);

        // Add to history here
        dispatch(addHistoryItem({
          expression,
          result: resultString,
          timestamp: Date.now(),
        }));
      } catch (err) {
        setResult('Error');
      }
      return;
    }

    setExpression(prev => prev + label); // Append the new label to the expression
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <React.Fragment>
          <Pressable
            onPress={() => calculatorGridRef.current?.handleToggle()}
            style={({ pressed }) => ({
              marginRight: 15,
              padding: 8,
              borderRadius: 8,
              backgroundColor: pressed ? '#ffffff' : 'transparent',
            })}
          >
            <MaterialDesignIcons
              name={isScientific ? 'numeric' : 'function-variant'}
              color="#505050"
              size={24}
            />
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("History")}
            style={({ pressed }) => ({
              marginRight: 15,
              padding: 8,
              borderRadius: 8,
              backgroundColor: pressed ? '#ffffff' : 'transparent',
            })}
          >
            <MaterialDesignIcons
              name="history"
              color="#505050"
              size={24}
            />
          </Pressable>
        </React.Fragment>
      ),
    });
  }, [navigation, isScientific]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <CalculatorDisplay expression={expression} result={result} />

      {/* Container to push CalculatorGrid to the bottom */}
      <View style={{ flex: 1 }} />

      {/* CalculatorGrid at the bottom */}
      <View style={{ position: 'absolute', bottom: -5, width: '100%' }}>
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
