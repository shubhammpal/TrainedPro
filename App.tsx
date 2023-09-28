import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Navigation from './Navigation'
// import InputSliderV2 from './src/InputSliderV2'

const App = () => {
  return (
    <SafeAreaProvider>
      <Navigation />
      {/* <InputSliderV2 /> */}
    </SafeAreaProvider>
  )
}

export default App