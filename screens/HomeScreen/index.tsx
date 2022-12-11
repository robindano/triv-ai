import React, { useCallback, useEffect, useState } from 'react';
import { TextInput, Platform, TouchableWithoutFeedback } from 'react-native';
import { checkStyles, checkAnswer, disableTextInput, hydrateAnswers } from '../../hooks';
import { Container } from '../../components';
import { Header } from '../../components/Header';
import { GameBoard } from '../../components/GameBoard';
import { Category } from '../../components/Category';
import { ImageCarousel } from '../../components/ImageCarousel';
import { InitialResultObject } from '../../models/InitialResultObject';
import { InitialAnswerState } from '../../models/InitialAnswerState';
import { ResultObject, Answer } from '../../types';
import { Information } from '../Information/index';
import { styles } from './styles';
import * as Result from '../../hooks/temp.json';
import { View, ScrollView, Text, SubText } from '../../components/Theme/Themed';
import Animated, { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import useColorScheme from '../../hooks/useColorScheme';
import Colors from '../../constants/Colors';
import { BaseProfile } from '../../constants/BaseProfile';
import { useNavigation } from '@react-navigation/native';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import Signup from '../../components/Authentication/SignUp';
import AuthModal from '../AuthModal';

export const Home: React.FC = () => {
  const theme = useColorScheme();
  const [authModalState, setAuthModalState] = useState(false);
  const [login, setLogin] = useState(false);
  const [register, setRegister] = useState(false);
  const [settingsModalState, setSettingsModalState] = useState(false);
  const [result, setResult] = useState<ResultObject>(InitialResultObject);
  const [userInput, setUserInput] = useState('');
  const [guesses, setGuesses] = useState(0);
  const [answer, setAnswer] = useState<Answer>(InitialAnswerState);

  const textInputRef = React.createRef<TextInput>();

  useEffect(() => {
    setGuesses(guesses);
    disableTextInput(result, answer, guesses);
    hydrateAnswers(userInput, answer, guesses);
    setAnswer(hydrateAnswers(userInput, answer, guesses));
    textInputRef.current?.focus();
  }, [guesses]);

  useEffect(() => {
    setResult(Result.result);
    setAnswer(InitialAnswerState);
    setSettingsModalState(false);
    setUserInput('');
  }, [result]);

  useEffect(() => {
    setUserInput('');
    if (guesses > 0 && checkAnswer(result, answer[guesses - 1].userInput) === true) {
      setTimeout(() => {
        setSettingsModalState(true);
      }, 2800);
    } else {
      return;
    }
  }, [answer]);

  const config = {
    duration: 500,
    easing: Easing.ease,
  };

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = withTiming(settingsModalState ? 0.1 : 1, config);
    return {
      opacity,
    };
  });

  return (
    <Container>
      <Information
        result={result}
        settingsModalState={settingsModalState}
        setSettingsModalState={setSettingsModalState}
      />
      <AuthModal
        setLogin={setLogin}
        login={login}
        setRegister={setRegister}
        register={register}
        authModalState={authModalState}
        setAuthModalState={setAuthModalState}
      />
      <TouchableWithoutFeedback
        onPress={() => {
          setSettingsModalState(false);
          setAuthModalState(false);
          textInputRef.current?.focus();
        }}
      >
        <Animated.View
          style={[
            styles.containerMobile,
            animatedStyle,
            { backgroundColor: Colors[theme]['background'] },
          ]}
        >
          {Platform.OS === 'web' ? (
            <Header
              settingsModalState={settingsModalState}
              setSettingsModalState={setSettingsModalState}
              authModalState={authModalState}
              setAuthModalState={setAuthModalState}
              login={login}
              setLogin={setLogin}
              register={register}
              setRegister={setRegister}
            />
          ) : (
            <></>
          )}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width: '100%' }}
            contentContainerStyle={checkStyles(styles.homePageMobile, styles.homePageWeb, Platform)}
          >
            <View style={styles.typeContainer}>{Category(result)}</View>
            <TextInput
              editable={disableTextInput(result, answer, guesses)}
              style={styles.input}
              value={userInput.replace(/[`~0-9@#%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')}
              onChangeText={(input) =>
                setUserInput(input.replace(/[`~0-9@#%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''))
              }
              onSubmitEditing={() => {
                if (userInput.length !== 0) {
                  setGuesses(guesses + 1);
                } else {
                  return;
                }
              }}
              clearTextOnFocus={false}
              autoFocus={false}
              ref={textInputRef}
              maxLength={38}
            />
            <View style={styles.triviaContent}>
              <View style={styles.aiHintContainer}>
                <ImageCarousel
                  textInputRef={textInputRef}
                  result={result}
                  guesses={guesses}
                  checkAnswer={checkAnswer}
                />
                <View style={styles.hintInfo}>
                  <Text style={styles.infoText}>
                    <Text style={[styles.infoText, { fontWeight: '700', fontSize: 28 }]}>
                      {(5 - guesses).toString()}
                    </Text>{' '}
                    Guesses Left!
                  </Text>
                  <SubText style={[styles.infoText, { fontSize: 12, paddingTop: 8 }]}>
                    Type anywhere to get started
                  </SubText>
                </View>
              </View>
              <GameBoard
                answer={answer}
                userInput={userInput}
                guesses={guesses}
                result={result}
                textInputRef={textInputRef}
              />
            </View>
          </ScrollView>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Container>
  );
};
