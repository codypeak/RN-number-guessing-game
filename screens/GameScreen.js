import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, ScrollView, FlatList, Dimensions } from 'react-native';
import NumberContainer from '../components/NumberContainer'
import Card from '../components/Card'
import DefaultStyles from '../constants/default-styles';
import MainButton from '../components/MainButton';
import { Ionicons } from '@expo/vector-icons';
import BodyText from '../components/BodyText';
import { ScreenOrientation } from 'expo';

const generateRandomBetween = (max, min, exclude) => {
    min = Math.ceil(min); //makes integer if non-integer entered.
    max = Math.floor(max);
    const rndNum = Math.floor(Math.random() * (max - min)) + min;  //generate random number within your set range. 
    if (rndNum === exclude) {  //if we get a number that is excluded automatically return another random number. 
        return generateRandomBetween(max, min, exclude);
    } else {
        return rndNum;
    }
};

//for mapping ScrollView
// const renderListItem = (value, numOfRound) => (
//     <View key={value} style={styles.listItem}>
//         <BodyText>#{numOfRound}</BodyText>
//         <BodyText>{value}</BodyText>
//     </View>
// );
//for Flatlist
const renderListItem = (listLength, itemData) => (
    <View style={styles.listItem}>
        <BodyText>#{listLength - itemData.index}</BodyText>
        <BodyText>{itemData.item}</BodyText>
    </View>
);

const GameScreen = props => {
    //ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

    const initialGuess = generateRandomBetween(1, 100, props.userChoice)  //userChoice excluded to prevent someone guessing number on first try (for whatever reason)
    const [currentGuess, setCurrentGuess] = useState(initialGuess);
    const [pastGuesses, setPastGuesses] = useState([initialGuess.toString()]);
    const [availableDeviceWidth, setAvailableDeviceWidth] = useState(Dimensions.get('window').width);
    const [availableDeviceHeight, setAvailableDeviceHeight] = useState(Dimensions.get('window').height);
    const currentLow = useRef(1);
    const currentHigh = useRef(100);

    const { userChoice, onGameOver } = props;

    //useEffect allows you to run side effects or logic after every render cycle. 
    //so every render this function is executed afterwards: 
    useEffect(() => {
        const updateLayout = () => {
            setAvailableDeviceWidth(Dimensions.get('window'.width));
            setAvailableDeviceHeight(Dimensions.get('height').height);
        };
        Dimensions.addEventListener('change', updateLayout);
        return () => {
            Dimensions.removeEventListener('change', updateLayout);
        }
    });

    useEffect(() => {
        if (currentGuess === userChoice) {
            onGameOver(pastGuesses.length);
        } //first arg is the func to be executed after render. 2nd is array of dependencies, specifying any value coming from outside of this effect func.
    }, [currentGuess, userChoice, onGameOver]);
    //really need to destructure these b/c if pass in props to dependency array they will change whenever the parent changes.
    //b/c only want to rerun useEffect when guess or choice changes.

    const nextGuessHandler = direction => {
        //verifies you are giving the computer the right hints.
        if ((direction === 'lower' && currentGuess < props.userChoice) ||
            (direction === 'greater' && currentGuess > props.userChoice)) {
                Alert.alert('Don\'t lie!', 'You  know that this is wrong...', [
                    { text: 'Sorry!', style: 'cancel' }
                ]);  //third arg is array of object for button
                return;  //stop the function if incorrect hint given.
            };
    //useRef survives re-renders so will remember previous guesses to update min and max range. 
            if (direction === 'lower') {  //ref allows to save new number without re-render.
                currentHigh.current = currentGuess; //if you tell the computer to guess lower, then the currentGuess becomes the new max tightening the range.
            } else {
                currentLow.current = currentGuess + 1;
            }
            //computer makes new guess with new min and max range, excluding what it just guessed. 
            const nextNumber = generateRandomBetween(currentLow.current, currentHigh.current, currentGuess);
            setCurrentGuess(nextNumber);
            //setRounds(curRounds => curRounds + 1);
            setPastGuesses(curPastGuesses => [nextNumber.toString(), ...curPastGuesses]); //adding new guess to beginning makes it appear at top of list of updated state.
    };  

    let listContainerStyle = styles.listContainer;
    if (availableDeviceWidth < 350) {
        listContainerStyle = styles.listContainerBig;
    };

    if (availableDeviceHeight < 500) {
        return (
            <View style={styles.screen}>
                <Text style={DefaultStyles.title}>Opponent's Guess</Text>
                    <View style={styles.controls}>
                        <MainButton onPress={nextGuessHandler.bind(this, 'lower')} >
                            <Ionicons name="md-remove" size={24} color="white" />
                        </MainButton> 
                        <NumberContainer>{currentGuess}</NumberContainer> 
                        <MainButton onPress={nextGuessHandler.bind(this, 'greater')}>
                            <Ionicons name="md-add" size={24} color="white"/>
                        </MainButton>
                    </View>
                <View style={styles.listContainer}>
                <FlatList //takes in data in form of object in order to generate key
                    data={pastGuesses} //takes in 2 items, data and output items to render
                    renderItem={renderListItem.bind(this, pastGuesses.length)} //bind default argument and any other you want to pass in.
                    keyExtractor={item => item}  //if data not in object form, use keyExtractor to make key, but must be string, not number, so use toString().
                    contentContainerStyle={styles.list}
                />
            </View>
        </View> 
        )
    }

    return (
        <View style={styles.screen}>
            <Text style={DefaultStyles.title}>Opponent's Guess</Text>
            <NumberContainer>{currentGuess}</NumberContainer> 
            <Card style={styles.buttonContainer}>
                <MainButton onPress={nextGuessHandler.bind(this, 'lower')} >
                    <Ionicons name="md-remove" size={24} color="white" />
                </MainButton> 
                <MainButton onPress={nextGuessHandler.bind(this, 'greater')}>
                    <Ionicons name="md-add" size={24} color="white"/>
                </MainButton>
            </Card>
            <View style={styles.listContainer}>
                {/*<ScrollView contentContainerStyle={styles.list}>
                    {pastGuesses.map((guess, index) => renderListItem(guess, pastGuesses.length - index))}
                </ScrollView> */}
            <FlatList //takes in data in form of object in order to generate key
                data={pastGuesses} //takes in 2 items, data and output items to render
                renderItem={renderListItem.bind(this, pastGuesses.length)} //bind default argument and any other you want to pass in.
                keyExtractor={item => item}  //if data not in object form, use keyExtractor to make key, but must be string, not number, so use toString().
                contentContainerStyle={styles.list}
            />
            </View>
        </View>  //output number is state. also nextGuessHandler takes in direction so we supply string lower or higher here. 
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        width: 400,
        maxWidth: '90%'
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
        alignItems: 'center'
    },
    listContainer: {
        flex: 1, //needed for android when have a scrollview wrapped in a view.
        width: '60%',
    },
    listContainerBig: {
        flex: 1,
        width: '80%'
    },
    list: {  //contentContainerStyle allows you to style content inside ScrollView or FlatList
        // alignItems: 'center',
        flexGrow: 1,  //be able to to grow to as much space as needed, but not initially. works well for scrollview.
        justifyContent: 'flex-end',
    },
    listItem: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 15,
        marginVertical: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    }
});

export default GameScreen;
