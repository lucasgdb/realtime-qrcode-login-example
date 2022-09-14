import { BarCodeScanner } from 'expo-barcode-scanner';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);

    const response = await axios.post(
      'http://192.168.15.11:3000/login',
      { id: data },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.data.success) {
      alert(`Logado com sucesso.`);
    } else {
      alert(`Falha ao logar pelo app.`);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleScanAgain = () => setScanned(false);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.actionsWrapper}>
        <Text style={styles.text}>Escaneie o QRCode para logar no dispositivo.</Text>
        {scanned && <Button title="Escanear QRCode novamente" onPress={handleScanAgain} />}
      </View>

      <View style={styles.barCodeScannerWrapper}>
        <BarCodeScanner
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 48,
  },
  actionsWrapper: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  text: {
    textAlign: 'center',
    marginBottom: 16,
  },
  barCodeScannerWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
