import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput,TouchableOpacity, Alert } from 'react-native';
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class SettingScreen extends Component{

    constructor(){
        super();
        this.state={
          emailId:'',
          firstName:'',
          lastName:'',
          address:'',
          contact:'',
          docId:''
        }
      }

      updateUserDetails =()=>{
        db.collection('Users').doc(this.state.docId).update({
            "firstName": this.state.firstName,
            "lastName":this.state.lastName,
            "mobileNo":this.state.contact,
            "address"  : this.state.address,
        })
        Alert.alert("Profile is Updated Successfully!")
      }
    
      getUserDetails=()=>{
          var email=firebase.auth().currentUser.email;
          db.collection('Users').where('username', '==', email ).get()
          .then(snapshot => { 
              snapshot.forEach(doc => { 
                  var data = doc.data();
                  this.setState({ emailId : data.username,
                     firstName : data.firstName,
                     lastName : data.lastName,
                     address : data.address,
                     contact : data.mobileNo,
                     docId : doc.id
      })
    })
  })
}

componentDidMount(){
   this.getUserDetails()
}

    render(){
        return(
            <View style={styles.container}>
               <MyHeader title='Settings' navigation={this.props.navigation} />
            <View style={styles.formContainer}>
            <TextInput
          style={styles.formTextInput}
          placeholder ={"First Name"}
          maxLength ={8}
          onChangeText={(text)=>{
            this.setState({
              firstName: text
            })
          }}
          value={this.state.firstName}
        />
        <TextInput
          style={styles.formTextInput}
          placeholder ={"Last Name"}
          maxLength ={8}
          onChangeText={(text)=>{
            this.setState({
              lastName: text
            })
          }}
          value={this.state.lastName}
        />
        <TextInput
          style={styles.formTextInput}
          placeholder ={"Contact"}
          maxLength ={10}
          keyboardType={'numeric'}
          onChangeText={(text)=>{
            this.setState({
              contact: text
            })
          }}
          value={this.state.contact}
        />
        <TextInput
          style={styles.formTextInput}
          placeholder ={"Address"}
          multiline = {true}
          onChangeText={(text)=>{
            this.setState({
              address: text
            })
          }}
          value={this.state.address}
        />
        <TextInput
          style={styles.formTextInput}
          placeholder ={"Email"}
          keyboardType ={'email-address'}
          onChangeText={(text)=>{
            this.setState({
              emailId: text
            })
          }}
          value={this.state.emailId}
        />
        <TouchableOpacity style={styles.button}
           onPress={()=>{this.updateUserDetails()}}>
            <Text style={styles.buttonText}>
                Save
            </Text>
        </TouchableOpacity>
    </View>
    </View>
    )
  }
}

const styles = StyleSheet.create({
    container:{
     flex:1,
     alignItems: 'center',
     justifyContent: 'center'
   },
    formContainer:{
    flex:1,
    width:'100%',
    alignItems: 'center'
  },
   formTextInput:{
     width:"75%",
     height:35,
     alignSelf:'center',
     borderColor:'#ffab91',
     borderRadius:10,
     borderWidth:1,
     marginTop:20,
     padding:10
   },
   button:{
     width:300,
     height:50,
     justifyContent:'center',
     alignItems:'center',
     borderRadius:25,
     backgroundColor:"#ff9800",
     shadowColor: "#000",
     shadowOffset: {
        width: 0,
        height: 8,
     },
     shadowOpacity: 0.30,
     shadowRadius: 10.32,
     elevation: 16,
     padding: 10
   },
   buttonText:{
     color:'#ffff',
     fontWeight:'200',
     fontSize:20
   }
  })
  