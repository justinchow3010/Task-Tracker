import React, { useEffect, useState } from 'react';
import { Task, openRealm, getRealmApp, deleteAllTodoList, addNewTask, queryToDo, watch, deleteTask, updateTaskStatus } from "./database/allSchemas"
import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native"
import Dialog from "react-native-dialog";
import { SwipeListView } from 'react-native-swipe-list-view';
import Header from "./component/Header"

export default App = () => {
  let [todoList, setToDoList] = useState([]);
  let [realm, setRealm] = useState({});
  let [upDateVisible, setUpDateVisible] = useState(false);
  let [itemToUpdate, setItemToUpdate] = useState(0);

  useEffect(() => {
    openRealm()
      .then(R => { setRealm(R); reloadData(R); })
      .catch();
    var lis = watch(reloadData);
    return () => {
      setToDoList([]);
      setRealm({});
      setUpDateVisible(false);
      setItemToUpdate(0);
    }
  }, []);

  const reloadData = (realm) => {
    queryToDo(realm)
      .then((todoList) => {
        setToDoList(todoList);
      })
      .catch(err => setToDoList([]));
  }

  return (
    <View>
      <Header realm={realm} />
      {/* <Button title="Delete" onPress={() => deleteAllTodoList(realm)} /> */}
      <Dialog.Container visible={upDateVisible} onBackdropPress={() => setUpDateVisible(false)}>
        <Dialog.Title>
          Update Status
        </Dialog.Title>
        <Dialog.Description>
          How is your task?
        </Dialog.Description>
        <TouchableOpacity style={styles.statusBtn} onPress={() => { updateTaskStatus(realm, "Open", itemToUpdate); setUpDateVisible(false); }}>
          <Text>Open</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statusBtn} onPress={() => { updateTaskStatus(realm, "InProgress", itemToUpdate); setUpDateVisible(false); }}>
          <Text>InProgress</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statusBtn} onPress={() => { updateTaskStatus(realm, "Completed", itemToUpdate); setUpDateVisible(false); }}>
          <Text>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeBtn} onPress={() => { setUpDateVisible(false); }}>
          <Text style={{ color: "white" }}>Cancel</Text>
        </TouchableOpacity>
      </Dialog.Container>

      <SwipeListView
        data={todoList}
        renderItem={(data, rowMap) => {
          if (data.item.status === "Completed") {
            return <View style={styles.rowFrontCompleted}>
              <Text key={data.item._id} style={styles.title}>{data.item.name}</Text>
              <Text style={styles.status}>Status: {data.item.status}</Text>
            </View>
          } else {
            return <View style={styles.rowFront}>
              <Text key={data.item._id} style={styles.title}>{data.item.name}</Text>
              <Text style={styles.status}>Status: {data.item.status}</Text>
            </View>
          }
        }}
        renderHiddenItem={(data, rowMap) => (
          <View style={styles.rowBack}>
            <TouchableOpacity style={[styles.backBtn, styles.backLeftBtn]} onPress={() => {
              setItemToUpdate(data.item._id);
              setUpDateVisible(true);
              rowMap[data.item._id].closeRow();
            }}>
              <Text>Update{"\n"}Status</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.backBtn, styles.backRightBtn]} onPress={() => { deleteTask(realm, data.item._id); }}>
              <Text style={{ color: "white" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item._id}
        leftOpenValue={72}
        rightOpenValue={-65}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight: "800"
  },
  status: {
    color: "#FFFF"
  },
  hiddenItems: {
    justifyContent: "space-between",
    flexDirection: "row"
  },
  backRightBtn: {
    backgroundColor: "#c92e2e",
  },
  backLeftBtn: {
    backgroundColor: "#67d6b5",
  },
  backBtn: {
    padding: 10,
    justifyContent: "center",
    height: "100%",
    alignContent: "center",
    borderRadius: 5
  },
  rowFront: {
    backgroundColor: '#f0a54f',
    borderRadius: 5,
    height: 60,
    margin: 5,
    marginBottom: 15,
    shadowColor: '#2F4F4F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    padding: 20
  },
  rowFrontCompleted: {
    backgroundColor: '#b3a89b',
    borderRadius: 5,
    height: 60,
    margin: 5,
    marginBottom: 15,
    shadowColor: '#2F4F4F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    padding: 20
  },
  rowBack: {
    //alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
    marginBottom: 15,
    borderRadius: 5,
    height: 60,
    backgroundColor: "#DCDCDC"
  },
  statusBtn: {
    padding: 10,
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 5,
    backgroundColor: "#5bc0de",
    marginBottom: 10
  },
  closeBtn: {
    backgroundColor: "#d9534f",
    padding: 10,
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 5,
  }
})


// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow strict-local
//  */

// import React, { useEffect, useState } from 'react';
// import {
//   SafeAreaView,
//   TouchableOpacity,
//   Button,
//   StyleSheet,
//   Text,
//   View,
//   FlatList
// } from 'react-native';
// import getRealm from "./database/allSchemas"
// import { deleteAllTodoList, deleteTodoList, updateTodoList, insertNewTodoList, queryToDo, openSchema } from "./database/allSchemas"

// let FlatListItem = () => {
//   <View>
//     <Button title="edit" onPress={updateTodoList} />
//     <Button title="delete" onPress={deleteTodoList} />
//   </View>
// }

// let index = 0;

// export default App = () => {
//   let [todoList, setToDoList] = useState([]);

//   var realm = getRealm();
//   realm.addListener("change", () => {
//     reloadData();
//   })

//   useEffect(() => {
//     reloadData();
//   }, []);

//   const reloadData = () => {
//     queryToDo()
//       .then((todoList) => {
//         setToDoList(todoList);
//         //console.log("reload" + todoList);
//       })
//       .catch(err => setToDoList([]));
//   }

//   return (
//     <View>
//       <Button title="Add" onPress={() => {
//         insertNewTodoList({ id: index++, name: "hi", creationDate: new Date() })
//           .then().catch()
//       }} />
//       <Button title="Query" onPress={() => {
//         queryToDo()
//           .then(a => console.log(a)).catch()
//       }} />
//       <Button title="Delete" onPress={() => {
//         deleteAllTodoList()
//           .then().catch()
//       }} />
//       <FlatList
//         data={todoList}
//         renderItem={({ item, index }) => (
//           <TouchableOpacity onPress={() => { updateTodoList({ id: index, name: "bye", creationDate: new Date() }) }}>
//             <Text key={index}>{item.name}</Text>
//           </TouchableOpacity>
//         )}
//         keyExtractor={(item) => item.id}
//       />
//     </View>
//   );
// }
