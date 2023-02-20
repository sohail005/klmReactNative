import React, { useState, useEffect } from 'react';
import { Modal,TouchableOpacity, Text, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const InformationPopup = ({ message }) => {
    const [responseModalVisible, setResponseModalVisible] = useState(false);

    useEffect(() => {
        setResponseModalVisible(true);
        setTimeout(() => {
            setResponseModalVisible(false);
        }, 5000);

    }, []);

    return (
        <View style={{ height: 30 }}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={responseModalVisible}
                onRequestClose={() => {
                }}>
                {message !== '' && (
                    <TouchableOpacity
                        testID={'btnclosepopup'} onPress={()=> setResponseModalVisible(false)} style={{flex:1 }}>
                        <View
                            style={{
                                height: '10%',
                                marginTop: 'auto',
                                backgroundColor: '#fff',
                                borderWidth: 1,
                                borderColor: '#d2d2d2',
                                justifyContent: 'center'
                            }}>

                            <View style={{ flexDirection:'row',alignItems:'center' }}>
                                <AntDesign style={{paddingHorizontal:10}} size={14} color={'#000'} name={'exclamationcircleo'} />
                                <Text style={{  fontSize: 14,marginRight:60, color: '#000', textAlign: 'auto' }}>{message}</Text>
                            </View>
                        </View>

                    </TouchableOpacity>
                )}

            </Modal>
            {/* 
            <TouchableHighlight
                onPress={() => {
                    showModal();
                }}>
                <Text>Show Modal</Text>
            </TouchableHighlight> */}
        </View>
    );
};

export default InformationPopup;