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


// HomeScreen.js
// import React, { useState, useEffect } from "react";
// import {
// 	View,
// 	Text,
// 	Image,
// 	TouchableOpacity,
// 	FlatList,
// 	StyleSheet,
// 	Alert,
// 	ActivityIndicator,
// 	Modal,
// 	TextInput,
// } from "react-native";
// import { db, auth } from "../firebaseConfig";
// import {
// 	collection,
// 	getDocs,
// 	doc,
// 	getDoc,
// 	deleteDoc,
// 	addDoc,
// } from "firebase/firestore";
// import { useNavigation } from "@react-navigation/native";
// import { Video } from "expo-av";
// import { Picker } from "@react-native-picker/picker";

// const HomeScreen = () => {
// 	const [cattlePosts, setCattlePosts] = useState([]);
// 	const [loading, setLoading] = useState(true);
// 	const [modalVisible, setModalVisible] = useState(false);
// 	const [selectedPortion, setSelectedPortion] = useState("1");
// 	const [currentPostId, setCurrentPostId] = useState(null);
// 	const [userName, setUserName] = useState("");
// 	const [userLocation, setUserLocation] = useState("");
// 	const [userPhoneNumber, setUserPhoneNumber] = useState("");
// 	const navigation = useNavigation();
// 	const currentUser = auth.currentUser;

// useEffect(() => {
// 	const fetchCattlePosts = async () => {
// 		try {
// 			const querySnapshot = await getDocs(collection(db, "cattle"));
// 			const posts = [];
// 			for (const docSnap of querySnapshot.docs) {
// 				const data = docSnap.data();
// 				if (data.sellerId) {
// 					console.log("Fetching user with sellerId: ", data.sellerId); // Log the sellerId
// 					const userDoc = await getDoc(doc(db, "users", data.sellerId));
// 					if (userDoc.exists()) {
// 						const userData = userDoc.data();
// 						console.log("User Data from Firestore:", userData); // Log the user data fetched

// 						posts.push({
// 							id: docSnap.id,
// 							...data,
// 							sellerName: userData.name || "Unknown",
// 							isAdmin: userData.isAdmin || false,
// 						});
// 					}
// 				}
// 			}
// 			setCattlePosts(posts);
// 		} catch (error) {
// 			console.error("Error fetching cattle posts: ", error);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	fetchCattlePosts();
// }, []);

// 	const handleDeletePost = async (postId) => {
// 		try {
// 			await deleteDoc(doc(db, "cattle", postId));
// 			Alert.alert("Success", "Post deleted successfully!");
// 			setCattlePosts(cattlePosts.filter((post) => post.id !== postId));
// 		} catch (error) {
// 			console.error("Error deleting post: ", error);
// 			Alert.alert("Error", "Failed to delete the post. Please try again.");
// 		}
// 	};

// 	const handleOrderNow = (postId) => {
// 		setCurrentPostId(postId);
// 		setModalVisible(true);
// 	};

// 	const handleOrderConfirm = async () => {
// 		if (!userName || !userLocation || !userPhoneNumber) {
// 			Alert.alert("Error", "Please fill in all the fields.");
// 			return;
// 		}

// 		try {
// 			await addDoc(collection(db, "orders"), {
// 				postId: currentPostId,
// 				userId: currentUser.uid,
// 				name: userName,
// 				location: userLocation,
// 				phoneNumber: userPhoneNumber,
// 				portion: selectedPortion,
// 				status: selectedPortion === "8" ? "Completed" : "Pending",
// 				createdAt: new Date(),
// 			});

// 			if (selectedPortion === "8") {
// 				console.log("Order Completed. Notify Admin.");
// 			}

// 			Alert.alert(
// 				"Order Confirmed",
// 				`You have ordered ${selectedPortion} portion(s).`
// 			);
// 			setModalVisible(false);
// 		} catch (error) {
// 			console.error("Error confirming order: ", error);
// 			Alert.alert("Error", "Failed to confirm order. Please try again.");
// 		}
// 	};
// const [currentUserData, setCurrentUserData] = useState(null);

// useEffect(() => {
// 	const fetchCurrentUserData = async () => {
// 		if (currentUser) {
// 			try {
// 				const userDoc = await getDoc(doc(db, "users", currentUser.uid));
// 				if (userDoc.exists()) {
// 					setCurrentUserData(userDoc.data());
// 				} else {
// 					console.log("No such user document!");
// 				}
// 			} catch (error) {
// 				console.error("Error fetching user data: ", error);
// 			}
// 		}
// 	};

