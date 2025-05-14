import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  label?: string;
  children?: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
  labelStyle?: object;
}

const CalculatorButton: React.FC<Props> = ({ label, children, onPress, style, labelStyle }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.buttonOuter, style]}>
      {children
        ? children
        : <Text style={[styles.label, labelStyle]}>{label}</Text>
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonOuter: {
    backgroundColor: '#d4d4d2',
    height: 70,
    width: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  label: {
    fontSize: 22,
    color: '#505050',
    fontWeight: '600',
  },
});

export default CalculatorButton;
