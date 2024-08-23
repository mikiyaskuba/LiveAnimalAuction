import React, { useState, useEffect } from "react";
import {
	View,
	TextInput,
	Button,
	FlatList,
	Text,
	StyleSheet,
} from "react-native";
import { db } from "../firebaseConfig";
import {
	collection,
	addDoc,
	query,
	where,
	orderBy,
	onSnapshot,
} from "firebase/firestore";
import { auth } from "../firebaseConfig";

const MessageScreen = ({ route }) => {
	const { sellerId } = route.params;
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");

	useEffect(() => {
		if (!auth.currentUser || !sellerId) {
			console.error("User ID or seller ID is undefined");
			return;
		}

		const q = query(
			collection(db, "messages"),
			where("senderId", "in", [auth.currentUser.uid, sellerId]),
			where("receiverId", "in", [auth.currentUser.uid, sellerId]),
			orderBy("createdAt")
		);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const fetchedMessages = [];
			snapshot.forEach((doc) => {
				fetchedMessages.push({ id: doc.id, ...doc.data() });
			});
			setMessages(fetchedMessages);
		});

		return () => unsubscribe();
	}, [sellerId]);

	const handleSendMessage = async () => {
		if (newMessage.trim()) {
			await addDoc(collection(db, "messages"), {
				senderId: auth.currentUser.uid,
				receiverId: sellerId,
				message: newMessage,
				createdAt: new Date(),
			});
			setNewMessage("");
		}
	};

	const renderItem = ({ item }) => (
		<View
			style={
				item.senderId === auth.currentUser.uid
					? styles.sentMessage
					: styles.receivedMessage
			}
		>
			<Text>{item.message}</Text>
		</View>
	);

	return (
		<View style={styles.container}>
			<FlatList
				data={messages}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				style={styles.messageList}
			/>
			<View style={styles.inputContainer}>
				<TextInput
					style={styles.input}
					placeholder="Type a message"
					value={newMessage}
					onChangeText={setNewMessage}
				/>
				<Button title="Send" onPress={handleSendMessage} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	messageList: {
		flex: 1,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	input: {
		flex: 1,
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 8,
		borderRadius: 8,
		marginRight: 8,
	},
	sentMessage: {
		alignSelf: "flex-end",
		backgroundColor: "#dcf8c6",
		padding: 10,
		borderRadius: 8,
		marginBottom: 10,
		maxWidth: "80%",
	},
	receivedMessage: {
		alignSelf: "flex-start",
		backgroundColor: "#eee",
		padding: 10,
		borderRadius: 8,
		marginBottom: 10,
		maxWidth: "80%",
	},
});

export default MessageScreen;


// export default MessageScreen;
// import React, { useState, useEffect } from "react";
// import { View, Text, FlatList } from "react-native";
// import { db } from "../firebaseConfig";
// import { collection, query, where, getDocs } from "firebase/firestore";

// const MessageScreen = ({ route }) => {
// 	const { sellerName } = route.params; // Retrieve sellerName from route params
// 	const [messages, setMessages] = useState([]);

// 	useEffect(() => {
// 		const fetchMessages = async () => {
// 			if (!sellerName) {
// 				console.error("Seller Name is undefined!");
// 				return;
// 			}

// 			try {
// 				const messagesQuery = query(
// 					collection(db, "messages"),
// 					where("sellerName", "==", sellerName) // Ensure sellerName is defined
// 				);

// 				const querySnapshot = await getDocs(messagesQuery);
// 				const fetchedMessages = querySnapshot.docs.map((doc) => ({
// 					id: doc.id,
// 					...doc.data(),
// 				}));
// 				setMessages(fetchedMessages);
// 			} catch (error) {
// 				console.error("Error fetching messages: ", error);
// 			}
// 		};

// 		fetchMessages();
// 	}, [sellerName]);

// 	return (
// 		<View>
// 			<Text>Messages with {sellerName}</Text>
// 			<FlatList
// 				data={messages}
// 				keyExtractor={(item) => item.id}
// 				renderItem={({ item }) => (
// 					<View>
// 						<Text>{item.content}</Text>
// 					</View>
// 				)}
// 			/>
// 		</View>
// 	);
// };

// export default MessageScreen;
