import "react-native-gesture-handler";
import { StatusBar } from 'expo-status-bar';
import { Text, StyleSheet, Image, TouchableOpacity, View, SafeAreaView, FlatList, PixelRatio } from 'react-native';
import { useState } from 'react';
import { Audio } from "expo-av";
import Svg, { Path } from "react-native-svg";
import { Dimensions } from "react-native";
import { Entypo, Feather } from '@expo/vector-icons';



const lunghezza = Dimensions.get("window").width;
const altezza = Dimensions.get("window").height;



// data
import data from './translator.js';
const listaAudio = {
  italiano: [require("./assets/audioguide/ITA/1_nuragico_e_serbissi_fino_allo_stage_3.mp3"), require("./assets/audioguide/ITA/2_nuragico_da_stage_3_alla_grotta.mp3"), require("./assets/audioguide/ITA/3_la_grotta_serbissi.mp3")],
  inglese: [require("./assets/audioguide/ENG/1_nuragic_and_serbissi_to_stage_3.mp3"), require("./assets/audioguide/ENG/2_nuragic_from_stage_to_cave.mp3"), require("./assets/audioguide/ENG/3_the_cave.mp3")],
  francese: [require("./assets/audioguide/FRA/1_nuragic_et_serbissi_jusqu_au_etage_3.mp3"), require("./assets/audioguide/FRA/2_du_troisieme_etage_a_la_grotte.mp3"), require("./assets/audioguide/FRA/3_la_grotte_de_serbissi.mp3")],
  italianoURL: ["./assets/audioguide/ITA/1_nuragico_e_serbissi_fino_allo_stage_3.mp3", "./assets/audioguide/ITA/2_nuragico_da_stage_3_alla_grotta.mp3", "./assets/audioguide/ITA/3_la_grotta_serbissi.mp3"],
  ingleseURL: ["./assets/audioguide/ENG/1_nuragic_and_serbissi_to_stage_3.mp3", "./assets/audioguide/ENG/2_nuragic_from_stage_to_cave.mp3", "./assets/audioguide/ENG/3_the_cave.mp3"],
  franceseURL: ["./assets/audioguide/FRA/1_nuragic_et_serbissi_jusqu_au_etage_3.mp3", "./assets/audioguide/FRA/2_du_troisieme_etage_a_la_grotte.mp3", "./assets/audioguide/FRA/3_la_grotte_de_serbissi.mp3"]
}


// componenti
import ListItem from "./componenti/listItem.js";
import AudioPlayer from "./componenti/audioPlayer.js";
import InfoModal from "./componenti/infoModal.js";



