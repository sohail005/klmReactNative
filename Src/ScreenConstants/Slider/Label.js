import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Label = ({ text, ...restProps }) => {
  return (
    <View style={styles.root} {...restProps}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position:'absolute',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
    top:-50
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
});

export default Label;