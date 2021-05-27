import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Button, TextInput, StyleSheet } from 'react-native'

import firebase from 'firebase'
require('firebase/firestore')

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'

function Comment(props) {
    const [comments, setComments] = useState([]);
    const [postId, setPostId] = useState("");
    const [text, setText] = useState("");

    useEffect(() => {
        function matchUserToComment(comments) {
            for (let i = 0; i < comments.length; i++) {

                if (comments[i].hasOwnProperty('user')) {
                    continue;
                }

                const user = props.users.find(x => x.uid === comments[i].creator);
                if (user == undefined) {
                    props.fetchUsersData(comments[i].creator, false)
                }
                else {
                    comments[i].user = user
                }
            }

            setComments(comments);

        }

        if (props.route.params.postId !== postId) {
            firebase.firestore()
                .collection('posts')
                .doc(props.route.params.uid)
                .collection('userPosts')
                .doc(props.route.params.postId)
                .collection('comments')
                .get()
                .then((snapshot) => {
                    let comments = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data };
                    })
                    matchUserToComment(comments);
                })

            setPostId(props.route.params.postId);
        }
        else {
            matchUserToComment(comments);
        }

    }, [props.route.params.postId, props.users])

    const onCommentSend = () => {
        firebase.firestore()
            .collection('posts')
            .doc(props.route.params.uid)
            .collection('userPosts')
            .doc(props.route.params.postId)
            .collection('comments')
            .add({
                creator: firebase.auth().currentUser.uid,
                text
            })
    }

    return (
        <View style={styles.container}>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({ item }) => (
                    <View style={styles.containerList}>
                        <Text style={styles.textComment}>{item.text}</Text>
                        {item.user !== undefined ?
                            <Text style={styles.textUser}>
                                {item.user.name}
                            </Text>
                            : null}
                    </View>
                )}
            />

            <View>
                <TextInput
                    placeholder="Comment..."
                    onChangeText={(text) => setText(text)}
                />
                <Button
                    onPress={() => onCommentSend()}
                    title="Send"
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 5
    },
    containerList: {
        margin: 5,
        marginBottom: 10
    },
    textComment: {
        fontSize: 17,
        borderRadius: 5,
        backgroundColor: '#CDDC39',
        color: 'black',
        padding: 5,
        textAlign: 'center',
    },
    textUser: {
        fontSize: 12,
        textAlign: 'right'
    }
})

const mapStateToProps = (store) => ({
    users: store.usersState.users
})

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Comment);