import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  I18nManager,
  Pressable,
} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {deleteContact, getContact} from '../../store/feature/contact/actions';
import {useAppDispatch, useAppSelector} from '../../hooks/reduxHooks';
import BaseStyle from '../../theme/styles';
import {FlashList} from '@shopify/flash-list';
import {Contact} from '../../types/ContactTypes';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {Alert} from 'react-native';

const Home = ({navigation}: {navigation: any}) => {
  const dispatch = useAppDispatch();
  const {contacts} = useAppSelector(state => state.contactState);

  const getData = useCallback(async () => {
    await dispatch(getContact());
  }, [dispatch]);

  useEffect(() => {
    if (contacts.isRefresh) {
      getData();
    }
  }, [contacts.isRefresh, getData]);

  // useEffect(() => {
  //   console.log('length', contacts.data.length);
  // }, [contacts.data, contacts.data.length]);

  function editContact(item: Contact) {
    return navigation.navigate('CreateStack', {data: item});
  }

  async function deleteContactByID(id: string) {
    try {
      await dispatch(deleteContact({id: id})).then(res => {
        if (res.payload === '') {
          Alert.alert('Gagal ', 'Gagal Menghapus Contact');
        }
      });
    } catch (error) {
      console.log('error delete contact ', error);
    }
  }

  function renderRightAction(
    text: string,
    color: string,
    x: number,
    progress: any,
    onPressHandler: () => void,
  ) {
    return (
      <Animated.View style={styles.animatedView}>
        <Pressable
          style={[styles.rightAction, {backgroundColor: color}]}
          onPress={onPressHandler}>
          <Text>{text}</Text>
        </Pressable>
      </Animated.View>
    );
  }

  function renderRightActions(progress: any, data: Contact) {
    return (
      <View style={styles.rightActions}>
        {renderRightAction('Edit', '#C8C7CD', 192, progress, () =>
          editContact(data),
        )}
        {renderRightAction('Delete', 'red', 128, progress, () =>
          deleteContactByID(data.id),
        )}
      </View>
    );
  }

  function renderItem({item}: {item: Contact}) {
    return (
      <Swipeable
        renderRightActions={progress => renderRightActions(progress, item)}
        onFailed={() => console.log('failed')}>
        <View key={item.id} style={styles.viewBox}>
          <View style={styles.viewRender}>
            <Image
              source={{
                uri: item.photo.includes('base64')
                  ? item.photo
                  : item.photo.includes('http')
                  ? item.photo
                  : 'https://static-00.iconduck.com/assets.00/avatar-default-icon-1975x2048-2mpk4u9k.png',
              }}
              style={styles.picture}
            />
            <View>
              <Text>{`${item.firstName} ${item.lastName}`}</Text>
              <Text>{`${item.age} Tahun`}</Text>
            </View>
          </View>
          <View style={styles.swipe}>
            <Text>Swipe</Text>
          </View>
        </View>
      </Swipeable>
    );
  }

  return (
    <View style={BaseStyle.pages}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text>Contact</Text>
        </View>
        <View style={styles.listContainer}>
          <FlashList
            data={contacts.data}
            renderItem={renderItem}
            estimatedItemSize={200}
            keyExtractor={item => item.id}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.1,
  },
  listContainer: {
    flex: 0.9,
  },
  viewRender: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'white',
  },
  picture: {width: 100, height: 100, borderRadius: 60, marginRight: 10},
  rightAction: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'grey',
  },
  animatedView: {flex: 1, transform: [{translateX: 0}]},
  rightActions: {
    width: 192,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
  },
  viewBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'grey',
    paddingHorizontal: 5,
  },
  swipe: {alignItems: 'center', justifyContent: 'center'},
});
