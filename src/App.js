import React from 'react';
import './App.css';
import { IntlProvider } from 'react-intl';
import { styled, useTheme } from '@mui/material/styles';
import { AnimatePresence } from 'framer-motion';

// Routes //
import Page404 from './Page404';
import EndComments from './ops_mobiles/end_comments';
import Registation from './ops_mobiles/registation';
import { Route, Routes, useLocation } from 'react-router';

const drawerWidth = 250;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    ...(open && {
      flexGrow: 1,
      whiteSpace: 'pre-wrap',
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: `+${drawerWidth}px`,
    }),
  })
);

function App() {
  const date_login = localStorage.getItem('date_login') ?? undefined;
  const d = new Date();
  const year = d.getFullYear().toString();
  const month = (d.getMonth() + 101).toString().slice(-2);
  const date = (d.getDate() + 100).toString().slice(-2);
  const hours = (d.getHours() + 100).toString().slice(-2);
  const mins = (d.getMinutes() + 100).toString().slice(-2);
  const seconds = (d.getSeconds() + 100).toString().slice(-2);
  const datenow = `${year + month + date + hours + mins + seconds}`;

  const location = useLocation();
  const token = localStorage.getItem('token');
  const checkUserWeb = localStorage.getItem('sucurity');
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  return (
    <IntlProvider>
      <Main open={open}>
        <AnimatePresence exitBeforeEnter>
          <Routes key={location.pathname} location={location}>
            <Route path="/" element={<Page404 />} />
            <Route path="*" element={<Page404 />} />
            <Route path="/Registation" element={<Registation />} />
            <Route path="/EndComments" element={<EndComments />} />
          </Routes>
        </AnimatePresence>
      </Main>
    </IntlProvider>
  );
}

// ngrok config add-authtoken 2ODQXHspvsX1qfxOO6f2RkDnQoW_7G3R1v2aeJmoHKEiGS99X

export default App;
