import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Alert, FlatList, Pressable } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearHistory } from '../../features/history';
import HistoryDisplay from './HistoryDisplay';

const History = () => {
  const history = useAppSelector((state) => state.history);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear the history?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => dispatch(clearHistory()),
        },
      ],
      { cancelable: true }
    );
  };
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={handleClearHistory}
          style={({ pressed }) => ({
            marginRight: 15,
            padding: 8,
            borderRadius: 8,
            backgroundColor: pressed ? '#ffffff' : 'transparent',
          })}
        >
          <MaterialDesignIcons name="delete" color="#505050" size={24} />
        </Pressable>
      ),
    });
  }, [navigation]);
  return (
    <FlatList
      data={history}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => (
        <HistoryDisplay
          expression={item.expression}
          result={item.result}
          timestamp={item.timestamp}
        />
      )}
    />
  )
}

export default History;