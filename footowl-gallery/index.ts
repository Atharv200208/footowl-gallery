import { registerRootComponent } from 'expo';
import { ErrorBoundary } from "react-error-boundary";

import App from './src/App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
