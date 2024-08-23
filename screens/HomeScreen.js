// import React, { useState, useEffect } from "react";
// import {
// 	View,
// 	Text,
// 	Image,
// 	TouchableOpacity,
// 	FlatList,
// 	StyleSheet,
// } from "react-native";
// import { db } from "../firebaseConfig";
// import { collection, getDocs, doc, getDoc } from "firebase/firestore";
// import { useNavigation } from "@react-navigation/native";

// const HomeScreen = () => {
// 	const [cattlePosts, setCattlePosts] = useState([]);
// 	const navigation = useNavigation();

// 	useEffect(() => {
// 		const fetchCattlePosts = async () => {
// 			try {
// 				const querySnapshot = await getDocs(collection(db, "cattle"));
// 				const posts = [];

// 				for (const cattleDoc of querySnapshot.docs) {
// 					const cattleData = cattleDoc.data();

// 					if (cattleData.sellerId) {
// 						// Fetch seller's name using sellerId
// 						const sellerDoc = await getDoc(
// 							doc(db, "users", cattleData.sellerId)
// 						);

// 						if (sellerDoc.exists()) {
// 							const sellerName = sellerDoc.data().name;
// 							posts.push({
// 								id: cattleDoc.id,
// 								...cattleData,
// 								sellerName, // Include the seller's name
// 							});
// 						} else {
// 							console.error(
// 								`Seller document ${cattleData.sellerId} is missing`
// 							);
// 						}
// 					} else {
// 						console.error(`Document ${cattleDoc.id} is missing sellerId`);
// 					}
// 				}

// 				setCattlePosts(posts);
// 			} catch (error) {
// 				console.error("Error fetching cattle posts: ", error);
// 			}
// 		};

// 		fetchCattlePosts();
// 	}, []);

// const handleMessage = (sellerName) => {
// 	if (sellerName) {
// 		console.log("Seller Name:", sellerName);
// 		navigation.navigate("Message", { sellerName }); // Pass the sellerName to the MessageScreen
// 	} else {
// 		console.error("Seller Name is missing!");
// 	}
// };

// 	const renderPost = ({ item }) => (
// 		<View style={styles.postContainer}>
// 			<View style={styles.header}>
// 				<Image source={{ uri: item.imageUrl }} style={styles.profileImage} />
// 				<Text style={styles.sellerName}>{item.sellerName}</Text>
// 			</View>
// 			<Image source={{ uri: item.imageUrl }} style={styles.image} />
// 			<Text style={styles.name}>{item.name}</Text>
// 			<Text style={styles.price}>${item.price}</Text>
// 			<Text style={styles.description}>{item.description}</Text>
// 			<TouchableOpacity
// 				style={styles.messageButton}
// 				onPress={() => handleMessage(item.sellerName)}
// 			>
// 				<Text style={styles.messageButtonText}>Message Seller</Text>
// 			</TouchableOpacity>
// 		</View>
// 	);

// 	return (
// 		<FlatList
// 			data={cattlePosts}
// 			renderItem={renderPost}
// 			keyExtractor={(item) => item.id}
// 			contentContainerStyle={styles.listContainer}
// 		/>
// 	);
// };

// const styles = StyleSheet.create({
// 	listContainer: {
// 		padding: 16,
// 		backgroundColor: "#f2f2f2",
// 	},
// 	postContainer: {
// 		backgroundColor: "#fff",
// 		borderRadius: 8,
// 		shadowColor: "#000",
// 		shadowOffset: { width: 0, height: 2 },
// 		shadowOpacity: 0.2,
// 		shadowRadius: 4,
// 		elevation: 5,
// 		marginBottom: 16,
// 		padding: 16,
// 	},
// 	header: {
// 		flexDirection: "row",
// 		alignItems: "center",
// 		marginBottom: 12,
// 	},
// 	profileImage: {
// 		width: 40,
// 		height: 40,
// 		borderRadius: 20,
// 		marginRight: 12,
// 	},
// 	sellerName: {
// 		fontSize: 16,
// 		fontWeight: "bold",
// 	},
// 	image: {
// 		width: "100%",
// 		height: 200,
// 		borderRadius: 8,
// 		marginBottom: 12,
// 	},
// 	name: {
// 		fontSize: 18,
// 		fontWeight: "bold",
// 		marginBottom: 8,
// 	},
// 	price: {
// 		fontSize: 16,
// 		color: "#888",
// 		marginBottom: 8,
// 	},
// 	description: {
// 		fontSize: 14,
// 		color: "#555",
// 		marginBottom: 16,
// 	},
// 	messageButton: {
// 		backgroundColor: "#1e90ff",
// 		paddingVertical: 12,
// 		borderRadius: 8,
// 	},
// 	messageButtonText: {
// 		color: "#fff",
// 		textAlign: "center",
// 		fontSize: 16,
// 		fontWeight: "bold",
// 	},
// });

