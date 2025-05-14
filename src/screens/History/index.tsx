// src/screens/History.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  FlatList,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearHistory } from '../../features/history';
import HistoryDisplay from './HistoryDisplay';
import CustomText from '../../components/CustomText';

const History: React.FC = () => {
  const history     = useAppSelector(state => state.history);
  const isDarkMode  = useAppSelector(state => state.theme.darkMode);
  const dispatch    = useAppDispatch();
  const navigation  = useNavigation();
  const [showModal, setShowModal] = useState(false);

  const bgColor   = isDarkMode ? '#505050' : '#d4d4d2';
  const textColor = isDarkMode ? '#d4d4d2' : '#505050';

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: bgColor },
      headerTintColor: textColor,
      headerRight: () => (
        <Pressable
          onPress={() => setShowModal(true)}
          style={({ pressed }) => ({
            marginRight: 15,
            padding: 8,
            borderRadius: 8,
            backgroundColor: pressed ? bgColor : 'transparent',
          })}
        >
          <MaterialIcon name="delete" size={24} color={textColor} />
        </Pressable>
      ),
    });
  }, [navigation, isDarkMode]);

  const confirmClear = () => {
    dispatch(clearHistory());
    setShowModal(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: bgColor, borderColor: textColor }]}>
            <CustomText style={[styles.modalTitle, { color: textColor }]}>
              Clear History
            </CustomText>
            <CustomText style={[styles.modalMessage, { color: textColor }]}>
              Are you sure you want to clear the history?
            </CustomText>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, { borderColor: textColor }]}
                onPress={() => setShowModal(false)}
              >
                <CustomText style={[styles.buttonText, { color: textColor }]}>
                  Cancel
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { borderColor: textColor }]}
                onPress={confirmClear}
              >
                <CustomText style={[styles.buttonText, { color: textColor }]}>
                  Yes
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <CustomText style={{ color: textColor, fontSize: 16 }}>
            No history yet
          </CustomText>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <HistoryDisplay
              expression={item.expression}
              result={item.result}
              timestamp={item.timestamp}
              isDarkMode={isDarkMode}
            />
          )}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default History;
