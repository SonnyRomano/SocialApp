import React from 'react'
import { Button, Text, View } from 'react-native'

export default function Landing({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', margin: 10 }}>
            <Button
                title="Register"
                onPress={() => navigation.navigate("Register")} />
            <Text style={{ margin: 3 }} />
            <Button
                title="Login"
                onPress={() => navigation.navigate("Login")} />
        </View >
    )
}
