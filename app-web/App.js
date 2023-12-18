import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DataProvider } from './src/DataContext'; 
import CadastrarDoacao from './src/pages/CadastrarDoacao/index';
import HomeScreen from './src/pages/Home/index';
import MinhasDoacoes from './src/pages/MinhasDoacoes';
import MinhasReservas from './src/pages/MinhasReservas';
import ReservasDisponiveis from './src/pages/ReservasDisponiveis';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <DataProvider> 
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Cadastrar Doação" component={CadastrarDoacao} />
          <Stack.Screen name="Minhas Doações" component={MinhasDoacoes} />
          <Stack.Screen name="Doações disponíveis" component={ReservasDisponiveis} />
          <Stack.Screen name="Minhas reservas" component={MinhasReservas} />
          </Stack.Navigator>
      </NavigationContainer>
    </DataProvider>
  );
}

export default App;
