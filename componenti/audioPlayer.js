import { Dimensions, Modal, StyleSheet, View, ScrollView, Text, TouchableOpacity, Image,PixelRatio } from "react-native";
import { SimpleLineIcons, AntDesign } from '@expo/vector-icons';
import Slider from "@react-native-community/slider";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";


// utils
import { toTime, calcolaTempo, renderCurrentTime } from '../utils.js';
import { useState, useRef } from "react";

export default function AudioPlayer({ modalVisible, data, closeModal, id, titolo, handleClick, isPlaying, durata, time, completeSliding, mode,font }) {
    const width = Dimensions.get("window").width;
    const index = titolo[0];
    let [visible, setVisible] = useState(true);

    let refer = useRef(null);

    // font ratio
    const fontRatio = PixelRatio.getFontScale();
    const getFontSize = size => size/fontRatio;

    const Immagine = ({ uri }) => {
        const stile = { width: width, alignItems: "center" }
        return (
            <View style={stile} >
                <Image source={{ uri: uri }} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
            </View>
        )
    }
   

    return (
        <Modal
            animationType='slide'
            visible={modalVisible}>
            <View style={{ ...styles.assetContainer, backgroundColor: mode === "dark" ? "#111224" : "white" }}>
                <TouchableOpacity onPress={() => closeModal()} style={styles.header}><SimpleLineIcons name="arrow-down" size={50} color={mode === "dark" ? "white" : "grey"}  /></TouchableOpacity>
                <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}><Text style={{ fontSize: getFontSize(25), fontWeight: "600", color: mode === "dark" ? "white" : "black" }}>STEP {index}</Text></View>
                <ScrollView style={{ padding: 30, backgroundColor: "transparent" }}>
                    <Text style={{ fontSize: getFontSize(font.h), fontWeight: 500, textAlign: "center", paddingBottom: 50, paddingLeft: 20, paddingRight: 20, lineHeight: getFontSize(font.lh), color: mode === "dark" ? "white" : "black" }}>
                        {data.testo}
                    </Text>
                </ScrollView>
                <MaterialCommunityIcons onPress={() => setVisible(visible ? false : true)} name={`arrow-${visible ? "down" : "up"}-drop-circle`} size={24} color="grey" style={{ marginLeft: 10, width: 100 }} />
                <ScrollView
                    ref={refer}
                    style={{ width: "100%", height: visible ? "22%" : "0%", backgroundColor: mode === "dark" ? "#222447" : "rgba(220,230,230,0.5)" }}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}>
                    {data.immagini.map(img => {
                        return (
                            <Immagine uri={img} key={img} />
                        )
                    })}
                </ScrollView>
            </View>
            <View style={{ ...styles.controlsContainer, backgroundColor: mode === "dark" ? "#222447" : "rgba(220,230,230,0.5)" }}>
                <Text style={{ position: "absolute", left: "15%", top: 10, color: mode === "dark" ? "white" : "black",fontSize:getFontSize(font.h-5) }}>{renderCurrentTime(time) == "0NaN:0NaN" ? "00:00" : renderCurrentTime(time)}</Text>
                <Text style={{ position: "absolute", right: "15%", top: 10, color: mode === "dark" ? "white" : "black",fontSize:getFontSize(font.h -5)}}>{toTime(durata)}</Text>
                <View style={{ width: "40%", justifyContent: "space-around", height: "40%", flexDirection: "row" }}>
                    <AntDesign name="stepbackward" size={30} color={mode === "dark" ? "white" : "black"} onPress={() => handleClick(index - 2, id, "prev",refer)} />
                    <AntDesign onPress={() => handleClick(index - 1, id)} size={30} color={mode === "dark" ? "white" : "black"} name={isPlaying.status && isPlaying.index == index - 1 && isPlaying.id == id ? "pausecircleo" : "playcircleo"} />
                    <AntDesign onPress={() => handleClick(index, id, "next",refer)} name="stepforward" size={30} color={mode === "dark" ? "white" : "black"} />
                </View>
                <Slider
                    maximumTrackTintColor={mode === "dark" ? "white" : "black"}
                    value={calcolaTempo(time)}
                    maximumValue={1}
                    onSlidingComplete={(value) => {
                        completeSliding(value)
                    }}
                    style={{ ...styles.slider, top: 10, position: "absolute" }} thumbTintColor="#32CD32" minimumTrackTintColor="#32CD32" />
            </View>
            <StatusBar backgroundColor="white" />
        </Modal>
    )
};

const styles = StyleSheet.create({
    assetContainer: {
        width: "100%",
        height: "90%"
    },
    controlsContainer: {
        width: "100%",
        height: "15%",
        justifyContent: "center",
        alignItems: "center"
    },
    header: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    slider: {
        width: "45%"
    }
})