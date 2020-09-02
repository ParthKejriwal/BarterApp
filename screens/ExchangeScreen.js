import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'

export default class ExchangeScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      itemName:"",
      description:"",
      IsItemRequestActive : "",
      requestedItemName: "",
      itemStatus:"",
      requestId:"",
      userDocId: '',
      docId :''
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }



  addRequest = async (itemName,description)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    db.collection('requested_items').add({
        "user_id": userId,
        "item_name":itemName,
        "description":description,
        "request_id"  : randomRequestId,
        "item_status" : "requested",
         "date"       : firebase.firestore.FieldValue.serverTimestamp()

    })

    await  this.getItemRequest()
    db.collection('Users').where("username","==",userId).get()
    .then()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection('Users').doc(doc.id).update({
      IsItemRequestActive: true
      })
    })
  })

    this.setState({
        itemName :'',
        description : '',
        requestId: randomRequestId
    })

    return Alert.alert("Item Requested Successfully")


  }

receivedItems=(itemName)=>{
  var userId = this.state.userId
  var requestId = this.state.requestId
  db.collection('received_items').add({
      "user_id": userId,
      "item_name":itemName,
      "request_id"  : requestId,
      "itemStatus"  : "received",

  })
}




getIsItemRequestActive(){
  db.collection('Users')
  .where('username','==',this.state.userId)
  .onSnapshot(querySnapshot => {
    querySnapshot.forEach(doc => {
      this.setState({
        IsItemRequestActive:doc.data().IsItemRequestActive,
        userDocId : doc.id
      })
    })
  })
}










getItemRequest =()=>{
  // getting the requested item
var itemRequest=  db.collection('requested_items')
  .where('user_id','==',this.state.userId)
  .get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      if(doc.data().item_status !== "received"){
        this.setState({
          requestId : doc.data().request_id,
          requestedItemName: doc.data().item_name,
          itemStatus:doc.data().item_Status,
          docId     : doc.id
        })
      }
    })
})}



sendNotification=()=>{
  //to get the first name and last name
  db.collection('Users').where('username','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      var name = doc.data().firstName
      var lastName = doc.data().lastName

      // to get the donor id and item name
      db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
      .then((snapshot)=>{
        snapshot.forEach((doc) => {
          var donorId  = doc.data().donor_id
          var itemName =  doc.data().item_name

          //targert user id is the donor id to send notification to the user
          db.collection('all_notifications').add({
            "targeted_user_id" : donorId,
            "message" : name +" " + lastName + " received the item " + itemName ,
            "notificationStatus" : "unread",
            "item_name" : itemName
          })
        })
      })
    })
  })
}

componentDidMount(){
  this.getItemRequest()
  this.getIsItemRequestActive()

}

updateItemRequestStatus=()=>{
  //updating the item status after receiving the item
  db.collection('requested_items').doc(this.state.docId)
  .update({
    item_status : 'recieved'
  })

  //getting the  doc id to update the users doc
  db.collection('Users').where('username','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc) => {
      //updating the doc
      db.collection('Users').doc(doc.id).update({
        IsItemRequestActive: false
      })
    })
  })


}


  render(){

    if(this.state.IsItemRequestActive === true){
      return(

        // Status screen

        <View style = {{flex:1,justifyContent:'center'}}>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text>Item Name</Text>
          <Text>{this.state.requestedItemName}</Text>
          </View>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text> Item Status </Text>

          <Text>{this.state.itemStatus}</Text>
          </View>

          <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
          onPress={()=>{
            this.sendNotification()
            this.updateItemRequestStatus();
            this.receivedItems(this.state.requestedItemName)
          }}>
          <Text>I recieved the item </Text>
          </TouchableOpacity>
        </View>
      )
    }
    else
    {
    return(
      // Form screen
        <View style={{flex:1}}>
          <MyHeader title="Request Item" navigation ={this.props.navigation}/>

          <ScrollView>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter item name"}
                onChangeText={(text)=>{
                    this.setState({
                        itemName:text
                    })
                }}
                value={this.state.item_name}
              />
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Describe the item"}
                onChangeText ={(text)=>{
                    this.setState({
                        description:text
                    })
                }}
                value ={this.state.description}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{ this.addRequest(this.state.itemName,this.state.description);
                }}
                >
                <Text>Request</Text>
              </TouchableOpacity>

            </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
  }
}
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)