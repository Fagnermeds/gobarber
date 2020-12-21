import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';

import Input from '../../components/Input';
import Button from '../../components/Button';
import {
  Container,
  BackButton,
  UserAvatarButton,
  UserAvatar,
  CameraIcon,
  Title,
  TitleText,
} from './styles';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import { useAuth } from '../../hooks/Auth';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FunctionComponent = () => {
  const { user, updateUser } = useAuth();

  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const [loadingImage, setLoadingImage] = useState(false);

  const imageDefault = 'data:image/jpeg;base64,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';

  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => setLoadingImage(true), 2500);
  }, []);

  const handleSignUp = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (val) => !!val.length,
            then: Yup.string().required(),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: (val) => !!val.length,
              then: Yup.string().required(),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), undefined], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        Alert.alert(
          'Perfil atualizado com sucesso!',
        );

        navigation.goBack();
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);
        }

        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu um erro ao atualizar cadastro. Tente novamente!',
        );

      }
    },
    [navigation, updateUser],
  );

  const handleUpdateAvatar = useCallback(async () => {
    const permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('É necessária permissão para acessar o rolo da câmera!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();

    setLoadingImage(false);

    if (pickerResult.cancelled === true) {
      return;
    }

    const data = new FormData();

    data.append('avatar', {
      uri: pickerResult.uri,
      type: "image/jpeg",
      name: `${user.id}.jpg`,
    });

    const response = await api.patch('/users/avatar', data);

    updateUser(response.data);

    setLoadingImage(true);
  }, [updateUser, user.id]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      enabled
    >
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
        style={{ flex: 1 }}
      >
        <Container contentContainerStyle={{ justifyContent: 'center' }}>
          <BackButton onPress={handleBack}>
            <Icon name="chevron-left" size={24} color="#999591" />
          </BackButton>

          <UserAvatarButton onPress={handleUpdateAvatar}>
            {loadingImage ?
              (
                <>
                  <UserAvatar source={{ uri: user.avatar_url ? user.avatar_url : imageDefault }} />
                  <CameraIcon name="camera" size={40} color="#ff9000" />
                </>
              ) :
              <ActivityIndicator></ActivityIndicator>
            }
          </UserAvatarButton>

          <Title>
            <TitleText>Meu perfil</TitleText>
          </Title>
          <Form
            initialData={user}
            ref={formRef}
            onSubmit={handleSignUp}
          >
            <Input
              autoCapitalize="words"
              name="name" icon="user"
              placeholder="Nome"
              returnKeyType="next"
              onSubmitEditing={() => {
                emailInputRef.current?.focus();
              }}
              />
            <Input
              ref={emailInputRef}
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              name="email" icon="mail"
              placeholder="E-mail"
              returnKeyType="next"
              onSubmitEditing={() => {
                oldPasswordInputRef.current?.focus();
              }}
            />

            <Input
              ref={oldPasswordInputRef}
              secureTextEntry
              containerStyle={{ marginTop: 16 }}
              textContentType="newPassword"
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordInputRef.current?.focus();
              }}
              name="old_password"
              icon="lock"
              placeholder="Senha atual"
            />


            <Input
              ref={passwordInputRef}
              secureTextEntry
              textContentType="newPassword"
              returnKeyType="next"
              onSubmitEditing={() => {
                confirmPasswordInputRef.current?.focus();
              }}
              name="password"
              icon="lock"
              placeholder="Nova senha"
            />

            <Input
              ref={confirmPasswordInputRef}
              secureTextEntry
              textContentType="newPassword"
              returnKeyType="send"
              onSubmitEditing={() => {
                formRef.current?.submitForm();
              }}
              name="password_confirmation"
              icon="lock"
              placeholder="Confirmar senha"
            />
          </Form>

          <Button
            onPress={() => formRef.current?.submitForm()}
          >
            Confirmar
          </Button>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default Profile;

