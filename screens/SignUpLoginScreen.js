import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import firebase from 'firebase';
import db from '../config';

export default class SignUpLoginScreen extends React.Component{

    constructor(){
        super();
        this.state={
            emailId:'',
            password:''
        }
    }

    userSignUp=(emailId,password)=>{
        firebase.auth().createUserWithEmailAndPassword(emailId,password)
        .then((response)=>{return Alert.alert("User Added Successfully!")})
        .catch(function(error){var errorCode=error.code;var errorMessage=error.message;
            return Alert.alert(errorMessage)})
    }

    userLogin=(emailId,password)=>{
        firebase.auth().signInWithEmailIdAndPassword(emailId,password)
        .then(()=>{return Alert.alert("User Logged In Successfully!")})
        .catch(function(error){var errorCode=error.code;var errorMessage=error.message;
            return Alert.alert(errorMessage)})
    }

    render(){
        return(
            <View style={styles.container}>
                <View>
                    <Text>
                        Barter System
                    </Text>
                </View>
                <View>
                    <TextInput style={styles.loginBox}
                     placeholder='abc@example.com'
                     keyboardType='email-address'
                     onChangeText={(text)=>{this.setState({emailId:text})}}>
                    </TextInput>

                    <TextInput style={styles.loginBox}
                     placeholder='Enter Password'
                     secureTextEntry={true}
                     onChangeText={(text)=>{this.setState({password:text})}}>
                    </TextInput>
                    <TouchableOpacity style={styles.button}
                     onPress={()=>{this.userLogin(this.state.emailId,this.state.password)}}>
                        <Text style={styles.buttonText}>
                            Login
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}
                     onPress={()=>{this.userSignUp(this.state.emailId,this.state.password)}}>
                        <Text style={styles.buttonText}>
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginBox:{
        width: 300,
        height: 40,
        borderBottomWidth: 1.5,
        borderColor : '#ff8a65',
        fontSize: 20,
        margin:10,
        paddingLeft:10
    },
    button:{
        width:300,
        height:50,
        justifyContent:'center',
        alignItems:'center', 
        borderRadius:25, 
        backgroundColor:"#ff9800", 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 8, },
        shadowOpacity: 0.30, shadowRadius: 10.32, elevation: 16,
    },
    buttonText:{ 
        color:'#ffff', 
        fontWeight:'200', 
        fontSize:20
    },
    buttonContainer:{
        flex:1,
        alignItems:'center'
    }
  });
  