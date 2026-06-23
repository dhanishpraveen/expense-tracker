import { View, Text, Image, TouchableOpacity, Touchable, TextInput, FlatList, Pressable, ActivityIndicator, Alert } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import '../global.css'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from "expo-router";

const addTransaction = () => {
    const [selectedCategory, setSelectedCategory] = useState(0)
    const [amount, setAmount] = useState(0)
    const [title, setTitle] = useState('')
    const [isExpense, setIsExpense] = useState(true)
    const [isIncome, setIsIncome] = useState(false)
    const [loading, setLoading] = useState(false)
    const category = [
        { id: 1, title: "Food & Drinks", name: "fast-food" },
        { id: 2, title: "Shopping", name: "cart-sharp" },
        { id: 3, title: "Transportation", name: "car-sharp" },
        { id: 4, title: "Entertainment", name: "film" },
        { id: 5, title: "Bills", name: "receipt" },
        { id: 6, title: "Income", name: "cash" },
        { id: 7, title: "Other", name: "ellipsis-horizontal" }
    ]

    function handleCategory(id) {
        setSelectedCategory((prev) => prev === id ? 0 : id)
    }

    async function handleCreateTransaction() {
        setLoading(true)
        try {
            const data = {
                userId: 12,
                amount: isExpense ? `-${amount}` : amount,
                title,
                category: category[selectedCategory - 1]?.title
            }
            const response = await fetch('https://expense-tracker-api-hntn.onrender.com/api/transactions', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            if (await !response.ok) {
                const result = await response.json()
                Alert.alert("Error", result.message + " to create transaction.")
                return
            }
            Alert.alert("Success", "Transaction created successfully")
            router.back()
        } catch (error) {
            console.log("Error creating transaction", error)
        } finally {
            setLoading(false)
        }
    }

    function handleExpenseOrIncome() {
        setIsExpense((prev) => !prev)
        setIsIncome((prev) => !prev)
    }

    const CategoryCard = ({ item }) => (
        <View>
            <Text>{item.title}</Text>
        </View>
    )
    return (
        <SafeAreaView className="flex-1 bg-zinc-100  pt-12" >
            {loading ?
                <ActivityIndicator size="large" /> :
                <View>
                    <View className="flex flex-row items-center px-10 pb-8 justify-between border-b border-b-gray-400">
                        <Ionicons name="arrow-back" size={24} color="black" onPress={router.back} />
                        <Text className="text-2xl font-bold">New Transaction</Text>
                        <TouchableOpacity className="flex flex-row items-center gap-2" onPress={handleCreateTransaction}>
                            <Text className="text-2xl text-gray-500">Save</Text>
                            <Ionicons name="checkmark" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View className="m-5 p-5 bg-white rounded-xl  ">
                        <View className="flex flex-row justify-center gap-5">
                            <TouchableOpacity className={`flex flex-row items-center justify-center gap-4 rounded-full flex-1 px-10 py-5 ${isExpense ? "bg-amber-800 " : "bg-white border border-gray-400 "}`} onPress={handleExpenseOrIncome} >
                                <Ionicons name="arrow-down-circle" size={24} color={`${isIncome ? "black" : "white"}`} />
                                <Text className={`text-2xl text-center ${isExpense ? "text-white" : "text-black"}`}>Expense</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className={`flex flex-row items-center justify-center gap-4 rounded-full flex-1 px-10 py-5 ${isIncome ? "bg-green-700 border-none" : "border border-gray-400 "}`} onPress={handleExpenseOrIncome}>
                                <Ionicons name="arrow-up-circle" size={24} color={`${isIncome ? "white" : "green"}`} />
                                <Text className={`text-2xl text-center ${isIncome && "text-white"}`}>Income</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex flex-row px-5 pt-8 border-b border-b-gray-400">
                            <Text className="text-6xl pt-1 font-bold">&#8377;</Text>
                            <TextInput className="text-6xl font-bold" onChange={(e) => setAmount(e.nativeEvent.text)} keyboardType='numeric' placeholderTextColor={"gray"} placeholder='0.00' />
                        </View>
                        <View className="flex flex-row gap-8 items-center p-5 border my-5 border-gray-400 rounded-lg">
                            <SimpleLineIcons name="note" size={24} color="gray" />
                            <TextInput className="text-2xl font-bold" onChange={(e) => setTitle(e.nativeEvent.text)} placeholderTextColor={"gray"} placeholder='Transaction Title' />
                        </View>
                        <View className="my-3 ">
                            <View className="flex flex-row items-center gap-2">
                                <Ionicons name="pricetag-outline" size={24} color="gray" />
                                <Text className="text-2xl font-bold">Category</Text>
                            </View>
                            <View className="flex flex-row mt-4 gap-2 flex-wrap">
                                {category.map((item) => {
                                    return (
                                        <Pressable key={item.id} className={`flex flex-row items-center gap-2 ${selectedCategory === item.id && "bg-amber-800"} 
                                                                border border-gray-400 px-5 py-3 m-1 rounded-full
                                                                `}
                                            onPress={() => handleCategory(item.id)} >
                                            <Ionicons name={`${item.name}`} size={24} color="black" />
                                            <Text className={`text-xl ${selectedCategory === item.id && "text-white"}`}>{item.title}</Text>
                                        </Pressable>
                                    )
                                })}
                            </View>
                        </View>
                    </View>
                </View>
            }
        </SafeAreaView>
    )
}

export default addTransaction