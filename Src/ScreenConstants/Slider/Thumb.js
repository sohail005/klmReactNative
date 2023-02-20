import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

const THUMB_RADIUS = 9;

const Thumb = () => {
  return (
    <View style={styles.root}/>
  );
};
const styles = StyleSheet.create({
    root: {
      width: THUMB_RADIUS * 2,
      height: THUMB_RADIUS * 2,
      borderRadius: THUMB_RADIUS,
      backgroundColor: '#FF5353',
    },
  });
  
  export default memo(Thumb);