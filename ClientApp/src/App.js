import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import Layout  from './components/Shared/Layout';
import './custom.css';
import {useAuth} from "./components/Authentication/Auth";

function App(){


    return (
      <Layout>
        <Routes>
          {AppRoutes.map((route, index) => {
            const { element, ...rest } = route;
            return <Route exact key={index} {...rest} element={element} />;
          })}
        </Routes>
      </Layout>
    );
  }
export default App;