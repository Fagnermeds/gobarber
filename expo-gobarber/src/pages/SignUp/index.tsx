import React, { useState, useRef, useCallback } from 'react';
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TextInput,
  Alert,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import Input from '../../components/Input';
import Button from '../../components/Button';
import {
  Container,
  Image,
  Title,
  TitleText,
  BackToSignIn,
  BackToSignInText,
} from './styles';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import Loading from '../../components/Loading';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FunctionComponent = () => {
  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        setLoading(true);

        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'Mínimo de 6 dígitos'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        Alert.alert(
          'Cadastro realizado com sucesso!',
          'Você já pode fazer o login na aplicação.'
        );

        navigation.goBack();
      } catch (error) {
        setLoading(false);

        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);
        }

        Alert.alert(
          'Erro no cadastro',
          'Verifique seus dados e tente novamente.',
        );

      }
    },
    [navigation],
  );

  return (
    <>
    {loading ? <Loading /> : (
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
          <Container>
            <Image
              source={require('../../assets/logo.png')}
            />
            <Title>
              <TitleText>Crie sua conta</TitleText>
            </Title>
            <Form ref={formRef} onSubmit={handleSignUp}>
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
                  passwordInputRef.current?.focus();
                }}
                />
              <Input
                ref={passwordInputRef}
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
                name="password"
                icon="lock"
                placeholder="Senha"
                />
            </Form>

            <Button
              onPress={() => formRef.current?.submitForm()}
            >
              Entrar
            </Button>
              <BackToSignIn onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={16} color="#f4ede8" />
                <BackToSignInText>
                  Voltar para logon
                </BackToSignInText>
              </BackToSignIn>
          </Container>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    )}
    </>
  );
}

export default SignUp;

