import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = props => {
    return <View style={{...styles.card, ...props.style}}>{props.children}</View>  
    //children is content that is passed between open and closing tags of custom component. 
}; //pass in object in order to be able to assign styles from outside component or overwrite comp styles. 
//spread in all styles from this component, then spread in styles passed in as props.
//this will merge the styles, but since props is second it will overwrite 

const styles = StyleSheet.create({
    card: {   
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.26,
        elevation: 5,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        //shadow only works on ios, elevation only works on android.
    },
});

export default Card;

//this component is just a template for reusable card styling.