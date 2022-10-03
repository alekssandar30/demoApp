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
import { PermissionsAndroid } from 'react-native';


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
  const [homeCoords, setHomeCoords] = React.useState([19.83112, 45.2442]);
  const [zoomLevel, setZoomLevel] = React.useState(15);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  React.useEffect(() => {
    MapboxGL.setTelemetryEnabled(false);
    requestLocationPermission();
    MapboxGL.locationManager.start();

    return () => {
      MapboxGL.locationManager.stop();
    };
    
  }, []);

  async function requestLocationPermission() {
     try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Example App',
          'message': 'Example App access to your location '
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location")
        alert("You can use the location");
      } else {
        console.log("location permission denied")
        alert("Location permission denied");
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const zoomIn = () => {
    setZoomLevel((prevZoom) =>  prevZoom + 1);
  }

  const zoomOut = () => {
    setZoomLevel((prevZoom) =>  prevZoom - 1);
  }

  const onUserMarkerPress = (): void => {
    Alert.alert('You pressed on the user location annotation');
  };

  const refreshCoords = (e) => {
    console.log(e);
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
          />
          {/* <MapboxGL.PointAnnotation coordinate={homeCoords} /> */}
          {/* <MapboxGL.UserLocation onPress={onUserMarkerPress} onUpdate={(e) => refreshCoords(e)} /> */}
          <MapboxGL.UserLocation visible={true} onPress={onUserMarkerPress} onUpdate={(e) => refreshCoords(e)} />
          <MapboxGL.Camera
                followZoomLevel={17} //followUserLocation
                followUserMode={'normal'}
                followUserLocation={true}
                followZoomLevel={17}
                animationDuration={1000}
            />
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
