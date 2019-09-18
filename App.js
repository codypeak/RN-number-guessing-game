import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import * as Font from 'expo-font';
import { AppLoading } from 'expo'; //prolongs splash screen launch, so a certain task is done, eg fetching fonts.

import Header from './components/Header'
import StartGameScreen from './screens/StartGameScreen'
import GameScreen from './screens/GameScreen'
import GameOverScreen from './screens/GameOverScreen'

const fetchFonts = () => { //outside main app func b/c dont want it re-rendering all the time.
  return Font.loadAsync({ //pass this method an object where you tell it what fonts you want.
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  });
};

export default function App() {
  const [userNumber, setUserNumber] = useState();
  const [guessRounds, setGuessRounds] = useState(0); //initialize with 0 guesses to start.
  const [dataLoaded, setDataLoaded] = useState(false);

  if (!dataLoaded) { //if data hasnt loaded return this component, instead of trying to render the whole app.
    return (
      <AppLoading 
        startAsync={fetchFonts} //takes prop that points at operation (ie a function that returns a promise) we want to start when this component is rendered.
        onFinish={() => setDataLoaded(true)} //when finish loading pass a func that sets data loaded to true, then rest of app will load.
        onError={error => console.log(error)}
        />
    )};

  const configureNewGameHandler = () => {
    setGuessRounds(0);
    setUserNumber(null); //resets all state.
  }; //need to pass reference to this func as prop to GameOverScreen.

  const startGameHandler = (selectedNumber) => {
    setUserNumber(selectedNumber)  //once the selected number is set as state/ the user's number we will be directed to the GameScreen.
  };

  const gameOverHandler = numOfRounds => {
    setGuessRounds(numOfRounds);
  }; //triggered from gameScreen so need to pass in prop that has reference that can be called inside that component. 

  //default content is StartGameScreen
  let content = <StartGameScreen onStartGame={startGameHandler} />  //pass down reference to handler to component. just a ref w/o parens bc just a pointer to function.

  if (userNumber && guessRounds <= 0) {
    content = <GameScreen userChoice={userNumber} onGameOver={gameOverHandler} />  //if number is truish will set content to the GameScreen
  } else if (guessRounds > 0) {
    content = (
      <GameOverScreen 
        userNumber={userNumber} 
        roundsNumber={guessRounds} 
        onRestart={configureNewGameHandler} 
      />
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
        <Header title="Guess a Number" />
        {content} 
    </SafeAreaView> //render whatever is in content here. whichever screen depending if number is null or chosen. 
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,  //good idea to have flex 1 on root app
  }
});

//get selectedNumber from StartGameScreen when start game button pressed. 
//then store the number in state in app component as userNumber.
//then use userNumber to pass it down to the GameScreen. GameScreen only rendered if there is in fact a userNumber.
//then in GameScreen can use userNumber, which receives it from the userChoice prop.
//then can generate a random number where the userChoice is excluded. 