import styled, { css } from 'styled-components/native';
import { Feather as Icon } from '@expo/vector-icons';

export const Container = styled.ScrollView`
  flex: 1;
  padding: 0 30px 24px;
  position: relative;
  margin-top: 24px;
`;

export const BackButton = styled.TouchableOpacity`
  margin-top: 32px;
`;

export const UserAvatarButton = styled.TouchableOpacity`
  margin-top: 24px;
  position: relative;
`;

export const UserAvatar = styled.Image`
  width: 124px;
  height: 124px;
  border-radius: 62px;
  align-self: center;
`;

export const CameraIcon = styled(Icon)`
  position: absolute;
  right: 88px;
  bottom: -12px;
`;

export const Title = styled.View`
  margin: 24px 0;
`;

export const TitleText = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab_500Medium';
`;

