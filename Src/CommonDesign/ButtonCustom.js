import React from 'react';
import { View, Text, StyleSheet, Dimensions,Platform } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';

const w = Dimensions.get('screen').width;
const h = Dimensions.get('screen').height;

const ButtonCustom = ({ Title, BtuSize, TextColor, BtuColor }) => {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', }}>
            {/* <View style={styles.diamondLeft} /> */}
            <Octicons style={{left: 0.4}} name={'triangle-left'} size={60} color={BtuColor == undefined ? '#900c19' : BtuColor} />
            <Text style={{ color: TextColor == undefined ? '#f2c452' : TextColor, backgroundColor: BtuColor == undefined ? '#900c19' : BtuColor, fontSize: 14,  paddingVertical: Platform.OS === 'ios' ? 14 : 12.8, paddingHorizontal: BtuSize == undefined ? 12 : BtuSize, textAlign: 'center', textTransform:'uppercase' }}>{Title}</Text>
            <Octicons name={'triangle-right'} size={60} color={BtuColor == undefined ? '#900c19' : BtuColor} />

        </View>
    )
}

const styles = StyleSheet.create({
    diamondRight: {

        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 22.5,
        borderRightWidth: 22.5,
        borderBottomWidth: 45.5,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "#900c19",
        transform: [{ rotate: "90deg" }]
    },
    diamondLeft: {
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 22.5,
        borderRightWidth: 22.5,
        borderBottomWidth: 45.5,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "#900c19",
        transform: [{ rotate: "-90deg" }]
    },
})
export default ButtonCustom;
