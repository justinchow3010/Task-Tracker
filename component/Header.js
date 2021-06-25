import React, { useState } from "react";
import { View, Text, StatusBar, TouchableOpacity, StyleSheet, Platform, Image } from "react-native"
import { addNewTask } from "../database/allSchemas"
import Dialog from "react-native-dialog";
import { ObjectId } from 'bson';

export default Header = ({ realm }) => {
    let [visible, setVisble] = useState(false);
    let [tmpNewTask, setTmpNewTask]= useState("");

    const handleConfirm = () => {
        let newTask = {
            _id: new ObjectId(),
            name: tmpNewTask,
            status: "Open",
            _partition: "key",
            home: {
                address: "hong kong"
            }
        };
        addNewTask(realm, newTask);
        setTmpNewTask("");
        setVisble(false);
    }

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />

            <Dialog.Container visible={visible}>
                <Dialog.Title>Add a Task</Dialog.Title>
                <Dialog.Description>
                    Which task do you want to add?
                </Dialog.Description>
                <Dialog.Input onChangeText={text => setTmpNewTask(text)} />
                <Dialog.Button label="Cancel" onPress={() => setVisble(false)} />
                {tmpNewTask === ""
                    ? <></>
                    : <Dialog.Button label="Confirm" onPress={handleConfirm}
                    />
                }
            </Dialog.Container>


            <Text style={styles.title}>Notes</Text>
            <TouchableOpacity onPress={() => setVisble(true)}>
                <Image
                    style={styles.image}
                    source={require("../assets/img/icons8-add-48.png")}
                />
            </TouchableOpacity>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1d3e6e",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: Platform.OS === "ios" ? 100 : 80,
        padding: 25,
        marginBottom: 10
    },
    title: {
        fontSize: 20,
        color: "white"
    },
    image: {
        resizeMode: "contain",
        width: 30
    }
});