import { View, Modal, StyleSheet, Image, TouchableOpacity, Text,SafeAreaView,PixelRatio } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function InfoModal({ infoModalVisible, closeInfoModal,font }) {
    const fontRatio = PixelRatio.getFontScale();
    const getFontScale = size => size/fontRatio;

    return (
        <SafeAreaView>
            <Modal
                animationType="slide"
                transparent
                style={stile.modal}
                visible={infoModalVisible}
            >
                <View style={{...stile.modalContainer}}>
                    <TouchableOpacity style={stile.closer} onPress={() => closeInfoModal()}>
                        <MaterialCommunityIcons name="arrow-down-drop-circle" size={24} color="black" />
                    </TouchableOpacity>
                    <Image source={require("../assets/UI/logo_associazione_no_bg.png")} resizeMode="contain" style={{ width: "70%" }} />
                    <Text style={{...stile.versione,fontSize:getFontScale(font)}}>App v1.0.0</Text>
                </View>
            </Modal>
        </SafeAreaView>
    )
};

const stile = StyleSheet.create({
    modal: {
        position: "absolute",
        bottom: 0,
        right: 0,
        left: 0,
        height: 100
    },
    modalContainer: {
        width: "100%",
        height:"30%",
        backgroundColor: "#98ca60",
        position: "absolute",
        bottom: 0,
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        justifyContent: "center",
        alignItems: "center",
    },
    closer: {
        position: "absolute",
        right: 15,
        top: 15
    },
    versione:{
        color:"black",
        position:"absolute",
        bottom:5
    }
})