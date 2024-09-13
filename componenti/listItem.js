import { Text, StyleSheet, TouchableOpacity, Pressable, PixelRatio } from 'react-native';
import { AntDesign } from '@expo/vector-icons';


export default function ListItem({ titolo, handleClick, isPlaying, openModal, id, mode,fontResponsive, altezzaResponsive }) {
    
   
    
    const index = titolo[0];
    const fontRatio = PixelRatio.getFontScale();
    const getFontSize = size => size/fontRatio;

    return (
        <Pressable onPress={() => openModal(titolo)} style={{ ...stile.box, borderBottomColor: index == 3 ? mode === "dark" ? "#191b36" : "rgba(213,213,213,0.9)" : null, borderBottomWidth: index == 3 ? 1 : null, backgroundColor: mode === "dark" ? "#191b36" : "white",height:altezzaResponsive}} >
            <Text style={{ fontWeight: "700", color: mode === "dark" ? "white" : "#191b36", width: "74%", textDecorationLine: isPlaying.index + 1 == index && isPlaying.id == id ? "underline" : null, color: isPlaying.id == id && isPlaying.index + 1 == index ? "#32CD32" : mode == "dark" ? "white" : "black",fontSize:getFontSize(fontResponsive) }}>{titolo}</Text>
            <TouchableOpacity style={stile.iconContainer} onPress={() => handleClick(index - 1, id)}>
                <AntDesign name={isPlaying.status && isPlaying.index == index - 1 && isPlaying.id == id ? "pausecircleo" : "playcircleo"} style={{ marginBottom: isPlaying.status && isPlaying.index == index - 1 && isPlaying.id == id ? 0 : 0 }} size={30} color="#32CD32" />
            </TouchableOpacity>
        </Pressable>
    )
};

const stile = StyleSheet.create({
    box: {
        width: "90%",
        marginLeft: "5%",
        marginTop: 20,
        backgroundColor: "white",
        elevation: 10,
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 10,
        flexDirection: "row",
        marginBottom: 20,
        borderRadius: 5
    },
    iconContainer: {
        borderLeftColor: "grey",
        borderLeftWidth: 1,
        width: "26%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
    }
})