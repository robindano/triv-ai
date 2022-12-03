import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  answerContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 32,
  },
  answerList: {
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 40,
    overflow: 'visible',
    fontSize: 26,
    width: '100%',
    height: 38,
    textTransform: 'capitalize',
    letterSpacing: 1.5,
  },
  answerListView: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderColor: '#232323',
    backgroundColor: '#23232341',
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingVertical: 16,
    overflow: 'visible',
    marginBottom: 10,
    width: '60%',
    shadowColor: '#ffffffac',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    shadowOpacity: 0.3,
  },
});