export default function App() {
  let [modalVisible, setModalVisible] = useState(false);
  let [language, setLanguage] = useState("italiano");
  let [currentData, setCurrentData] = useState({ immagini: [], titolo: "" });
  let [playbackObject, setPlaybackObject] = useState(null);
  let [audioStatus, setAudioStatus] = useState(null);
  let [isPlaying, setIsplaying] = useState({ status: false, index: null, id: null });
  let [infoModalShow, setInfoModalShow] = useState(false);
  let [time, setTime] = useState({});
  let [mode, setMode] = useState("light");
  let [isEsterVisible, setIsEsterVisible] = useState(false);

  // responsive rules
  let altezzaResponsive = () => {
    if (altezza > 1000) return 100
    return 70
  }

  let fontResponsive = () => {
    if (altezza > 1000) return 22;
    return 15
  }

  let fontResponsiveTitle = () => {
    if (altezza > 1000) return 30;
    return 18
  }



  let fontForTesto = ()=>{
    if(altezza > 1000) return {h:30,lh:40}
    return {h:20,lh:25}
  }
  // font ratio
  const fontRatio = PixelRatio.getFontScale();
  const getFontScale = size => size / fontRatio;

  let audio;
  async function statusUpdater(audioStatus) {

    setTime({ curr: audioStatus.positionMillis, max: audioStatus.durationMillis });
    if (audioStatus.didJustFinish) {
      try {
        setIsplaying({ ...isPlaying, status: false });
        setTime({ ...time, curr: 0 });
        try {
          await playbackObject.stopAsync();
        } catch (err) {
          audio.stopAsync();
        }
      } catch (err) {
        console.log(err);
      };
    }

  }
  async function completeSliding(value) {
    const v = Math.floor(audioStatus.durationMillis * value);
    if (isPlaying.status) {
      try {
        setIsplaying({ ...isPlaying, status: true })
        setTime({ ...time, curr: v });
        await playbackObject.setPositionAsync(v);
        await playbackObject.playAsync();
      } catch (err) { console.log(err) }
    } else {
      try {
        setTime({ ...time, curr: v });
        await playbackObject.setPositionAsync(v);
      } catch (err) { console.log(err) }
    };
  };


  async function handleClick(index, id, pos, refer) {

    const URL = listaAudio[language + "URL"][index];
    const urlToLoad = listaAudio[language][index];
    if (pos) {
      if (pos === "prev" && index === -1) return await playbackObject.replayAsync(); // se è il primo restart a prescindere
      if (pos === "prev" && time.curr / 1000 > 5) { // se sono passati 5 secondi restart
        await playbackObject.replayAsync();
        return;
      }

      if (!listaAudio[language + "URL"][index]) return console.log("asset not exist!");

      try {
        let s = id.split("-");
        const newId = pos == "next" ? Number(s[0]) + 1 + "-" + s[1] : Number(s[0]) - 1 + "-" + s[1];
        const URL = listaAudio[language + "URL"][index];
        const urlToLoad = listaAudio[language][index];
        await playbackObject.unloadAsync();
        const status = await playbackObject.loadAsync(urlToLoad);
        await playbackObject.playAsync();
        setAudioStatus({ ...status, name: URL });
        setPlaybackObject(playbackObject);
        setIsplaying({ status: true, index: index, id: newId });
        setCurrentData(data[language][index]);
        await playbackObject.setOnPlaybackStatusUpdate(statusUpdater);
      } catch (err) {
        console.log(err)
      }
      try {
        if (refer.current && pos) {
          refer.current.scrollTo({ x: 0 })
        }
      } catch (err) {
        console.log(err)
      }
      return
    }
    // PRIMO PLAY
    if (playbackObject === null) {
      try {
        audio = new Audio.Sound();
        const status = await audio.loadAsync(urlToLoad);
        await audio.playAsync();
        setIsplaying({ status: true, index: index, id: id });
        setAudioStatus({ ...status, name: URL });
        setPlaybackObject(audio);
        setModalVisible(true);
        setCurrentData(data[language][index]);
        audio.setOnPlaybackStatusUpdate(statusUpdater);
      } catch (err) { console.log(err) };
    };
    // PAUSA
    if (audioStatus && audioStatus.name === URL && isPlaying.status) {
      try {
        await playbackObject.pauseAsync();
        setIsplaying({ status: false, index: index, id: id });
      } catch (err) {
        await playbackObject.pauseAsync();
        setIsplaying({ status: false, index: index, id: id });
      }
    };
    // RESTART
    if (audioStatus && audioStatus.name === URL && !isPlaying.status) {
      try {
        await playbackObject.playAsync();
        setIsplaying({ status: true, index: index, id: id });
        setModalVisible(true);
      } catch (err) { console.log(err) }
    };
    // CAMBIA AUDIO QUANDO GIA IN PLAYING
    if (audioStatus && audioStatus.name !== URL && isPlaying.status) {
      try {
        await playbackObject.stopAsync();
        await playbackObject.unloadAsync();
        const status = await playbackObject.loadAsync(urlToLoad);
        await playbackObject.playAsync();
        setAudioStatus({ ...status, name: URL });
        setPlaybackObject(playbackObject);
        setIsplaying({ status: true, index: index, id: id });
        setModalVisible(true);
        setCurrentData(data[language][index]);
      } catch (err) { console.log(err) }
    }
    // CAMBIA AUDIO QUANDO NON IN PLAYING
    if (audioStatus && audioStatus.name !== URL && !isPlaying.status) {
      try {
        await playbackObject.unloadAsync();
        const status = await playbackObject.loadAsync(urlToLoad);
        await playbackObject.playAsync();
        setAudioStatus({ ...status, name: URL });
        setPlaybackObject(playbackObject);
        setIsplaying({ status: true, index: index, id: id });
        setModalVisible(true);
        setCurrentData(data[language][index]);
      } catch (err) { console.log(err) }
    }

  };

  function openModal(x) {
    if (!currentData.immagini.length) return;
    if (currentData.titolo && currentData.titolo != x) return;
    setModalVisible(true);
  }


  const waveTablet = "M0,256L24,224C48,192,96,128,144,133.3C192,139,240,213,288,229.3C336,245,384,203,432,170.7C480,139,528,117,576,133.3C624,149,672,203,720,234.7C768,267,816,277,864,272C912,267,960,245,1008,240C1056,235,1104,245,1152,245.3C1200,245,1248,235,1296,213.3C1344,192,1392,160,1416,144L1440,128L1440,0L1416,0C1392,0,1344,0,1296,0C1248,0,1200,0,1152,0C1104,0,1056,0,1008,0C960,0,912,0,864,0C816,0,768,0,720,0C672,0,624,0,576,0C528,0,480,0,432,0C384,0,336,0,288,0C240,0,192,0,144,0C96,0,48,0,24,0L0,0Z"
  const wavePath = "M0,224L20,224C40,224,80,224,120,208C160,192,200,160,240,149.3C280,139,320,149,360,170.7C400,192,440,224,480,202.7C520,181,560,107,600,101.3C640,96,680,160,720,202.7C760,245,800,267,840,250.7C880,235,920,181,960,165.3C1000,149,1040,171,1080,197.3C1120,224,1160,256,1200,256C1240,256,1280,224,1320,176C1360,128,1400,64,1420,32L1440,0L1440,0L1420,0C1400,0,1360,0,1320,0C1280,0,1240,0,1200,0C1160,0,1120,0,1080,0C1040,0,1000,0,960,0C920,0,880,0,840,0C800,0,760,0,720,0C680,0,640,0,600,0C560,0,520,0,480,0C440,0,400,0,360,0C320,0,280,0,240,0C200,0,160,0,120,0C80,0,40,0,20,0L0,0Z"
  return (
    <SafeAreaView style={{ ...styles.container, backgroundColor: mode === "light" ? "#23a823" : "#111224" }}>
      <Svg
        width={lunghezza}
        height={altezza>1000?500:300}
        style={{ position: "absolute", top: -1 }}>
        <Path
          fill={mode === "light" ? "white" : "#23a823"}
          d={altezza > 1000 ? waveTablet : wavePath} />
      </Svg>
      <View style={{...styles.utilsContainer,height:altezza>1000?"10%":"15%"}}>
        <View style={styles.titleContainer}>
          <Text style={{ fontSize: isEsterVisible ? getFontScale(fontResponsiveTitle()) : getFontScale(fontResponsiveTitle()), fontWeight: "600", color: "black", marginLeft: 10 }}>{!isEsterVisible ? language == "italiano" ? "Benvenuto" : language == "inglese" ? "Welcome" : "Bienvenu" : "se stai leggendo questo messaggio, ti voglio bene <3"}</Text>
          <Text numnumberOfLines={1} adjustsFontSizeToFit style={{ marginLeft: 10, fontSize: getFontScale(fontResponsive()) }}>{!isEsterVisible ? language == "italiano" ? "Cooperativa Archeotaccu" : language == "inglese" ? "Archeotaccu Company" : "Coopérative Archéotaccu" : ""}</Text>
        </View>
        <View style={styles.flagsContainer}>
          <TouchableOpacity onPress={() => setLanguage("italiano")} style={{ backgroundColor: language == "italiano" ? "white" : "#D3D3D3", width: "33%", alignItems: "center", borderColor: "rgb(200,200,200)", borderWidth: 1 }}>
            <Image source={require("./assets/UI/italy_flag.png")} style={styles.flag} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setLanguage("francese")} style={{ backgroundColor: language == "francese" ? "white" : "#D3D3D3", width: "33%", alignItems: "center", borderColor: "rgb(200,200,200)", borderWidth: 1 }}>
            <Image source={require("./assets/UI/france_flag.png")} style={styles.flag} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setLanguage("inglese")} style={{ backgroundColor: language == "inglese" ? "white" : "#D3D3D3", width: "33%", alignItems: "center", borderColor: "rgb(200,200,200)", borderWidth: 1 }}>
            <Image source={require("./assets/UI/uk_flag.png")} style={styles.flag} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={data[language]}
        renderItem={(item) => <ListItem altezzaResponsive={altezzaResponsive()} fontResponsive={fontResponsive()} titolo={item.item.titolo} immagini={item.item.immagini} handleClick={handleClick} isPlaying={isPlaying} openModal={openModal} language={language} id={item.item.id} mode={mode} />}
        keyExtractor={item => item.id}
        style={styles.lista}
        contentContainerStyle={{ justifyContent: "center" }}
      />
      <AudioPlayer font={fontForTesto()} modalVisible={modalVisible} data={currentData} closeModal={() => setModalVisible(false)} openModal={() => openModal()} titolo={currentData.titolo} id={currentData.id} handleClick={handleClick} isPlaying={isPlaying} durata={currentData.durata} time={time} completeSliding={completeSliding} mode={mode} />
      <StatusBar backgroundColor={mode == "dark" ? "#32CD32" : "white"} />
      <InfoModal font={fontResponsive()}  infoModalVisible={infoModalShow} closeInfoModal={() => setInfoModalShow(false)} />
      <Entypo name="info-with-circle" size={altezza >1000?40:24} color="black" style={{ position: "absolute", bottom: 20, right: 20 }} onPress={() => setInfoModalShow(true)} />
      <TouchableOpacity style={{ position: "absolute", bottom: 20, left: 20 }} onLongPress={() => setIsEsterVisible(true)} delayLongPress={10000} onPress={() => setMode(mode === "dark" ? "light" : "dark")} >
        <Feather name={mode === "light" ? "moon" : "sun"} size={altezza >1000?40:24} color={mode === "light" ? "black" : "#32CD32"} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  utilsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    marginBottom: 150
  },
  titleContainer: {
    width: "55%",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingBottom: 10,
    marginLeft: 20,
    marginTop: 10

  },
  flagsContainer: {
    width: "45%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-end",
    marginRight: 30
  },
  flag: {
    width: 30,
    height: 40,
    resizeMode: "contain"
  },
  lista: {
    width: "100%",
    height: "85%"
  }
});
