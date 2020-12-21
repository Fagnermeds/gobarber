import React, { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';

import api from '../../services/api';
import { useAuth } from '../../hooks/Auth';
import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
  ProvidersList,
  ProvidersListTitle,
  ProviderContainer,
  ProviderAvatar,
  ProviderInfo,
  ProviderName,
  ProviderMeta,
  ProviderMetaText,
} from './styles';

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

const Dashboard: React.FunctionComponent = () => {
  const [providers, setProviders] = useState<Provider[]>([]);

  const imageDefault = 'data:image/jpeg;base64,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';

  const { user, signOut } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    api.get('/providers')
      .then(response => {
        setProviders(response.data);
      });


  }, []);

  const navigateToProfile = useCallback(() => {
    navigation.navigate('Profile');
  }, [navigation.navigate]);

  const navigateToCreateAppointment = useCallback((provider_id: string) => {
    navigation.navigate('CreateAppointment', { provider_id });
  }, [navigation.navigate]);

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem vindo, {"\n"}
          <UserName>{user.name}</UserName>
        </HeaderTitle>

        <TouchableOpacity onPress={signOut}>
          <Text style={{ color: '#fff' }}>Sair</Text>
        </TouchableOpacity>

        <ProfileButton onPress={navigateToProfile}>
          <UserAvatar source={{ uri: user.avatar_url ? user.avatar_url : imageDefault }}/>
        </ProfileButton>
      </Header>

      <ProvidersList
        data={providers}
        keyExtractor={provider => provider.id}
        ListHeaderComponent={
          <ProvidersListTitle>Cabeleireiros</ProvidersListTitle>
        }
        renderItem={({ item }) => (
          <ProviderContainer onPress={() => navigateToCreateAppointment(item.id)}>
            <ProviderAvatar source={{ uri: item.avatar_url ? item.avatar_url : imageDefault}}/>
            <ProviderInfo>
              <ProviderName>{item.name}</ProviderName>

              <ProviderMeta>
                <Icon name="calendar" size={14} color="#ff9000" />
                <ProviderMetaText>Segunda à sexta</ProviderMetaText>
              </ProviderMeta>

              <ProviderMeta>
                <Icon name="clock" size={14} color="#ff9000" />
                <ProviderMetaText>8h às 18h</ProviderMetaText>
              </ProviderMeta>
            </ProviderInfo>
          </ProviderContainer>
        )}
      />

    </Container>
  );
};

export default Dashboard;
