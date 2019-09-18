import React from 'react';
import { View, Text, StyleSheet, Button, Image, Dimensions, ScrollView } from 'react-native';

import BodyText from '../components/BodyText';
import TitleText from '../components/TitleText';
import Colors from '../constants/colors';
import MainButton from '../components/MainButton';

const GameOverScreen = props => {
    return (
        <ScrollView>
        <View style={styles.screen}>
            <TitleText>The game is over!</TitleText>
            <View style={styles.imageContainer}>
                <Image 
                    // source={require('../assets/success.png')} 
                    source={{
                        uri: 'https://cdn.britannica.com/17/83817-050-67C814CD/Mount-Everest.jpg'
                    }}
                    style={styles.image} 
                    resizeMode='cover' 
                    fadeDuration={1000} //300 default
                />
            </View>
            <View style={styles.resultContainer}>
                <BodyText style={styles.resultText}>
                    Your phone needed{' '} <Text style={styles.highlight}>{props.roundsNumber}</Text> rounds to guess to guess the 
                    number{' '} <Text style={styles.highlight}>{props.userNumber}</Text>
                </BodyText> 
            </View>
            <MainButton onPress={props.onRestart} >
                NEW GAME
            </MainButton>
        </View> //rounds managed by state in app.
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    imageContainer: {
        width: Dimensions.get('window').width * 0.7,  //for android image has to be in square container to have shape and overflow work right.
        height: Dimensions.get('window').width * 0.7,
        borderRadius: (Dimensions.get('window').width * 0.7) / 2,
        borderWidth: 3,
        borderColor: 'black',
        overflow: 'hidden', //hides any child that would go beyond the boundaries of container. 
        marginVertical: Dimensions.get('window').height / 30,
    }, //locally stored image RN knows width and height of image and sets it as default. but can overwrite.
        //coming from web RN does not know the W&H. so for network images always have to set W&H. 
    image: {
        width: '100%',
        height: '100%',
    },
    resultContainer: {
        marginHorizontal: 30,
        marginVertical: Dimensions.get('window').height / 60,
    },
    resultText: {
        textAlign: 'center', //obvi centers text, but important for any short lines or text that got wrapped.
        fontSize: Dimensions.get('window').height < 400 ? 16 : 20,
    },
    highlight: {
        color: Colors.primary,
        fontFamily: 'open-sans-bold',
    } //normally component styles arent passed down to nested components, but they are for nested text.
});

export default GameOverScreen;

//view style defaults to flexbox.
//text does not, but it will automatically wrap text.