// 	fetchCurrentUserData();
// }, [currentUser]);


// const renderPost = ({ item }) => {
// 	// Check if item data is valid
// 	if (
// 		!item.zoomLink ||
// 		!item.price ||
// 		!item.description ||
// 		(!item.imageUrl && !item.videoUrl) ||
// 		!item.sellerName
// 	) {
// 		console.error("Invalid item data:", item);
// 		return null;
// 	}

// 	// Check current user's admin status
// 	const isAdmin = currentUserData?.isAdmin || false; // Ensure you have this correctly set from Firestore

// 	return (
// 		<View style={styles.postContainer}>
// 			{item.profileImageUrl && (
// 				<Image
// 					source={{ uri: item.profileImageUrl }}
// 					style={styles.profileImage}
// 				/>
// 			)}
// 			<Text style={styles.sellerName}>{item.sellerName}</Text>
// 			{item.imageUrl && !item.videoUrl && (
// 				<Image source={{ uri: item.imageUrl }} style={styles.postImage} />
// 			)}
// 			{item.videoUrl && !item.imageUrl && (
// 				<Video
// 					source={{ uri: item.videoUrl }}
// 					style={styles.postVideo}
// 					useNativeControls
// 					resizeMode="contain"
// 				/>
// 			)}

// 			{/* Show the "Order Now" button only if the current user is not an admin and is not the seller */}
// 			{!isAdmin && item.sellerId !== currentUser.uid && (
// 				<TouchableOpacity onPress={() => handleOrderNow(item.id)}>
// 					<Text style={styles.orderButton}>Order Now</Text>
// 				</TouchableOpacity>
// 			)}

// 			{/* Display the delete button only for the admin who posted the item */}
// 			{item.sellerId === currentUser.uid && isAdmin && (
// 				<TouchableOpacity
// 					style={styles.deleteButton}
// 					onPress={() => handleDeletePost(item.id)}
// 				>
// 					<Text style={styles.deleteButtonText}>Delete Post</Text>
// 				</TouchableOpacity>
// 			)}

// 			<Text style={styles.price}>Price: ${item.price}</Text>
// 			<Text style={styles.description}>{item.description}</Text>
// 		</View>
// 	);
// };



// 	if (loading) {
// 		return (
// 			<View style={styles.loadingContainer}>
// 				<ActivityIndicator size="large" color="#0000ff" />
// 				<Text>Loading posts...</Text>
// 			</View>
// 		);
// 	}

// 	return (
// 		<View style={styles.container}>
// 			     <View style={styles.navbar}>
//             {currentUserData && currentUserData.isAdmin && (
//                 <TouchableOpacity
//                     style={styles.navButton}
//                     onPress={() => navigation.navigate("AdminDashboard")}
//                 >
//                     <Text style={styles.navButtonText}>Admin Dashboard</Text>
//                 </TouchableOpacity>
//             )}
//         </View>
// 			<FlatList
// 				data={cattlePosts}
// 				renderItem={renderPost}
// 				keyExtractor={(item) => item.id}
// 				contentContainerStyle={styles.listContainer}
// 			/>

