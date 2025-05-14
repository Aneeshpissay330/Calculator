// src/screens/Home.tsx

import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import Animated, { Layout, FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CustomText from '../../components/CustomText';
import CalculatorButton from '../../components/CalculatorButton';
import { useCalculatorLogic } from '../../hooks/useCalculatorLogic';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toggleDarkMode } from '../../features/theme';
import { addHistoryItem } from '../../features/history';

type RootStackParamList = { History: undefined };
type HomeNavProp = StackNavigationProp<RootStackParamList, 'History'>;

const functionLabels = ['sin', 'cos', 'tan', 'log', 'ln', '√'];

const Home: React.FC = () => {
  const navigation = useNavigation<HomeNavProp>();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector(s => s.theme.darkMode);
  const history = useAppSelector(s => s.history);
  const [isScientific, setIsScientific] = useState(false);
  const insets = useSafeAreaInsets();

  const {
    input,
    result,
    memory,
    handleInput,
    handleAllClear,
    handleClearEntry,
    handleBackspace,
    handleBrackets,
    handleMemoryClear,
    handleMemoryRecall,
    handleMemoryAdd,
    handleEvaluate,
  } = useCalculatorLogic();

  const handleButtonPress = (label: string) => {
    if (label === 'AC') {
      handleAllClear();
      return;
    }
    if (label === 'C') {
      handleClearEntry();
      return;
    }
    if (label === '=') {
      const res = handleEvaluate();
      if (res !== null) {
        dispatch(addHistoryItem({ expression: input, result: res, timestamp: Date.now() }));
      }
      return;
    }
    if (label === '()') {
      handleBrackets();
      return;
    }
    if (label === 'MC') {
      handleMemoryClear();
      return;
    }
    if (label === 'MR') {
      handleMemoryRecall();
      return;
    }
    if (label === 'M+') {
      handleMemoryAdd();
      return;
    }
    if (functionLabels.includes(label)) {
      handleInput(`${label}(`);
      return;
    }
    if (label === '!') {
      handleInput('!');
      return;
    }

    handleInput(label);
  };

  // Colors only #505050 / #d4d4d2
  const bgColor = isDarkMode ? '#505050' : '#d4d4d2';
  const textColor = isDarkMode ? '#d4d4d2' : '#505050';

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const memoryLabels = ['MC', 'MR', 'M+'];
  const basicLabels = [
    'C', '()', '%', '÷',
    '7', '8', '9', '×',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    'AC', '0', '.', '='
  ];
  const sciLabels = ['sin', 'cos', 'tan', 'log', 'ln', '√', '^', 'π', 'e', '!'];

  const chunk = (arr: string[], size: number) => {
    const out: string[][] = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  };

  const memoryRow = chunk(memoryLabels, memoryLabels.length)[0];
  const basicRows = chunk(basicLabels, 4);
  const sciRows = isScientific ? chunk(sciLabels, 5) : [];

  const buttonSize = isScientific ? 50 : 70;
  const buttonRadius = buttonSize / 2;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: bgColor,
        elevation: 0,
        shadowOpacity: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 0,
      },
      headerTintColor: textColor,
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16, gap: 12 }}>
          <TouchableOpacity onPress={() => {
            if (history.length) navigation.navigate('History');
            else if (Platform.OS === 'android') ToastAndroid.show('No history yet', ToastAndroid.SHORT);
            else Alert.alert('No history yet');
          }}>
            <MaterialIcons name="history" size={24} color={textColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsScientific(v => !v)}>
            <MaterialIcons
              name={isScientific ? 'calculate' : 'functions'}
              size={24}
              color={textColor}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dispatch(toggleDarkMode())}>
            <MaterialIcons
              name={isDarkMode ? 'light-mode' : 'dark-mode'}
              size={24}
              color={textColor}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, isDarkMode, isScientific, history.length]);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: 20,
        paddingBottom: insets.bottom + 20,
        alignItems: 'center',
        backgroundColor: bgColor,
      }}
    >
      <View style={{ width: '90%', marginTop: 'auto', alignItems: 'center' }}>
        {/* Display */}
        <View style={{ width: '100%', alignItems: 'flex-end', marginBottom: 16 }}>
          <CustomText style={{ fontSize: 18, color: textColor }}>{input}</CustomText>
          <CustomText style={{ fontSize: 32, fontWeight: 'bold', color: textColor }}>{result}</CustomText>
          {input.length > 0 && (
            <CalculatorButton
              onPress={handleBackspace}
              style={{
                alignSelf: 'flex-end',
                marginTop: 8,
                backgroundColor: bgColor,
                width: buttonSize,
                height: buttonSize,
                borderRadius: buttonRadius,
              }}
            >
              <MaterialIcons name="backspace" size={buttonSize * 0.5} color={textColor} />
            </CalculatorButton>
          )}
        </View>

        {/* Memory Row */}
        <Animated.View
          layout={Layout.springify()}
          style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 12 }}
        >
          {memoryRow.map(label => (
            <CalculatorButton
              key={label}
              label={label}
              onPress={() => handleButtonPress(label)}
              style={{ backgroundColor: bgColor, width: buttonSize, height: buttonSize, borderRadius: buttonRadius }}
              labelStyle={{ color: textColor, fontSize: 14 }}
            />
          ))}
        </Animated.View>

        {/* Scientific Row */}
        {isScientific && (
          <Animated.View
            layout={Layout.springify()}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            style={{ marginBottom: 12, width: '100%' }}
          >
            {sciRows.map((row, i) => (
              <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                {row.map(label => (
                  <CalculatorButton
                    key={label}
                    label={label}
                    onPress={() => handleButtonPress(label)}
                    style={{ backgroundColor: bgColor, width: buttonSize, height: buttonSize, borderRadius: buttonRadius }}
                    labelStyle={{ color: textColor, fontSize: 14 }}
                  />
                ))}
              </View>
            ))}
          </Animated.View>
        )}

        {/* Basic Rows */}
        <Animated.View layout={Layout.springify()} style={{ width: '100%', maxWidth: isTablet ? 500 : '100%' }}>
          {basicRows.map((row, i) => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              {row.map(label => (
                <CalculatorButton
                  key={label}
                  label={label}
                  onPress={() => handleButtonPress(label)}
                  style={{
                    backgroundColor: label === 'AC' ? '#E57373' : bgColor,
                    width: buttonSize,
                    height: buttonSize,
                    borderRadius: buttonRadius,
                  }}
                  labelStyle={{ color: textColor, fontSize: label.length > 1 ? 14 : 18 }}
                />
              ))}
            </View>
          ))}
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default Home;