import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';

import Card from '../components/Card'
import Input from '../components/Input'
import Colors from '../constants/colors'
import NumberContainer from '../components/NumberContainer'
import BodyText from '../components/BodyText'  //can replace regular Text with special font.
import TitleText from '../components/TitleText';

const StartGameScreen = props => {
    const [enteredValue, setEnteredValue] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [selectedNumber, setSelectedNumber] = useState(); 

    //adding state and this method to validate that only two digit numbers are entered(bc android keyboardType cant do this).
    const numberInputHandler = inputText => {
        setEnteredValue(inputText.replace(/[^0-9]/g, ''));
    }; //inputText is string so can call replace, using a regular expression so any non 0-9 entry globally is replaced by empty string.

    const resetInputHandler = () => {
        setEnteredValue('');
        setConfirmed(false);
    };

    const confirmInputHandler = () => {
        const chosenNumber = parseInt(enteredValue); //convert text to number.
        if (isNaN(chosenNumber) || chosenNumber <= 0 || chosenNumber > 99) {
            Alert.alert(
                'Invalid number!', 
                'Number has to be a number between 1 and 99.', 
                [{ text: 'Okay', style: 'destructive', onPress: resetInputHandler }]
            );
            return; //return completes the function if input is invalid.
        }
        setConfirmed(true);
        setSelectedNumber(chosenNumber); 
        setEnteredValue('');  //will reset on next re-render. all three set state calls are batched together next cycle at same time so order doesnt really matter. 
        Keyboard.dismiss();
    };

    let confirmedOutput; //normally undefined until confirmed. 
    if (confirmed) {
        confirmedOutput = (
            <Card style={styles.summaryContainer}>
                <BodyText>You selected</BodyText>
                <NumberContainer>{selectedNumber}</NumberContainer>
                <Button title='START GAME' onPress={() => props.onStartGame(selectedNumber)} />
            </Card>
        );
    }

    return (
        <TouchableWithoutFeedback //use touchable so can listen to onPress outside of keyboard to dismiss it.
            onPress={() => {
                Keyboard.dismiss();
        }}>
        <View style={styles.screen}>
            <TitleText style={styles.title}>Start a new game!</TitleText>
            <Card style={styles.inputContainer}>
                <BodyText>Select a number</BodyText>
                <Input 
                    style={styles.input} 
                    blurOnSubmit 
                    autoCapitalize='none' 
                    autoCorrect={false}
                    keyboardType='number-pad' 
                    maxLength={2} 
                    onChangeText={numberInputHandler}
                    value={enteredValue}
                />
                <View style={styles.buttonContainer}>
                    <View style={styles.button}>
                        <Button title='Reset' onPress={resetInputHandler} color={Colors.accent} />
                    </View>
                    <View style={styles.button}>
                        <Button title='Confirm' onPress={confirmInputHandler} color={Colors.primary} />
                    </View>
                </View>
            </Card>
            {confirmedOutput}
        </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        marginVertical: 10,
        fontFamily: 'open-sans-bold',
    },
    inputContainer: {   
        width: 300,
        maxWidth: '80%', //hardcoded width so add some responsiveness with max in case screen is too small it will take up 80%.
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row', //default is column, so use row to get buttons next to each other.
        width: '100%',  //so container takes up all width of parent and can then style buttons separate from this.
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    button: {
        width: 100,
    },
    input: {
        width: 50,
        textAlign: 'center',
    },
    summaryContainer: {
        marginTop: 20,
        alignItems: 'center'
    }
});

export default StartGameScreen;