// 			<Modal
// 				animationType="slide"
// 				transparent={true}
// 				visible={modalVisible}
// 				onRequestClose={() => setModalVisible(false)}
// 			>
// 				<View style={styles.modalContainer}>
// 					<View style={styles.modalContent}>
// 						<Text style={styles.modalTitle}>Select Portions</Text>
// 						<Picker
// 							selectedValue={selectedPortion}
// 							style={styles.picker}
// 							onValueChange={(itemValue) => setSelectedPortion(itemValue)}
// 						>
// 							<Picker.Item label="1 Portion" value="1" />
// 							<Picker.Item label="2 Portions" value="2" />
// 							<Picker.Item label="3 Portions" value="3" />
// 							<Picker.Item label="4 Portions" value="4" />
// 							<Picker.Item label="5 Portions" value="5" />
// 							<Picker.Item label="6 Portions" value="6" />
// 							<Picker.Item label="7 Portions" value="7" />
// 							<Picker.Item label="8 Portions" value="8" />
// 						</Picker>
// 						<TextInput
// 							style={styles.input}
// 							placeholder="Name"
// 							value={userName}
// 							onChangeText={setUserName}
// 						/>
// 						<TextInput
// 							style={styles.input}
// 							placeholder="Location"
// 							value={userLocation}
// 							onChangeText={setUserLocation}
// 						/>
// 						<TextInput
// 							style={styles.input}
// 							placeholder="Phone Number"
// 							value={userPhoneNumber}
// 							onChangeText={setUserPhoneNumber}
// 							keyboardType="phone-pad"
// 						/>
// 						<TouchableOpacity
// 							style={styles.confirmButton}
// 							onPress={handleOrderConfirm}
// 						>
// 							<Text style={styles.confirmButtonText}>Confirm Order</Text>
// 						</TouchableOpacity>
// 						<TouchableOpacity
// 							style={styles.cancelButton}
// 							onPress={() => setModalVisible(false)}
// 						>
// 							<Text style={styles.cancelButtonText}>Cancel</Text>
// 						</TouchableOpacity>
// 					</View>
// 				</View>
// 			</Modal>
// 		</View>
// 	);
// };

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		padding: 10,
// 	},
// 	loadingContainer: {
// 		flex: 1,
// 		justifyContent: "center",
// 		alignItems: "center",
// 	},
// 	navbar: {
// 		flexDirection: "row",
// 		justifyContent: "space-between",
// 		paddingHorizontal: 10,
// 		paddingVertical: 15,
// 		backgroundColor: "#f8f8f8",
// 	},
// 	navButton: {
// 		paddingVertical: 10,
// 		paddingHorizontal: 20,
// 		backgroundColor: "#000",
// 		borderRadius: 5,
// 	},
// 	navButtonText: {
// 		color: "#fff",
// 		fontWeight: "bold",
// 		fontSize: 16,
// 	},
// 	listContainer: {
// 		paddingBottom: 20,
// 	},
// 	postContainer: {
// 		backgroundColor: "#f0f0f0",
// 		padding: 15,
// 		marginVertical: 10,
// 		borderRadius: 10,
// 	},
// 	profileImage: {
// 		width: 50,
// 		height: 50,
// 		borderRadius: 25,
// 		marginBottom: 10,
// 	},
// 	sellerName: {
// 		fontWeight: "bold",
// 		fontSize: 18,
// 		marginBottom: 10,
// 	},
// 	postImage: {
// 		width: "100%",
// 		height: 200,
// 		borderRadius: 10,
// 		marginBottom: 10,
// 	},
// 	postVideo: {
// 		width: "100%",
// 		height: 200,
// 		borderRadius: 10,
// 		marginBottom: 10,
// 	},
// 	orderButton: {
// 		paddingVertical: 10,
// 		paddingHorizontal: 20,
// 		backgroundColor: "#28a745",
// 		color: "#fff",
// 		borderRadius: 5,
// 		textAlign: "center",
// 		marginBottom: 10,
// 	},
// 	deleteButton: {
// 		paddingVertical: 10,
// 		paddingHorizontal: 20,
// 		backgroundColor: "#dc3545",
// 		borderRadius: 5,
// 		textAlign: "center",
// 	},
// 	deleteButtonText: {
// 		color: "#fff",
// 		fontWeight: "bold",
// 		fontSize: 16,
// 	},
// 	price: {
// 		fontWeight: "bold",
// 		fontSize: 18,
// 		marginTop: 10,
// 	},
// 	description: {
// 		fontSize: 16,
// 		marginTop: 5,
// 	},
// 	modalContainer: {
// 		flex: 1,
// 		justifyContent: "center",
// 		alignItems: "center",
// 		backgroundColor: "rgba(0,0,0,0.5)",
// 	},
// 	modalContent: {
// 		width: "80%",
// 		backgroundColor: "#fff",
// 		padding: 20,
// 		borderRadius: 10,
// 	},
// 	modalTitle: {
// 		fontSize: 20,
// 		fontWeight: "bold",
// 		marginBottom: 15,
// 	},
// 	picker: {
// 		height: 50,
// 		width: "100%",
// 		marginBottom: 15,
// 	},
// 	input: {
// 		height: 40,
// 		borderColor: "#ccc",
// 		borderWidth: 1,
// 		borderRadius: 5,
// 		marginBottom: 15,
// 		paddingHorizontal: 10,
// 	},
// 	confirmButton: {
// 		backgroundColor: "#28a745",
// 		paddingVertical: 10,
// 		borderRadius: 5,
// 		alignItems: "center",
// 		marginBottom: 10,
// 	},
// 	confirmButtonText: {
// 		color: "#fff",
// 		fontWeight: "bold",
// 		fontSize: 16,
// 	},
// 	cancelButton: {
// 		backgroundColor: "#dc3545",
// 		paddingVertical: 10,
// 		borderRadius: 5,
// 		alignItems: "center",
// 	},
// 	cancelButtonText: {
// 		color: "#fff",
// 		fontWeight: "bold",
// 		fontSize: 16,
// 	},
// 	navbar: {
// 		flexDirection: "row",
// 		justifyContent: "space-between",
// 		paddingHorizontal: 10,
// 		paddingVertical: 15,
// 		backgroundColor: "#f8f8f8", // Navbar background
// 		borderColor: "red", // Temporary border for debugging
// 		borderWidth: 1,
// 	},
// 	navButton: {
// 		paddingVertical: 10,
// 		paddingHorizontal: 20,
// 		backgroundColor: "#000", // Button background
// 		borderRadius: 5,
// 		borderColor: "blue", // Temporary border for debugging
// 		borderWidth: 1,
// 	},
// 	navButtonText: {
// 		color: "#fff", // Text color
// 		fontWeight: "bold",
// 		fontSize: 16,
// 		borderColor: "green", // Temporary border for debugging
// 		borderWidth: 1,
// 	},
// });
// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#f5f5f5",
// 	},
// 	navbar: {
// 		flexDirection: "row",
// 		justifyContent: "space-between",
// 		padding: 10,
// 		backgroundColor: "#6200ea",
// 	},
// 	navButton: {
// 		backgroundColor: "#3700b3",
// 		paddingVertical: 10,
// 		paddingHorizontal: 15,
// 		borderRadius: 5,
// 	},
// 	navButtonText: {
// 		color: "#fff",
// 		fontSize: 16,
// 		fontWeight: "bold",
// 	},
// 	listContainer: {
// 		padding: 10,
// 	},
// 	postContainer: {
// 		backgroundColor: "#ffffff",
// 		borderRadius: 10,
// 		marginBottom: 15,
// 		padding: 10,
// 		shadowColor: "#000",
// 		shadowOffset: { width: 0, height: 2 },
// 		shadowOpacity: 0.3,
// 		shadowRadius: 5,
// 		elevation: 3,
// 	},
// 	profileImage: {
// 		width: 40,
// 		height: 40,
// 		borderRadius: 20,
// 		marginBottom: 10,
// 	},
// 	sellerName: {
// 		fontSize: 18,
// 		fontWeight: "bold",
// 		color: "#333",
// 		marginBottom: 5,
// 	},
// 	postImage: {
// 		width: "100%",
// 		height: 200,
// 		borderRadius: 10,
// 		marginBottom: 10,
// 		resizeMode: "cover",
// 	},
// 	postVideo: {
// 		width: "100%",
// 		height: 200,
// 		borderRadius: 10,
// 		marginBottom: 10,
// 	},
// 	orderButton: {
// 		backgroundColor: "#03dac6",
// 		paddingVertical: 10,
// 		paddingHorizontal: 15,
// 		borderRadius: 5,
// 		alignSelf: "center",
// 		marginTop: 10,
// 	},
// 	deleteButton: {
// 		backgroundColor: "#e53935",
// 		paddingVertical: 8,
// 		paddingHorizontal: 12,
// 		borderRadius: 5,
// 		alignSelf: "center",
// 		marginTop: 10,
// 	},
// 	deleteButtonText: {
// 		color: "#fff",
// 		fontSize: 14,
// 		fontWeight: "bold",
// 	},
// 	price: {
// 		fontSize: 16,
// 		color: "#333",
// 		marginTop: 10,
// 	},
// 	description: {
// 		fontSize: 14,
// 		color: "#666",
// 		marginTop: 5,
// 	},
// 	loadingContainer: {
// 		flex: 1,
// 		justifyContent: "center",
// 		alignItems: "center",
// 	},
// 	modalContainer: {
// 		flex: 1,
// 		justifyContent: "center",
// 		alignItems: "center",
// 		backgroundColor: "rgba(0, 0, 0, 0.5)",
// 	},
// 	modalContent: {
// 		width: "80%",
// 		backgroundColor: "#fff",
// 		borderRadius: 10,
// 		padding: 20,
// 		alignItems: "center",
// 	},
// 	modalTitle: {
// 		fontSize: 18,
// 		fontWeight: "bold",
// 		marginBottom: 10,
// 	},
// 	picker: {
// 		width: "100%",
// 		height: 50,
// 		marginBottom: 15,
// 	},
// 	input: {
// 		width: "100%",
// 		height: 40,
// 		borderColor: "#ccc",
// 		borderWidth: 1,
// 		borderRadius: 5,
// 		paddingHorizontal: 10,
// 		marginBottom: 10,
// 	},
// 	confirmButton: {
// 		backgroundColor: "#03dac6",
// 		paddingVertical: 10,
// 		paddingHorizontal: 15,
// 		borderRadius: 5,
// 		width: "100%",
// 		alignItems: "center",
// 		marginTop: 10,
// 	},
// 	confirmButtonText: {
// 		color: "#fff",
// 		fontSize: 16,
// 		fontWeight: "bold",
// 	},
// 	cancelButton: {
// 		backgroundColor: "#e53935",
// 		paddingVertical: 10,
// 		paddingHorizontal: 15,
// 		borderRadius: 5,
// 		width: "100%",
// 		alignItems: "center",
// 		marginTop: 10,
// 	},
// 	cancelButtonText: {
// 		color: "#fff",
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
	Alert,
	ActivityIndicator,
	Modal,
	TextInput,
	Linking,
} from "react-native";
import { db, auth } from "../firebaseConfig";
import {
	collection,
	getDocs,
	doc,
	getDoc,
	deleteDoc,
	addDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Video } from "expo-av";
