import React, { Component } from 'react';
import { ActivityIndicator, Image, TouchableOpacity, TouchableHighlight, ListView, KeyboardAvoidingView, Text, View, TextInput, Button, Alert, RefreshControl, StyleSheet } from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      text: '',
      refreshing: false
    };
  }

  componentDidMount() {
    return fetch('https://todo.visiomedia.ca/items?key=Yoo9texe6phuer8U')
      .then((response) => response.json())
      .then((responseJson) => {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson),
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _onRefresh(){
    this.setState({refreshing: true});
    this.componentDidMount().then(() => {
      this.setState({refreshing:false});
    });
  }

  _onPressRow(rowID, rowComplete){
    // Send PUT HTTP request
    var url = 'https://todo.visiomedia.ca/items/';
    var rowIDStr = rowID.toString() ;
    var key = '?key=Yoo9texe6phuer8U';
    
    var fullURL = url.concat(rowIDStr).concat(key);
    fetch(fullURL,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        complete: !rowComplete,
      })
    })

    // Refresh the list
    this.setState({refreshing: true});
    this.componentDidMount().then(() => {
      this.setState({refreshing: false});
    });
  }

  _onLongPress(rowID){
    // Ask if sure about deleting
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this task?',
      [
        {text: 'OK', onPress: () => 
        this._onDeleteRow(rowID)

        },
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      ]
    )
  }

  _onDeleteRow(rowID){
    // Send DELETE HTTP request
    var url = 'https://todo.visiomedia.ca/items/';
    var rowIDStr = rowID.toString() ;
    var key = '?key=Yoo9texe6phuer8U';
    
    var fullURL = url.concat(rowIDStr).concat(key);
    fetch(fullURL,{
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    // Refresh the list
    this.setState({refreshing: true});
    this.componentDidMount().then(() => {
      this.setState({refreshing: false});
    });

  }


  _onPressButton() {
    //Send POST HTTP request 
    fetch('https://todo.visiomedia.ca/items?key=Yoo9texe6phuer8U',{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: this.state.text,
        complete: false,
      })
    })

    // Refresh the list
    this.setState({refreshing: true});
    this.componentDidMount().then(() => {
      this.setState({refreshing: false});
    });

    // Make the text entry field blank
    this.setState((state) => ({text: ''}));
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        
        {/* Display Header */}
        <View style={styles.headerContainer}>
          <Text style = {styles.headerText}>TASKR</Text>
        </View>

        {/* Display list of tasks*/}
        <ListView 
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />}
          dataSource={this.state.dataSource}
          renderRow={(rowData) =>   
            <TouchableOpacity 
              onPress = { () => this._onPressRow(rowData.id, rowData.complete)}
              onLongPress = { () => this._onLongPress(rowData.id)}>
              <View>
                {rowData.complete ? (
                  <Text style={styles.listTextCompleted}>{rowData.description}✓</Text>
                  ) : (
                  <Text style={styles.listText}>{rowData.description}</Text>
                )}
              </View>
            </TouchableOpacity>}
        />

        {/* Display Text Input*/}
        <View style={{flexDirection:'row'}}>
          <TextInput
            style = {{flex: 1, height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
          />
          <Button
            style= {{flex: 1}}
            onPress={this._onPressButton.bind(this)}
            title="Create Item"
          />
        </View>
      
      </KeyboardAvoidingView>
    );
  }

}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffe6ff',
  },
  headerContainer: {
    backgroundColor: '#990099',
    paddingTop: 20,
    height: null,
    width: 500,
    justifyContent: 'center',
    alignItems: 'center'
  },

  headerText: {
    fontFamily: 'MarkerFelt-Wide',
    color: 'white',
    fontSize: 30,
  },
  listText: {
    fontSize: 20,
    fontFamily: 'Chalkboard SE',
  },

  listTextCompleted: {
    fontSize: 20,
    fontFamily: 'ChalkboardSE-Light',
    color: 'red',
  },

  inputContainer: {
    height: 40, 
    borderColor: 'gray',
    borderWidth: 1
   },
  buttonContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    margin: 20,
    justifyContent: 'space-between'
  }
  

})




