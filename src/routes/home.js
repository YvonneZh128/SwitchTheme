// import React from 'react';
import LoadingComponent from '../components/ComponentLoading';
import Loadable from 'react-loadable';

const HomePage = Loadable({
  loader: () => import('layouts/HomeLayout'),
  loading: LoadingComponent
});

export {
  HomePage
};