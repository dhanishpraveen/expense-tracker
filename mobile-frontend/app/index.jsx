import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css"
import { ActivityIndicator, Alert, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function App() {
  const [summary, setSummary] = useState({})
  const [transactionsData, setTransactionsData] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const category = [
    { id: 1, title: "Food & Drinks", name: "fast-food" },
    { id: 2, title: "Shopping", name: "cart-sharp" },
    { id: 3, title: "Transportation", name: "car-sharp" },
    { id: 4, title: "Entertainment", name: "film" },
    { id: 5, title: "Bills", name: "receipt" },
    { id: 6, title: "Income", name: "cash" },
    { id: 7, title: "Other", name: "ellipsis-horizontal" }
  ]
  useEffect(() => {
    fetchData()
  }, [])

  async function fetchSummary() {
    try {
      const response = await fetch("https://expense-tracker-api-hntn.onrender.com/api/transactions/summary/12")
      const data = await response.json()
      setSummary(data)
    } catch (error) {
      console.error("Error fetching summary", error)
    }
  }

  async function fetchTransactions() {
    try {
      const response = await fetch("https://expense-tracker-api-hntn.onrender.com/api/transactions/12")
      const data = await response.json()
      setTransactionsData(data.data)
    } catch (error) {
      console.error("Error fetching transactions", error)
    }
  }

  async function fetchData() {
    try {
      await Promise.all([fetchSummary(), fetchTransactions()])
    } catch (error) {
      console.log("Error loading data", error)
    }
  }

  function handleDeleteTransaction(id) {
    Alert.alert(
      'Confirm Delete',
      'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTransaction(id) },
      ]
    );
  }

  async function deleteTransaction(id) {
    try {
      const response = await fetch(`https://expense-tracker-api-hntn.onrender.com/api/transactions/${id}`, { method: "DELETE" })
      if (await !response.ok) {
        const result = await response.json()
        Alert.alert("Error", result.message)
        return
      }
      fetchData()
      Alert.alert("Success", "Transaction deleted successfully")
    } catch (error) {
      console.log("Error deleting transaction", error)
    }

  }


  const TransactionCard = ({ item }) => (
    <View className="flex flex-row p-5 rounded-lg bg-white m-1">
      <View className="flex items-center flex-row flex-1">
        <Ionicons name={`${category.find(category => category.title === item.category)?.name}`} size={24} color={`${item.amount > 0 ? "#1bb002" : "#ca2d00"}`} className="bg-gray-300 p-3 rounded-full" />
        <View className="pl-5">
          <Text className="text-2xl font-semibold">{item.title}</Text>
          <Text className="text-2xl text-gray-500">{item.category}</Text>
        </View>
      </View>
      <View className="flex flex-row flex-1 justify-end items-center">
        <View className="flex items-end pr-5 border-r border-r-gray-400">
          <Text className={`text-2xl font-bold ${item.amount > 0 ? "text-[#1bb002]" : "text-[#ca2d00]"}`}>&#8377;{item.amount}</Text>
          <Text className="text-2xl text-gray-500">{new Date(item.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          </Text>
        </View>
        <MaterialIcons name="delete-forever" size={32} color="#ca2d00" onPress={() => handleDeleteTransaction(item.id)} className="ml-5" />
      </View>
    </View>
  )
  async function OnRefresh() {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
  }

  return (
    <SafeAreaView className="h-screen">
      <View className="flex-1 bg-zinc-100 px-10 pt-12">
        <View className="flex flex-row justify-between items-center mb-8">
          <Ionicons name="wallet" size={56} color="#7d2e19" />
          <View>
            <Text className="text-2xl text-gray-500">Welcome,</Text>
            <Text className="font-bold text-2xl">Customer name</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/create')} className="flex justify-center items-center bg-amber-800 rounded-[30px] mr-[-20px]">
            <Text className="text-white text-2xl font-bold px-8 py-4">+ Add</Text>
          </TouchableOpacity>
          <TouchableOpacity >
            <Ionicons name="exit-outline" size={32} color="black" />
          </TouchableOpacity>
        </View>
        <View className="mb-8 p-6 rounded-2xl bg-white">
          <View className="ml-5">
            <Text className="text-2xl text-gray-500">Total Balance</Text>
            <Text className="font-bold text-4xl mt-2 mb-1">&#8377;{summary.data?.balance}</Text>
          </View>
          <View className="flex flex-row mt-5">
            <View className="flex items-center flex-1">
              <Text className="text-lg text-gray-500">Income</Text>
              <Text className="font-bold text-3xl text-[#1bb002]">&#8377;{summary.data?.income}</Text>
            </View>
            <View className="flex items-center border-l border-l-gray-400 flex-1">
              <Text className="text-lg text-gray-500">Expenses</Text>
              <Text className="font-bold text-3xl text-[#ca2d00]">&#8377;{summary.data?.expenses}</Text>
            </View>
          </View>
        </View>
        <View className="flex-1">
          <Text className="text-2xl font-semibold mb-10">Recent Transactions</Text>
          {transactionsData.length > 0 ? <FlatList data={transactionsData} renderItem={({ item }) => <TransactionCard item={item} />} refreshing={refreshing} onRefresh={OnRefresh} /> :
            <ActivityIndicator size="large" />}
        </View>
      </View >
    </SafeAreaView>
  );
}