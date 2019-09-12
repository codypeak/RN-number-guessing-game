import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import NumberContainer from '../components/NumberContainer'
import Card from '../components/Card'
import DefaultStyles from '../constants/default-styles'

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

const GameScreen = props => {
    const [currentGuess, setCurrentGuess] = useState(  //only calls generate on initialization. wont overwrite a number.
        generateRandomBetween(1, 100, props.userChoice)  //userChoice excluded to prevent someone guessing number on first try (for whatever reason)
    );
    const [rounds, setRounds] = useState(0);
    const currentLow = useRef(1);
    const currentHigh = useRef(100);

    const { userChoice, onGameOver } = props;
    //useEffect allows you to run side effects or logic after every render cycle. 
    //so every render this function is executed afterwards: 
    useEffect(() => {
        if (currentGuess === userChoice) {
            onGameOver(rounds);
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
                currentLow.current = currentGuess;
            }
            //computer makes new guess with new min and max range, excluding what it just guessed. 
            const nextNumber = generateRandomBetween(currentLow.current, currentHigh.current, currentGuess);
            setCurrentGuess(nextNumber);
            setRounds(curRounds => curRounds + 1);

        
    };  

    return (
        <View style={styles.screen}>
            <Text style={DefaultStyles.title}>Opponent's Guess</Text>
            <NumberContainer>{currentGuess}</NumberContainer> 
            <Card style={styles.buttonContainer}>
                <Button title="LOWER" onPress={nextGuessHandler.bind(this, 'lower')} /> 
                <Button title="GREATER" onPress={nextGuessHandler.bind(this, 'greater')} />
            </Card>
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
        width: 300,
        maxWidth: '80%'
    }
});

export default GameScreen;