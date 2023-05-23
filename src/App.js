import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import InputBase from '@mui/material/InputBase';
import { alpha, styled } from '@mui/material/styles';
import liff from '@line/liff';
import axios from 'axios';
import Stack from '@mui/material/Stack';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.mode === 'light' ? '#F3F6F9' : '#1A2027',
    border: '1px solid',
    borderColor: theme.palette.mode === 'light' ? '#E0E3E7' : '#2D3843',
    fontSize: 16,
    width: 'fullWidth',
    padding: '10px 12px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      กรูณาระบุขั้นตอนการปฏิบัติงานของท่าน
    </Typography>
  );
}

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function SignIn() {
  const [idToken, setIdToken] = React.useState();
  const [displayName, setDisplayName] = React.useState();
  const [statusMessage, setStatusMessage] = React.useState();
  const [userId, setUserId] = React.useState();

  const stk_codeURL = window.location.search;
  const [valueComments, setValueComments] = React.useState();

  const [page, setPage] = React.useState(0);
  const [responseURL, setResponseURL] = React.useState();

  const handle_ChangeValue = (event) => {
    event.preventDefault();
    setValueComments(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const headers = {
      Authorization: 'application/json; charset=utf-8',
      Accept: 'application/json',
      'ngrok-skip-browser-warning': '69420',
    };

    const http =
      'https://5f02-61-7-147-129.ngrok-free.app/api/STrack_End_Comments';
    // 'http://localhost:32001/api/STrack_End_Comments';

    const body = {
      stk_code: stk_codeURL ? stk_codeURL.split('?stk_code=')[1] : null,
      End_Commetns: valueComments,
    };

    await axios.post(http, body, { headers }).then((response) => {
      if (response.data[0].res === 'SUCCESS') {
        setResponseURL(
          'สิ้นสุดการดำเนินรายการ ' + stk_codeURL.split('?stk_code=')[1]
        );
        setPage(1);
      } else {
        setResponseURL(response.data[0].res);
        setPage(1);
      }
    });
  };

  const logout = () => {
    liff.logout();
    window.location.reload();
  };

  const handleCloseLiff = () => {
    liff.closeWindow();
    window.close();
  };

  const runApp = () => {
    const idToken = liff.getIDToken();
    setIdToken(idToken);
    liff
      .getProfile()
      .then((profile) => {
        setDisplayName(profile.displayName);
        setStatusMessage(profile.statusMessage);
        setUserId(profile.userId);
      })
      .catch((err) => console.error(err));
  };

  React.useEffect(() => {
    liff.init(
      { liffId: '1657915988-KLn4ZXyE' },
      () => {
        if (liff.isLoggedIn()) {
          runApp();
        } else {
          liff.login();
        }
      },
      (err) => console.error(err)
    );
  }, []);

  if (page === 1) {
    return (
      <React.Fragment>
        <Box
          sx={{
            marginTop: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {responseURL === 'UNSUCCESS, YOUR JOB IS NOT FINISH !!' ? (
            <React.Fragment>
              <Typography variant="body2" color="text.secondary" align="center">
                {responseURL}
              </Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Typography variant="body2" color="text.secondary" align="center">
                ขอบคุณท่านผู้ปฏิบัติงาน
              </Typography>
            </React.Fragment>
          )}
          <Stack direction="row" spacing={3}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              onClick={handleCloseLiff}
              sx={{ mt: 3, mb: 2 }}
            >
              Success
            </Button>
          </Stack>
        </Box>
      </React.Fragment>
    );
  } else {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Copyright sx={{ mt: 4 }} />
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <BootstrapInput
              margin="normal"
              required
              fullWidth
              multiline
              rows={5}
              value={valueComments}
              onChange={handle_ChangeValue}
              name="comments"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }
}