import { Picker } from "@react-native-picker/picker";

const HomeScreen = () => {
	const [cattlePosts, setCattlePosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [modalVisible, setModalVisible] = useState(false);
	const [kiloModalVisible, setKiloModalVisible] = useState(false);
	const [selectedPortion, setSelectedPortion] = useState("1");
	const [currentPostId, setCurrentPostId] = useState(null);
	const [userName, setUserName] = useState("");
	const [userLocation, setUserLocation] = useState("");
	const [userPhoneNumber, setUserPhoneNumber] = useState("");
	const [currentUserData, setCurrentUserData] = useState(null);
	const [kilo, setKilo] = useState("");
	const navigation = useNavigation();
	const currentUser = auth.currentUser;

	const handleKiloOrderConfirm = () => {
		// Handle the kilo order here
		console.log(`Ordered ${kilo} kilos`);
		setKiloModalVisible(false);
		setKilo(""); // Reset the input field
	};

	useEffect(() => {
		const fetchCattlePosts = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, "cattle"));
				const posts = [];
				for (const docSnap of querySnapshot.docs) {
					const data = docSnap.data();
					if (data.sellerId) {
						const userDoc = await getDoc(doc(db, "users", data.sellerId));
						if (userDoc.exists()) {
							const userData = userDoc.data();
							posts.push({
								id: docSnap.id,
								...data,
								sellerName: userData.name || "Unknown",
								isAdmin: userData.isAdmin || false,
							});
						}
					}
				}
				setCattlePosts(posts);
			} catch (error) {
				console.error("Error fetching cattle posts: ", error);
			} finally {
				setLoading(false);
			}
		};

		fetchCattlePosts();
	}, []);

	useEffect(() => {
		const fetchCurrentUserData = async () => {
			if (currentUser) {
				try {
					const userDoc = await getDoc(doc(db, "users", currentUser.uid));
					if (userDoc.exists()) {
						setCurrentUserData(userDoc.data());
					} else {
						console.log("No such user document!");
					}
				} catch (error) {
					console.error("Error fetching user data: ", error);
				}
			}
		};

		fetchCurrentUserData();
	}, [currentUser]);

	const handleDeletePost = async (postId) => {
		try {
			await deleteDoc(doc(db, "cattle", postId));
			Alert.alert("Success", "Post deleted successfully!");
			setCattlePosts(cattlePosts.filter((post) => post.id !== postId));
		} catch (error) {
			console.error("Error deleting post: ", error);
			Alert.alert("Error", "Failed to delete the post. Please try again.");
		}
	};

	const handleOrderNow = (postId) => {
		setCurrentPostId(postId);
		setModalVisible(true);
	};

	const handleOrderConfirm = async () => {
		if (!userName || !userLocation || !userPhoneNumber) {
			Alert.alert("Error", "Please fill in all the fields.");
			return;
		}

		try {
			// Fetch the post to check current portion count
			const postDoc = await getDoc(doc(db, "cattle", currentPostId));
			const postData = postDoc.data();
			const currentPortionCount = postData?.portionCount || 0;

			if (currentPortionCount + parseInt(selectedPortion) > 8) {
				Alert.alert(
					"Error",
					"This post has reached the maximum portion count."
				);
				return;
			}

			await addDoc(collection(db, "orders"), {
				postId: currentPostId,
				userId: currentUser.uid,
				name: userName,
				location: userLocation,
				phoneNumber: userPhoneNumber,
				portion: selectedPortion,
				status:
					currentPortionCount + parseInt(selectedPortion) >= 8
						? "Completed"
						: "Pending",
				createdAt: new Date(),
			});

			Alert.alert(
				"Order Confirmed",
				`You have ordered ${selectedPortion} portion(s).`
			);
			setModalVisible(false);
		} catch (error) {
			console.error("Error confirming order: ", error);
			Alert.alert("Error", "Failed to confirm order. Please try again.");
		}
	};

	const renderPost = ({ item }) => {
		if (
			!item.zoomLink ||
			!item.price ||
			!item.description ||
			(!item.imageUrl && !item.videoUrl) ||
			!item.sellerName
		) {
			console.error("Invalid item data:", item);
			return null;
		}

		const isAdmin = currentUserData?.isAdmin || false;

		return (
			<View style={styles.postContainer}>
				{item.profileImageUrl && (
					<Image
						source={{ uri: item.profileImageUrl }}
						style={styles.profileImage}
					/>
				)}
				<Text style={styles.sellerName}>{item.sellerName}</Text>
				{item.imageUrl && !item.videoUrl && (
					<Image source={{ uri: item.imageUrl }} style={styles.postImage} />
				)}
				{item.videoUrl && !item.imageUrl && (
					<Video
						source={{ uri: item.videoUrl }}
						style={styles.postVideo}
						useNativeControls
						resizeMode="contain"
					/>
				)}

				{/* Show the "Order Now" button only if the current user is not an admin and is not the seller */}
				{!isAdmin && item.sellerId !== currentUser.uid && (
					<TouchableOpacity onPress={() => handleOrderNow(item.id)}>
						<Text style={styles.orderButton}>Order Now</Text>
					</TouchableOpacity>
				)}

				{/* Display the delete button only for the admin who posted the item */}
				{item.sellerId === currentUser.uid && isAdmin && (
					<TouchableOpacity
						style={styles.deleteButton}
						onPress={() => handleDeletePost(item.id)}
					>
						<Text style={styles.deleteButtonText}>Delete Post</Text>
					</TouchableOpacity>
				)}

				{/* Zoom Link Button */}
				{item.zoomLink && (
					<TouchableOpacity
						style={styles.zoomButton}
						onPress={() => Linking.openURL(item.zoomLink)}
					>
						<Text style={styles.zoomButtonText}>Join Zoom Meeting</Text>
					</TouchableOpacity>
				)}

				<Text style={styles.price}>Price: ${item.price}</Text>
				<Text style={styles.description}>{item.description}</Text>
			</View>
		);
	};

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#0000ff" />
				<Text>Loading posts...</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.navbar}>
				<TouchableOpacity
					style={styles.navButton}
					onPress={() => setKiloModalVisible(true)}
				>
					<Text style={styles.navButtonText}>Order in Kilo</Text>
				</TouchableOpacity>
				{currentUserData && currentUserData.isAdmin && (
					<TouchableOpacity
						style={styles.navButton}
						onPress={() => navigation.navigate("AdminDashboard")}
					>
						<Text style={styles.navButtonText}>Admin Dashboard</Text>
					</TouchableOpacity>
				)}
			</View>
			<FlatList
				data={cattlePosts}
				renderItem={renderPost}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContainer}
			/>

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Select Portions</Text>
						<Picker
							selectedValue={selectedPortion}
							style={styles.picker}
							onValueChange={(itemValue) => setSelectedPortion(itemValue)}
						>
							<Picker.Item label="1 Portion" value="1" />
							<Picker.Item label="2 Portions" value="2" />
							<Picker.Item label="3 Portions" value="3" />
							<Picker.Item label="4 Portions" value="4" />
							<Picker.Item label="5 Portions" value="5" />
							<Picker.Item label="6 Portions" value="6" />
							<Picker.Item label="7 Portions" value="7" />
							<Picker.Item label="8 Portions" value="8" />
						</Picker>
						<TextInput
							style={styles.input}
							placeholder="Name"
							value={userName}
							onChangeText={(text) => setUserName(text)}
						/>
						<TextInput
							style={styles.input}
							placeholder="Location"
							value={userLocation}
							onChangeText={(text) => setUserLocation(text)}
						/>
						<TextInput
							style={styles.input}
							placeholder="Phone Number"
							value={userPhoneNumber}
							onChangeText={(numeric) => setUserPhoneNumber(Text)}
						/>
						<TouchableOpacity
							style={styles.confirmButton}
							onPress={handleOrderConfirm}
						>
							<Text style={styles.confirmButtonText}>Confirm Order</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.cancelButton}
							onPress={() => setModalVisible(false)}
						>
							<Text style={styles.cancelButtonText}>Cancel</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			<Modal
				animationType="slide"
				transparent={true}
				visible={kiloModalVisible}
				onRequestClose={() => setKiloModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Order in Kilos</Text>
						<TextInput
							style={styles.input}
							placeholder="Enter kilos"
							keyboardType="numeric"
							value={kilo}
							onChangeText={(text) => setKilo(text)}
						/>
						<TouchableOpacity
							style={styles.confirmButton}
							onPress={handleKiloOrderConfirm}
						>
							<Text style={styles.confirmButtonText}>Confirm Kilo Order</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.cancelButton}
							onPress={() => setKiloModalVisible(false)}
						>
							<Text style={styles.cancelButtonText}>Cancel</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	);
};

