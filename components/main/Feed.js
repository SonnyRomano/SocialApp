import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList } from 'react-native'
import { Button } from 'react-native-paper';

import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'

function Feed(props) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
            props.feed.sort(function (x, y) {
                return x.creation - y.creation;
            })
            setPosts(props.feed);
        }

    }, [props.usersFollowingLoaded, props.feed])

    const onLikePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({})
    }

    const onDislikePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete()
    }

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.containerList}
                numColumns={1}
                horizontal={false}
                data={posts}
                renderItem={({ item }) => (
                    <View
                        style={styles.containerImage}>
                        <Text style={styles.textUser}>{item.user.name}</Text>
                        <Image
                            style={styles.image}
                            source={{ uri: item.downloadURL }}
                        />
                        {item.currentUserLike ?
                            (
                                <Button
                                    style={{ backgroundColor: 'red' }}
                                    title="Dislike"
                                    onPress={() => onDislikePress(item.user.uid, item.id)} >
                                    <Text style={styles.textUser}>Dislike</Text>
                                </Button>
                            )
                            :
                            (
                                <Button
                                    style={{ backgroundColor: 'green' }}
                                    title="Like"
                                    onPress={() => onLikePress(item.user.uid, item.id)} >
                                    <Text style={styles.textUser}>Like</Text>
                                </Button>
                            )
                        }
                        <Text
                            style={styles.textComment}
                            onPress={() =>
                                props.navigation.navigate('Comment',
                                    { postId: item.id, uid: item.user.uid })}>
                            View Comments...</Text>
                    </View>

                )}

            />
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerList: {
        margin: 5,
    },
    containerImage: {
        flex: 1,
        marginBottom: 15,
        borderRadius: 5,
        backgroundColor: '#CDDC39',

    },
    textUser: {
        fontSize: 17,
        textAlign: 'center',
        margin: 3,
        color: 'black'
    },
    textComment: {
        color: 'black',
        fontSize: 15,
        margin: 3,
        paddingLeft: 6
    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1
    }
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded
})
export default connect(mapStateToProps, null)(Feed);