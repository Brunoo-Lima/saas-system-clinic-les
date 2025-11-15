import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';

interface ISelectMonthProps {
  selectedMonth: string;
  onChangeMonth: (month: string) => void;
}

const months = [
  { label: 'Janeiro', value: 'Jan' },
  { label: 'Fevereiro', value: 'Fev' },
  { label: 'Março', value: 'Mar' },
  { label: 'Abril', value: 'Abr' },
  { label: 'Maio', value: 'Mai' },
  { label: 'Junho', value: 'Jun' },
  { label: 'Julho', value: 'Jul' },
  { label: 'Agosto', value: 'Ago' },
  { label: 'Setembro', value: 'Set' },
  { label: 'Outubro', value: 'Out' },
  { label: 'Novembro', value: 'Nov' },
  { label: 'Dezembro', value: 'Dez' },
];

export const SelectMonth = ({
  selectedMonth,
  onChangeMonth,
}: ISelectMonthProps) => {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <Pressable style={styles.button} onPress={() => setOpen(!open)}>
        <Text style={styles.buttonText}>
          {months.find((m) => m.value === selectedMonth)?.label}
        </Text>
        <ChevronDown size={20} color="#5B5CFF" />
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)} />

        <View style={styles.dropdown}>
          <FlatList
            data={months}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <Pressable
                style={styles.item}
                onPress={() => {
                  onChangeMonth(item.value);
                  setOpen(false);
                }}
              >
                <Text style={styles.itemText}>{item.label}</Text>
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'inherit',
  },
  overlay: {
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    top: 120,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    maxHeight: 250,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});
