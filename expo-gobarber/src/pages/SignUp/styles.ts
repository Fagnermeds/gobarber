import styled, { css } from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
`;

export const Image = styled.Image``;

export const Title = styled.View`
  margin: 64px 0 32px;
`;

export const TitleText = styled.Text`
  font-size: 24px;
  color: #f4ede8;
  font-family: 'RobotoSlab_500Medium';
`;

export const BackToSignIn = styled.TouchableOpacity`
  margin-top: 24px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const BackToSignInText = styled.Text`
  color: #f4ede8;
  margin-left: 8px;
  font-size: 16px;
  font-family: 'RobotoSlab_400Regular';
`;
