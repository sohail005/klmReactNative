import React, { memo } from 'react';
import {StyleSheet, View} from 'react-native';

const RailSelected = () => {
  return (
    <View style={styles.root}/>
  );
};

export default memo(RailSelected);

const styles = StyleSheet.create({
  root: {
      flex:1,
    height: 4,
    backgroundColor: '#FF5353',
    borderRadius: 2,
  },
});