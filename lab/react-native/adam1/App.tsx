/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

function App() {

  function renderItem({ item, index, separators }: any) {
    return (
      <TouchableHighlight
        key={item.id}>
        <Text style={styles.listItem} >{item.name}</Text>
      </TouchableHighlight>
    )
  }

  function SeperatorComponent() {
    return (
      <View
        style={{
          height: 2,
          width: "100%",
          backgroundColor: "blue",
        }}
      />)
  }


  return (<SafeAreaView style={[styles.container]}>
    <FlatList
      data={data}
      renderItem={renderItem}
      ItemSeparatorComponent={SeperatorComponent}
    ></FlatList>
  </SafeAreaView>)
}


const styles = StyleSheet.create({
  container: {
    padding: 10,
    // flexDirection:'row',
    // alignItems:'center',
  },
  listItem: {
    padding:10,
    // borderWidth:1,
    // borderColor:'grey'
  }
})
export default App;

const data = [
  { id: 1, name: 'aaa' },
  { id: 2, name: 'bbb' },
  { id: 3, name: 'ccc' },
  { id: 4, name: 'ddd' },
]
