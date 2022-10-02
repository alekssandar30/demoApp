/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import MapboxGL, {Logger } from '@rnmapbox/maps';

const tokenMapbox = "sk.eyJ1IjoiYWxla3NzYW5kYXIzMCIsImEiOiJjbDhweHJtdnUxNjRkNDFsaHlqdzJjbngzIn0.CiEJk1RLoCvzyAXdqqG_-g";

MapboxGL.setWellKnownTileServer(MapboxGL.TileServers.Mapbox);
MapboxGL.setAccessToken(tokenMapbox);

const defaultStyle = {
  version: 8,
  name: 'Land',
  sources: {
    map: {
      type: 'raster',
      tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      minzoom: 1,
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#f2efea',
      },
    },
    {
      id: 'map',
      type: 'raster',
      source: 'map',
      paint: {
        'raster-fade-duration': 100,
      },
    },
  ],
};

const App = () => {
  const [homeCoords, setHomeCoords] = React.useState([19.831120, 45.244200]);
  const [zoomLevel, setZoomLevel] = React.useState(15);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  React.useEffect(() => {

    MapboxGL.setTelemetryEnabled(false);
  
    
  }, []);

  const zoomIn = () => {
    setZoomLevel((prevZoom) =>  prevZoom + 1);
  }

  const zoomOut = () => {
    setZoomLevel((prevZoom) =>  prevZoom - 1);
  }

  // edit logging messages
  Logger.setLogCallback(log => {
    const { message } = log;

    // expected warnings - see https://github.com/mapbox/mapbox-gl-native/issues/15341#issuecomment-522889062
    if (
      message.match('Request failed due to a permanent error: Canceled') ||
      message.match('Request failed due to a permanent error: Socket Closed')
    ) {
      return true;
    }
    return false;
  });

  return (
 
      <View style={styles.page}>
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%'}}>
          <Button title="+" color="#841584" onPress={() => zoomIn()} />
          <Text>{zoomLevel}</Text>
          <Button title="-" color="#841584" onPress={() => zoomOut()} />
        </View>
        
        <MapboxGL.MapView style={styles.map}>
          <MapboxGL.Camera
              zoomLevel={zoomLevel}
              centerCoordinate={homeCoords}
            />
          <MapboxGL.PointAnnotation coordinate={homeCoords} />
        </MapboxGL.MapView>
      </View>
   
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  map: {
    flex: 1,
    width: '100%'
  }
});

export default App;
