import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import BaseStyle from '../../theme/styles';
import {
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {Button} from 'react-native';
import {Image} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppDispatch} from '../../hooks/reduxHooks';
import {editContact, postContact} from '../../store/feature/contact/actions';
import {Alert} from 'react-native';

const Create = ({route}: {route: any}) => {
  const [firstName, setFirstName] = useState({value: '', error: false});
  const [lastName, setLastName] = useState({value: '', error: false});
  const [age, setAge] = useState({value: '', error: false});
  const [picture, setPicture] = useState<ImagePickerResponse>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (route.params?.data) {
      setFirstName({value: route.params.data.firstName, error: false});
      setLastName({value: route.params.data.lastName, error: false});
      setAge({value: route.params.data.age.toString(), error: false});
      setPicture({assets: [{uri: route.params.data.photo}]});
    }
  }, [route.params]);

  async function openCamera() {
    let options: CameraOptions = {
      mediaType: 'photo',
      includeBase64: true,
    };
    const result = await launchCamera(options);
    if (result.didCancel) {
      console.log('cancel');
    } else {
      setPicture(result);
    }
  }
  async function openGaleri() {
    let options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: true,
    };
    const result = await launchImageLibrary(options);
    if (result.didCancel) {
      console.log('cancel');
    } else {
      setPicture(result);
    }
  }

  async function onSubmit() {
    if (firstName.value === '' || firstName.value.length < 3) {
      setFirstName(prev => {
        return {...prev, error: true};
      });
    }
    if (lastName.value === '' || lastName.value.length < 3) {
      setLastName(prev => {
        return {...prev, error: true};
      });
    }
    if (age.value === '' || age.value === '0' || Number(age.value) > 200) {
      setAge(prev => {
        return {...prev, error: true};
      });
    }

    if (!picture?.assets?.[0]?.base64) {
      Alert.alert('Error ', 'Masukkan Foto');
    }
    if (
      (firstName.value !== '' && lastName.value !== '',
      age.value !== '' && picture?.assets?.[0]?.base64)
    ) {
      try {
        await dispatch(
          postContact({
            firstName: firstName.value,
            lastName: lastName.value,
            age: Number(age.value),
            photo: picture?.assets?.[0]?.base64
              ? `data:image/png;base64,${picture?.assets?.[0]?.base64}`
              : '',
          }),
        )
          .then(res => {
            if (res.payload.status === 201) {
              setAge({value: '', error: false});
              setFirstName({value: '', error: false});
              setLastName({value: '', error: false});
              setPicture(undefined);
              Alert.alert('Berhasil', 'Buat Contact Berhasil');
            }
          })
          .catch(error => {
            console.log('error ', error);
          });
      } catch (error) {
        console.log('error');
      }
    }
  }
  async function onEdit() {
    if (firstName.value === '' || firstName.value.length < 3) {
      setFirstName(prev => {
        return {...prev, error: true};
      });
    }
    if (lastName.value === '' || lastName.value.length < 3) {
      setLastName(prev => {
        return {...prev, error: true};
      });
    }
    if (age.value === '' || age.value === '0' || Number(age.value) > 200) {
      setAge(prev => {
        return {...prev, error: true};
      });
    }

    if (!picture?.assets?.[0]?.uri) {
      Alert.alert('Error ', 'Masukkan Foto');
    }
    if (
      (firstName.value !== '' && lastName.value !== '',
      age.value !== '' && picture?.assets?.[0]?.uri)
    ) {
      try {
        console.log('edit proses');
        await dispatch(
          editContact({
            firstName: firstName.value,
            lastName: lastName.value,
            age: Number(age.value),
            photo: picture?.assets?.[0]?.uri?.includes('base64')
              ? picture?.assets?.[0]?.uri
              : picture?.assets?.[0]?.base64
              ? `data:image/png;base64,${picture?.assets?.[0]?.base64}`
              : '',
            id: route.params?.data.id,
          }),
        )
          .then(res => {
            if (res.payload.status === 201) {
              setAge({value: '', error: false});
              setFirstName({value: '', error: false});
              setLastName({value: '', error: false});
              setPicture(undefined);
              Alert.alert('Berhasil', 'Edit Data Berhasil');
            } else if (res.payload === '') {
              Alert.alert('Gagal', 'Gagal Update Data');
            }
          })
          .catch(error => {
            console.log('error ', error);
          });
      } catch (error) {
        console.log('error');
      }
    }
  }

  return (
    <View style={BaseStyle.pages}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text>{route.params?.data ? 'Edit Data' : 'Tambah Contact'}</Text>
        </View>
        <ScrollView>
          <TextInput
            value={firstName.value}
            maxLength={30}
            placeholderTextColor={'grey'}
            onChangeText={item =>
              setFirstName(() => {
                return {error: false, value: item};
              })
            }
            placeholder="Masukkan Nama Depan"
            style={firstName.error ? styles.warning : styles.normal}
          />
          {firstName.error && (
            <View style={styles.viewTextError}>
              <Text style={styles.warningText}>Minimal Karakter 3</Text>
              <Text style={styles.warningText}>Maksimal Karakter 30</Text>
            </View>
          )}
          <TextInput
            value={lastName.value}
            maxLength={30}
            placeholderTextColor={'grey'}
            onChangeText={item =>
              setLastName(() => {
                return {error: false, value: item};
              })
            }
            placeholder="Masukkan Nama Belakang"
            style={lastName.error ? styles.warning : styles.normal}
          />
          {lastName.error && (
            <View style={styles.viewTextError}>
              <Text style={styles.warningText}>Minimal Karakter 3</Text>
              <Text style={styles.warningText}>Maksimal Karakter 30</Text>
            </View>
          )}
          <TextInput
            value={age.value}
            maxLength={3}
            placeholderTextColor={'grey'}
            onChangeText={item =>
              setAge(() => {
                return {error: false, value: item};
              })
            }
            keyboardType="number-pad"
            placeholder="Masukkan Umur"
            style={age.error ? styles.warning : styles.normal}
          />
          {age.error && (
            <View style={styles.viewTextError}>
              <Text style={styles.warningText}>Minimal Usia 1</Text>
              <Text style={styles.warningText}>Maksimal Karakter 200</Text>
            </View>
          )}
          <View>
            <View style={styles.headerPicture}>
              <Text>Masukkan Foto Profile</Text>
            </View>
            {picture?.assets && (
              <View style={styles.boxPicture}>
                <MaterialCommunityIcons
                  name="close"
                  onPress={() => setPicture(undefined)}
                  size={30}
                  style={styles.iconClose}
                />
                <Image
                  source={{uri: picture.assets[0].uri}}
                  style={styles.picture}
                />
              </View>
            )}
            <View style={styles.boxButton}>
              <Button
                onPress={openCamera}
                title="Open Camera"
                color="grey"
                accessibilityLabel="Learn more about this purple button"
              />
              <Button
                onPress={openGaleri}
                title="Open Galeri"
                color="grey"
                accessibilityLabel="Learn more about this purple button"
              />
            </View>
          </View>
          <View style={styles.boxSubmit}>
            <Button
              title={route.params?.data ? 'Edit' : 'Submit'}
              onPress={route.params?.data ? onEdit : onSubmit}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Create;

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: 10},
  header: {justifyContent: 'center', alignItems: 'center', paddingVertical: 20},
  warning: {
    borderColor: 'red',
    color: 'black',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 10,
  },
  normal: {
    borderColor: 'grey',
    color: 'black',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 10,
  },
  picture: {width: 200, height: 200, marginBottom: 20},
  boxButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  headerPicture: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  boxPicture: {alignSelf: 'center'},
  iconClose: {
    position: 'absolute',
    zIndex: 10,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  boxSubmit: {marginTop: 20},
  warningText: {
    color: 'red',
  },
  viewTextError: {
    marginTop: -20,
    marginBottom: 20,
  },
});
