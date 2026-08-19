import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppModeSelectorScreen } from '../../modules/app-mode/screens/AppModeSelectorScreen';
import type { AppModeStackParamList } from './navigation.types';
const Stack = createNativeStackNavigator<AppModeStackParamList>();
export function AppModeNavigator() {
    return (<Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AppModeSelectorHome" component={AppModeSelectorScreen}/>
    </Stack.Navigator>);
}
export default AppModeNavigator;
