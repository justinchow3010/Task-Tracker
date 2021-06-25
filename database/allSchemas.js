import Realm from 'realm';
import { ObjectId } from 'bson';

class Task {
    constructor({
        name,
        partition,
        status = Task.STATUS_OPEN,
        id = new ObjectId(),
        home
    }) {
        this._partition = partition;
        this._id = id;
        this.name = name;
        this.status = status;
    }
    static STATUS_OPEN = 'Open';
    static STATUS_IN_PROGRESS = 'InProgress';
    static STATUS_COMPLETE = 'Complete';
    static schema = {
        name: 'Task',
        properties: {
            _id: 'objectId',
            _partition: 'string',
            name: 'string',
            status: 'string',
            home: "{}"
        },
        primaryKey: '_id',
    };
}
export { Task };

export function getRealmApp() {
    const appId = 'application-0-apmbs'; // Set Realm app ID here.
    const appConfig = {
        id: appId
    };
    return new Realm.App(appConfig);
}

export async function anonymousLogin() {
    let user;
    try {
        const app = getRealmApp(); // pass in the appConfig variable that you created earlier
        const credentials = Realm.Credentials.anonymous(); // create an anonymous credential
        user = await app.logIn(credentials);
        return user;
    } catch (error) {
        throw `Error logging in anonymously: ${JSON.stringify(error, null, 2)}`;
    }
}

export async function openRealm() {
    let user;
    let realm;
    try {
        user = await anonymousLogin();
        console.log(`Logged in with the user: ${user.identity}`);
        const config = {
            schema: [Task.schema],
            sync: {
                user: user,
                partitionValue: "optional",
            },
        };
        realm = await Realm.open(config);
        return realm;
    } catch (error) {
        throw `Error opening realm: ${JSON.stringify(error, null, 2)}`;
    }
}

export const addNewTask = (realm, newTask) => {
    try {
        realm.write(() => {
            realm.create("Task", newTask);
        });
    } catch (error) {
        console.error(error);
    }
};

export const queryToDo = async(realm) => {
    try {
        // console.log(realm.objects("Task"));
        return( await realm.objects("Task"));
    } catch (err) {
        throw `Error querying realm: ${JSON.stringify(error, null, 2)}`;
    };
};

export const deleteAllTodoList = (realm) => {
    try {
        realm.write(() => {
            let allTasks = realm.objects("Task");
            realm.delete(allTasks);
        })
    } catch (err) {
        console.log(err)
    }
};

export const deleteTask = (realm, id) => {
    try {
        console.log(id)
        realm.write(() => {
            let allTasks = realm.objects("Task");
            let filteredTasks = allTasks.filtered("_id = $0", id);
            console.log(filteredTasks)
            realm.delete(filteredTasks);
        })
    } catch (err) {
        console.log(err)
    }
};

export const updateTaskStatus= (realm, status, id) => {
    try {
        // console.log(id)
        realm.write(() => {
            let allTasks = realm.objects("Task");
            let filteredTasks = allTasks.filtered("_id = $0", id)[0];
            // console.log(status);
            filteredTasks.status = status;
        })
    } catch (error) {
        console.log(error);
    }
}

export function watch(reloadData) {
    openRealm()
        .then(realm => {
            return realm.addListener("change", () => { reloadData(realm) });
        })
        .catch(err => console.log(err))
}

// import Realm, { List } from "realm";

// export const TODO_LIST_SCHEMA = "TodoList";
// export const TODO_SCHEMA = "Todo";

// export const todoSchema = {
//     name: TODO_SCHEMA,
//     primaryKey: "id",
//     properties: {
//         id: "int",
//         name: { type: "string", indexed: true },
//         done: { type: "bool", default: false }
//     }
// }

// export const todoListSchema = {
//     name: TODO_LIST_SCHEMA,
//     primaryKey: "id",
//     properties: {
//         id: "int",
//         name: "string",
//         creationDate: "date",
//         todos: { type: "list", objectType: TODO_SCHEMA }
//     }
// }

// const appId = "application-0-apmbs";

// const app = new Realm.App({ id: appId, timeout: 10000 });

// const credentials = Realm.Credentials.anonymous();

// var configuration;

// getRealm = async () => {
//     try {
//         const user = await app.logIn(credentials);
//     } catch (err) {
//         console.error("Failed to log in", err);
//     }
//     configuration = {
//         schema: [todoSchema, todoListSchema], // add multiple schemas, comma seperated.
//         sync: {
//             user: app.currentUser,
//             partitionValue: "60d309d03ea239d6a7cd5c1d"
//         }
//     };
//     return new Realm(configuration);
// }

// // const databaseOptions = {
// //     //path: "todoListApp.realm",
// //     schema: [todoSchema, todoListSchema],
// //     sync: {
// //         user: app.currentUser, // loggedIn User
// //         partitionValue: "ADMIN", // should be userId(Unique) so it can manage particular user related documents in DB by userId
// //     }
// // }

// export const openSchema = () => new Promise((resolve, reject) => {
//     Realm.open(configuration)
//         .then(resolve())
//         .catch(err => reject(err));
// })

// export const queryToDo = () => new Promise((resolve, reject) => {
//     Realm.open(configuration)
//         .then(realm => {
//             resolve(realm.objects(TODO_LIST_SCHEMA));
//         })
//         .catch(err => reject(err));
// })

// export const insertNewTodoList = (newTodoList) => new Promise((resolve, reject) => {
//     Realm.open(configuration)
//         .then(realm => {
//             realm.write(() => {
//                 realm.create(TODO_LIST_SCHEMA, newTodoList);
//                 resolve(newTodoList);
//             })
//         })
//         .catch(err => console.log(err));
// });

// export const updateTodoList = (todoList) => new Promise((resolve, reject) => {
//     Realm.open(configuration)
//         .then(realm => {
//             realm.write(() => {
//                 let updatingTodoList = realm.objectForPrimaryKey(TODO_LIST_SCHEMA, todoList.id);
//                 updatingTodoList.name = todoList.name;
//                 resolve(todoList);
//             })
//         })
//         .catch(err => console.log(err));
// });

// export const deleteTodoList = (todoList) => new Promise((resolve, reject) => {
//     Realm.open(configuration)
//         .then(realm => {
//             realm.write(() => {
//                 let deletingTodoList = realm.objectForPrimaryKey(TODO_LIST_SCHEMA, todoList.id);
//                 realm.delete(deletingTodoList);
//                 resolve();
//             })
//         })
//         .catch(err => console.log(err));
// });

// export const deleteAllTodoList = () => new Promise((resolve, reject) => {
//     Realm.open(configuration)
//         .then(realm => {
//             realm.write(() => {
//                 let allTodoList = realm.objects(TODO_LIST_SCHEMA);
//                 realm.delete(allTodoList);
//             })
//         })
//         .catch(err => console.log(err));
// });

// // export default new Realm(databaseOptions);
// export default getRealm;