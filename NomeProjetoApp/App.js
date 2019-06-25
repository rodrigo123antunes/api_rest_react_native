import React from 'react';
import { StackNavigator } from "react-navigation";

import taskAdd from './src/View/Task/Add';
import taskIndex from './src/View/Task/Index';
import taskEdit from './src/View/Task/Edit';

const App = StackNavigator({
    taskIndex: {screen: taskIndex},
    taskAdd: {screen: taskAdd},
    taskEdit: {screen: taskEdit},
}, {
    headerMode: 'none'
});

export default App;