// export default HomeScreen;


import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	FlatList,
	StyleSheet,
} from "react-native";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
	const [cattlePosts, setCattlePosts] = useState([]);
	const navigation = useNavigation();

	useEffect(() => {
		const fetchCattlePosts = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, "cattle"));
				const posts = [];
				for (const docSnap of querySnapshot.docs) {
					const data = docSnap.data();
					if (data.sellerId) {
						// Fetch the seller name using the sellerId from the users collection
						const userDoc = await getDoc(doc(db, "users", data.sellerId));
						if (userDoc.exists()) {
							posts.push({
								id: docSnap.id,
								...data,
								sellerName: userDoc.data().name || "Unknown", // Add sellerName to data
							});
						} else {
							console.error(`No user found for sellerId ${data.sellerId}`);
						}
					} else {
						console.error(`Document ${docSnap.id} is missing sellerId`);
					}
				}
				setCattlePosts(posts);
			} catch (error) {
				console.error("Error fetching cattle posts: ", error);
			}
		};

		fetchCattlePosts();
	}, []);

	const handleMessage = (sellerId) => {
		if (sellerId) {
			navigation.navigate("Message", { sellerId });
		} else {
			console.error("Seller ID is missing!");
		}
	};

	const renderPost = ({ item }) => {
		if (
			!item.name ||
			!item.price ||
			!item.description ||
			!item.imageUrl ||
			!item.sellerName
		) {
			console.error("Invalid item data:", item);
			return null;
		}

		return (
			<View style={styles.postContainer}>
				<Image source={{ uri: item.imageUrl }} style={styles.profileImage} />
				 <Text style={styles.sellerName}>{item.sellerName}</Text>
				<Image source={{ uri: item.imageUrl }} style={styles.image} />
				<Text style={styles.name}>{item.name}</Text>
				<Text style={styles.price}>${item.price}</Text>
				<Text style={styles.description}>{item.description}</Text>
				<Text style={styles.sellerName}>Seller: {item.sellerName}</Text>
				<TouchableOpacity
					style={styles.messageButton}
					onPress={() => handleMessage(item.sellerId)} // Pass sellerId instead of sellerName
				>
					<Text style={styles.messageButtonText}>Message Seller</Text>
				</TouchableOpacity>
			</View>
		);
	};

	return (
		<FlatList
			data={cattlePosts}
			renderItem={renderPost}
			keyExtractor={(item) => item.id}
			contentContainerStyle={styles.listContainer}
		/>
	);
};

const styles = StyleSheet.create({
	listContainer: {
		padding: 16,
		backgroundColor: "#f2f2f2",
	},
	postContainer: {
		backgroundColor: "#fff",
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 5,
		marginBottom: 16,
		padding: 16,
	},
		profileImage: {
		width: 40,
			height: 40,
			borderRadius: 20,
	 		marginRight: 12,
	 	},
	 	sellerName: {
			fontSize: 16,
	 		fontWeight: "bold",
		},
	image: {
		width: "100%",
		height: 200,
		borderRadius: 8,
		marginBottom: 12,
	},
	name: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 8,
	},
	price: {
		fontSize: 16,
		color: "#888",
		marginBottom: 8,
	},
	description: {
		fontSize: 14,
		color: "#555",
		marginBottom: 16,
	},
	sellerName: {
		fontSize: 14,
		fontWeight: "bold",
		marginBottom: 8,
	},
	messageButton: {
		backgroundColor: "#1e90ff",
		paddingVertical: 12,
		borderRadius: 8,
	},
	messageButtonText: {
		color: "#fff",
		textAlign: "center",
		fontSize: 16,
		fontWeight: "bold",
	},
});

export default HomeScreen;


