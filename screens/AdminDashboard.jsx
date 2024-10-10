import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const AdminDashboard = () => {
	const [cattlePosts, setCattlePosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch cattle posts
				const cattleSnapshot = await getDocs(collection(db, "cattle"));
				const posts = cattleSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
					orders: [], // Initialize orders array
				}));

				// Fetch orders
				const ordersSnapshot = await getDocs(collection(db, "orders"));
				const orders = ordersSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));

				// Organize orders by postId
				const ordersByPost = orders.reduce((acc, order) => {
					if (!acc[order.postId]) {
						acc[order.postId] = [];
					}
					acc[order.postId].push(order);
					return acc;
				}, {});

				// Add orders to posts
				const postsWithOrders = posts.map((post) => {
					let postOrders = ordersByPost[post.id] || [];

					// Sort orders by location name
					postOrders = postOrders.sort((a, b) => {
						const locationA = a.location?.toUpperCase() || ""; // handle undefined locations
						const locationB = b.location?.toUpperCase() || "";
						if (locationA < locationB) return -1;
						if (locationA > locationB) return 1;
						return 0;
					});

					const portionCount = postOrders.reduce(
						(sum, order) => sum + parseInt(order.portion || 0),
						0
					);

					return {
						...post,
						orders: postOrders,
						portionCount, // Add portion count to post
					};
				});

				setCattlePosts(postsWithOrders);
				setLoading(false);
			} catch (err) {
				console.error("Error fetching data:", err);
				setError(err);
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return (
			<View style={styles.container}>
				<Text>Loading...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.container}>
				<Text>Error loading data: {error.message}</Text>
			</View>
		);
	}

	if (cattlePosts.length === 0) {
		return (
			<View style={styles.container}>
				<Text>No posts available</Text>
			</View>
		);
	}

	const renderOrder = ({ item }) => (
		<View style={styles.orderContainer}>
			<Text style={styles.orderDetails}>Name: {item.name || "Unknown"}</Text>
			<Text style={styles.orderDetails}>
				Location: {item.location || "Unknown"}
			</Text>
			<Text style={styles.orderDetails}>
				Phone Number: {item.phoneNumber || "Unknown"}
			</Text>
			<Text style={styles.orderDetails}>Portions: {item.portion || 0}</Text>
		</View>
	);

	const renderPost = ({ item }) => (
		<View style={styles.postContainer}>
			<Text style={styles.description}>{item.description}</Text>
			<Text style={styles.portionCount}>
				Portion Count: {item.portionCount}/8
			</Text>
			<Text style={styles.status}>
				Status: {item.portionCount >= 8 ? "Completed" : "Open"}
			</Text>
			{item.orders.length > 0 && (
				<View style={styles.ordersContainer}>
					<Text style={styles.ordersHeader}>Orders:</Text>
					<FlatList
						data={item.orders}
						keyExtractor={(order) => order.id}
						renderItem={renderOrder}
					/>
				</View>
			)}
		</View>
	);

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Admin Dashboard</Text>
			<FlatList
				data={cattlePosts}
				keyExtractor={(post) => post.id}
				renderItem={renderPost}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#f5f5f5",
	},
	header: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 16,
	},
	postContainer: {
		backgroundColor: "#ffffff",
		padding: 16,
		marginBottom: 8,
		borderRadius: 8,
		elevation: 2,
	},
	description: {
		fontSize: 16,
		marginBottom: 8,
	},
	portionCount: {
		fontSize: 14,
		color: "#555555",
	},
	status: {
		fontSize: 14,
		color: "#ff0000",
	},
	ordersContainer: {
		marginTop: 8,
	},
	ordersHeader: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 8,
	},
	orderContainer: {
		backgroundColor: "#f9f9f9",
		padding: 8,
		marginBottom: 4,
		borderRadius: 4,
	},
	orderDetails: {
		fontSize: 14,
	},
});

export default AdminDashboard;
