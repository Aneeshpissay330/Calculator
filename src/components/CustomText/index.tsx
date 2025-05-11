import { View, Text, StyleProp, TextStyle } from 'react-native'
import React, { FC } from 'react'

interface CustomTextProps {
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
}

const CustomText : FC<CustomTextProps> = ({ children, style }) => {
    return (
        <Text style={[style, { fontFamily: 'RobotoMono-Regular' }]}>{children}</Text>
    )
}

export default CustomText