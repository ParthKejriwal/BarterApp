import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js'

export default class MyDonationScreen extends Component {
   constructor(){
     super()
     this.state = {
       donorId : firebase.auth().currentUser.email,
       donorName : "",
       allbarters : []
     }
     this.requestRef= null
   }

   static navigationOptions = { header: null };

   getDonorDetails=(donorId)=>{
     db.collection("Users").where("username","==", donorId).get()
     .then((snapshot)=>{
       snapshot.forEach((doc) => {
         this.setState({
           "donorName" : doc.data().firstName + " " + doc.data().lastName
         })
       });
     })
   }

   getAllBarters =()=>{
     this.requestRef = db.collection("all_barters").where("donor_id" ,'==', this.state.donorId)
     .onSnapshot((snapshot)=>{
       var allbarters = []
       snapshot.docs.map((doc) =>{
         var barter = doc.data()
         barter["doc_id"] = doc.id
         allbarters.push(barter)
       });
       this.setState({
         allbarters : allbarters
       });
     })
   }

   sendItem=(itemDetails)=>{
     if(itemDetails.request_status === "Item Sent"){
       var requestStatus = "Donor Interested"
       db.collection("all_barters").doc(itemDetails.doc_id).update({
         "request_status" : "Donor Interested"
       })
       this.sendNotification(itemDetails,requestStatus)
     }
     else{
       var requestStatus = "Item Sent"
       db.collection("all_barters").doc(itemDetails.doc_id).update({
         "request_status" : "Item Sent"
       })
       this.sendNotification(itemDetails,requestStatus)
     }
   }

   sendNotification=(itemDetails,requestStatus)=>{
     var requestId = itemDetails.request_id
     var donorId = itemDetails.donor_id
     db.collection("all_notifications")
     .where("request_id","==", requestId)
     .where("donor_id","==",donorId)
     .get()
     .then((snapshot)=>{
       snapshot.forEach((doc) => {
         var message = ""
         if(requestStatus === "Item Sent"){
           message = this.state.donorName + " sent you item"
         }else{
            message =  this.state.donorName  + " has shown interest in exchanging the item"
         }
         db.collection("all_notifications").doc(doc.id).update({
           "message": message,
           "notificationStatus" : "unread",
           "date"                : firebase.firestore.FieldValue.serverTimestamp()
         })
       });
     })
   }

   keyExtractor = (item, index) => index.toString()

   renderItem = ( {item, i} ) =>(
     <ListItem
       key={i}
       title={item.item_name}
       subtitle={"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}
       leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>}
       titleStyle={{ color: 'black', fontWeight: 'bold' }}
       rightElement={
           <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor : item.request_status === "Book Sent" ? "green" : "#ff5722"
              }
            ]}
            onPress = {()=>{
              this.sendItem(item)
            }}
           >
             <Text style={{color:'#ffff'}}>{
               item.request_status === "Item Sent" ? "Item Sent" : "Send Item"
             }</Text>
           </TouchableOpacity>
         }
       bottomDivider
     />
   )


   componentDidMount(){
     this.getDonorDetails(this.state.donorId)
     this.getAllBarters()
   }

   componentWillUnmount(){
     this.requestRef();
   }

   render(){
     return(
       <View style={{flex:1}}>
         <MyHeader navigation={this.props.navigation} title="My Barters"/>
         <View style={{flex:1}}>
           {
             this.state.allbarters.length === 0
             ?(
               <View style={styles.subtitle}>
                 <Text style={{ fontSize: 20}}>List of all item Barters</Text>
               </View>
             )
             :(
               <FlatList
                 keyExtractor={this.keyExtractor}
                 data={this.state.allbarters}
                 renderItem={this.renderItem}
               />
             )
           }
         </View>
       </View>
     )
   }
   }


const styles = StyleSheet.create({
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  },
  subtitle :{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  }
})
