import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Platform, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

import { useAuth } from '../../hooks/Auth';
import api from '../../services/api';
import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  Content,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
 } from './styles';

interface RouteParams {
  provider_id: string;
}

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

export interface AvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FunctionComponent = () => {
  const { user } = useAuth();
  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const [imageDefault, setImageDefault] = useState('');
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(0);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.provider_id
  );

  const navigation = useNavigation();

  useEffect(() => {
    setImageDefault('data:image/jpeg;base64,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');

    api.get('/providers')
      .then(response => {
        setProviders(response.data);
      });
  }, []);

  useEffect(() => {
    api.get(`providers/${selectedProvider}/day-availability`, {
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate(),
      }
    })
    .then(response => {
      setAvailability(response.data);
    });
  }, [selectedDate, selectedProvider]);

  const navigateBackList = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSelectProvider = useCallback((provider_id: string) => {
    setSelectedProvider(provider_id);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker((state) => !state);
  }, []);

  const handleDateChanged = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
    }
  }, []);

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);

      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post('/appointments', {
        provider_id: selectedProvider,
        date,
      });

      navigation.navigate('AppointmentCreated', { date: date.getTime() })
    } catch (error) {
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu um erro ao tentar criar um agendamento. Tente novamente!',
      );
    }
  }, [selectedDate, selectedHour, selectedProvider]);

  const morningAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        }
      })
  }, [availability]);

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        }
      })
  }, [availability]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBackList}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: "http://192.168.1.3:3333/files/5f2433e3d16f7dd1c1d0-profile.jpeg" }}/>

      </Header>

      <Content>
        <ProvidersListContainer>
          <ProvidersList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={provider => provider.id}
            renderItem={({ item }) => (
              <ProviderContainer
                onPress={() => handleSelectProvider(item.id)}
                selected={item.id === selectedProvider}
              >
                <ProviderAvatar source={{ uri: item.avatar_url ? item.avatar_url : imageDefault}} />

                <ProviderName
                  selected={item.id === selectedProvider}
                >
                  {item.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <Calendar>
          <Title>Escolha a data</Title>

          <OpenDatePickerButton onPress={handleToggleDatePicker}>
            <OpenDatePickerButtonText>Selecionar outra data</OpenDatePickerButtonText>
          </OpenDatePickerButton>

          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="calendar"
              textColor="#f4ede8"
              value={selectedDate}
              onChange={handleDateChanged}
            />
          )}
        </Calendar>

        <Schedule>
          <Title>Escolha o horário</Title>

          <Section>
            <SectionTitle>Manhã</SectionTitle>

            <SectionContent>
              {morningAvailability.map(({ hour, hourFormatted, available }) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour}
                  available={available}
                  key={hourFormatted}
                  onPress={() => handleSelectHour(hour)}
                >
                  <HourText
                    selected={selectedHour === hour}
                  >
                    {hourFormatted}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>

            <SectionContent>
              {afternoonAvailability.map(({ hour, hourFormatted, available }) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour}
                  available={available}
                  key={hourFormatted}
                  onPress={() => handleSelectHour(hour)}
                >
                  <HourText
                    selected={selectedHour === hour}
                  >
                    {hourFormatted}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
}

export default CreateAppointment;