const styles = {
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	navbar: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 10,
		backgroundColor: "#fff",
	},
	navButton: {
		backgroundColor: "#007bff",
		padding: 10,
		borderRadius: 5,
	},
	navButtonText: {
		color: "#fff",
		fontWeight: "bold",
	},
	postContainer: {
		backgroundColor: "#fff",
		margin: 10,
		padding: 10,
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 2,
	},
	profileImage: {
		width: 50,
		height: 50,
		borderRadius: 25,
	},
	sellerName: {
		fontWeight: "bold",
		fontSize: 16,
	},
	postImage: {
		width: "100%",
		height: 200,
		marginVertical: 10,
	},
	postVideo: {
		width: "100%",
		height: 200,
		marginVertical: 10,
	},
	orderButton: {
		backgroundColor: "#28a745",
		padding: 10,
		color: "#fff",
		textAlign: "center",
		borderRadius: 5,
		marginTop: 10,
	},
	deleteButton: {
		backgroundColor: "#dc3545",
		padding: 10,
		borderRadius: 5,
		marginTop: 10,
	},
	deleteButtonText: {
		color: "#fff",
		textAlign: "center",
	},
	zoomButton: {
		backgroundColor: "#17a2b8",
		padding: 10,
		borderRadius: 5,
		marginTop: 10,
	},
	zoomButtonText: {
		color: "#fff",
		textAlign: "center",
	},
	price: {
		fontSize: 16,
		fontWeight: "bold",
	},
	description: {
		fontSize: 14,
		marginVertical: 10,
	},
	listContainer: {
		paddingBottom: 100,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalContent: {
		width: "80%",
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 20,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
	},
	input: {
		height: 40,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		marginVertical: 10,
	},
	picker: {
		height: 50,
		width: "100%",
		marginVertical: 10,
	},
	confirmButton: {
		backgroundColor: "#007bff",
		padding: 10,
		borderRadius: 5,
	},
	confirmButtonText: {
		color: "#fff",
		textAlign: "center",
	},
	cancelButton: {
		backgroundColor: "#dc3545",
		padding: 10,
		borderRadius: 5,
		marginTop: 10,
	},
	cancelButtonText: {
		color: "#fff",
		textAlign: "center",
	},
};

export default HomeScreen;








