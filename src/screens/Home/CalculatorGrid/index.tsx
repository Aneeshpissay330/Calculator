import React, { useImperativeHandle } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import CustomText from '../../../components/CustomText';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { colors } from '../../../theme/colors';

interface CalculatorGridProp {
    isScientific: boolean;
    setIsScientific: React.Dispatch<React.SetStateAction<boolean>>;
    onPress: (label: string) => void;
}

const screenWidth = Dimensions.get('window').width;
const spacing = 12;
const scientificCols = 5;
const normalCols = 4;

const scientificLayout = [
    ['sin', 'cos', 'tan', 'π', 'exp'],
    ['log', 'AC', '(', ')', '/'],
    ['ln', '7', '8', '9', '*'],
    ['e', '4', '5', '6', '-'],
    ['^', '1', '2', '3', '+'],
    ['abs', 'Backspace', '0', '.', '='],
];

export interface CalculatorGridHandle {
    handleToggle: () => void;
}

interface CalculatorGridProp {
    isScientific: boolean;
    setIsScientific: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalculatorGrid = React.forwardRef<CalculatorGridHandle, CalculatorGridProp>(
    ({ isScientific, setIsScientific, onPress }, ref) => {
        const columnCount = isScientific ? scientificCols : normalCols;

        const scale = useSharedValue(1);
        const scientificOpacity = useSharedValue(0);

        const buttonSize = (screenWidth - (columnCount + 1) * spacing) / columnCount;

        const handleToggle = () => {
            if (isScientific) {
                // Quickly zoom in when switching back to normal mode
                scale.value = withTiming(0.85, {
                    duration: 200, // Faster scaling-up effect
                    easing: Easing.out(Easing.ease),
                });

                scientificOpacity.value = withTiming(0, {
                    duration: 200, // Make opacity transition match scaling speed
                    easing: Easing.out(Easing.ease),
                });

                // Smoothly settle back to default size after zooming in
                setTimeout(() => {
                    scale.value = withTiming(1, {
                        duration: 150,
                        easing: Easing.out(Easing.ease),
                    });
                    setIsScientific(false);
                }, 200);
            } else {
                // Normal to scientific transition (keep it smooth)
                scale.value = withTiming(0.85, {
                    duration: 300,
                    easing: Easing.inOut(Easing.ease),
                });

                scientificOpacity.value = withTiming(1, {
                    duration: 300,
                    easing: Easing.inOut(Easing.ease),
                });

                setIsScientific(true);
            }
        };

        const getColor = (label: string) => {
            if (label === 'AC') return '#FF0000'; // Keep red for AC (clear)
            if (['(', ')', '='].includes(label)) return '#505050'; // Dark gray for special ops
            if (['+', '-', '*', '/'].includes(label)) return '#505050'; // Dark gray for basic operators
            if (['sin', 'cos', 'tan', 'π', 'exp', 'log', 'ln', 'e', '^', 'abs'].includes(label))
                return '#d4d4d2'; // Light gray for scientific functions (to blend with background)
            return '#505050'; // Default to dark gray
        };

        const isScientificButton = (label: string) =>
            ['sin', 'cos', 'tan', 'π', 'exp', 'log', 'ln', 'e', '^', 'abs'].includes(label);

        const animatedNormalStyle = useAnimatedStyle(() => ({
            transform: [{ scale: scale.value }],
        }));

        const renderButton = (label: string, id: string) => {
            const baseColor = getColor(label);
            const isSci = isScientificButton(label);

            const animatedStyle = useAnimatedStyle(() => ({
                opacity: isSci ? scientificOpacity.value : 1,
                width: withTiming(isSci ? (scientificOpacity.value === 0 ? 0 : buttonSize) : buttonSize, {
                    duration: 300, // Reduced duration for faster size increase
                    easing: Easing.out(Easing.ease),
                }),
                height: withTiming(isSci ? (scientificOpacity.value === 0 ? 0 : buttonSize) : buttonSize, {
                    duration: 300,
                    easing: Easing.out(Easing.ease),
                }),
                transform: [{
                    scale: withTiming(isSci ? scientificOpacity.value : 1, {
                        duration: 300,
                        easing: Easing.out(Easing.ease),
                    })
                }],
                marginRight: isSci ? (scientificOpacity.value === 0 ? 0 : spacing) : spacing,
                backgroundColor: baseColor,
            }));

            return (
                <Pressable key={id} onPress={() => onPress(label)}>
                    <Animated.View style={[styles.button, animatedStyle]}>
                        <CustomText style={styles.buttonCustomText}>{label === "Backspace" ? <MaterialDesignIcons color={colors.white} size={16} name='backspace' /> : label}</CustomText>
                    </Animated.View>
                </Pressable>
            );
        };

        useImperativeHandle(ref, () => ({
            handleToggle
        }));
        return (
            <View style={{ padding: spacing, flex: 1 }}>
                {scientificLayout.map((row, rowIndex) => (
                    <Animated.View
                        key={`row-${rowIndex}`}
                        style={[
                            styles.row,
                            animatedNormalStyle,
                            { marginBottom: spacing },
                        ]}
                    >
                        {row.map((label, colIndex) =>
                            renderButton(label, `${rowIndex}-${colIndex}`)
                        )}
                    </Animated.View>
                ))}
            </View>
        );
    });

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    button: {
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonCustomText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    toggleButton: {
        backgroundColor: '#10b981',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: spacing,
    },
    toggleCustomText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default CalculatorGrid;
