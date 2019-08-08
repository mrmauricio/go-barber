import Reactotron from 'reactotron-react-js';

// utilizar o reactotron apenas em ambiente de DEV
if (process.env.NODE_ENV === 'development') {
    const tron = Reactotron.configure().connect();

    tron.clear();

    console.tron = tron;
}
