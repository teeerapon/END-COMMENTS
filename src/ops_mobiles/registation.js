import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import liff from '@line/liff';
import Swal from 'sweetalert2';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import config from '../config'

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function SignUp() {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  console.log(options);
  const [optionsII, setOptionsII] = React.useState();
  //const loading = open && options.length === 0;
  const [step, setStep] = React.useState(0);

  const [idToken, setIdToken] = React.useState();
  const [displayName, setDisplayName] = React.useState();
  const [statusMessage, setStatusMessage] = React.useState();
  const [userId, setUserId] = React.useState();
  const [venderCode, setVenderCode] = React.useState();
  const [name, setName] = React.useState();
  const [lastname, setLastname] = React.useState();
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [email, setEmail] = React.useState();

  const [responseURL, setResponseURL] = React.useState();

  const lineConfig = {
    channelAccessToken: `3qb6FW32Bl1O6pPmp9BtHa9MVhl1NiFUAK5KP6n5OwcGR3rWiL7uvQpxbUUe3DmJkpl88kOR7E535cj6J0iRWM5TL48iAxt0xOKtwrTN4t2srHoXQmULtY9lXorVABHRsaAzQmuAeoUy`,
    channelSecret: `f144f871e6cc656ef6af579274310739`,
  };

  // const client = new line.Client(lineConfig);

  const handleCloseLiff = () => {
    liff.closeWindow();
    window.close();
  };

  const submitForm = async (event) => {
    console.log(userId,
      venderCode,
      email,
      name,
      lastname,
      phoneNumber);

    event.preventDefault();

    const headers = {
      Authorization: 'application/json; charset=utf-8',
      Accept: 'application/json',
      'ngrok-skip-browser-warning': '69420',
    };
    const http =
      config.http + '/STrack_Registation';
    // 'http://vpnptec.dyndns.org:32001/api/STrack_Registation';
    //'http://localhost:32001/api/STrack_Registation';

    const body = {
      userid: userId,
      venderCode: venderCode,
      email: email,
      name: name,
      lastname: lastname,
      phoneNumber: phoneNumber,
    };

    if (!userId || !venderCode || !email || !name || !lastname || !phoneNumber) {
      Swal.fire({
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        text: '',
        icon: 'warning',
        confirmButtonText: 'OK',
      })
      setStep(0);
    } else {
      await axios
        // .post(http, { mode: 'no-cors', headers, withCredentials: true }, body)
        .post(http, body, { headers })
        .then((response) => {
          if (response.data[0].res) {
            setResponseURL(response.data[0].res);
            setStep(1);
          }
        });
    }

  };

  React.useEffect(() => {
    let active = true;
    console.log('useE on loading');
    //console.log(!loading);

    // if (!loading) {
    //   return undefined;
    // }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        const headers = {
          Authorization: 'application/json; charset=utf-8',
          Accept: 'application/json',
          'ngrok-skip-browser-warning': '69420',
        };

        const http =
          config.http + '/OPS_Mobile_List_Vender';
        // 'http://vpnptec.dyndns.org:32001/api/OPS_Mobile_List_Vender';
        // 'http://localhost:32001/api/OPS_Mobile_List_Vender';
        console.log('useE');
        try {
          await axios
            .get(http, {
              mode: 'no-cors',
              headers,
              withCredentials: true,
            })
            .then((response) => {
              setOptions(
                response.data.filter(function (el) {
                  return el.VendorID != null;
                })
              );
            });
        } catch (error) {
          console.log(error);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  // React.useEffect(() => {
  //   if (!open) {
  //     setOptions([]);
  //   }
  // }, [open]);

  const logout = () => {
    liff.logout();
    window.location.reload();
  };

  const initLine = () => {
    liff.init(
      { liffId: '1657915988-6Jrbvqly' },
      () => {
        if (liff.isLoggedIn()) {
          runApp();
        } else {
          liff.login();
        }
      },
      (err) => console.error(err)
    );
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
    initLine();
  }, []);

  if (!displayName) {
    return (
      <React.Fragment>
        <Box
          sx={{
            marginTop: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Stack direction="row" spacing={3}>
            <CircularProgress disableShrink color="inherit" />
            <Typography variant="h4" color="inherit">
              Loading...
            </Typography>
          </Stack>
        </Box>
      </React.Fragment>
    );
  } else if (step === 0) {
    return (
      <React.Fragment>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              ลงทะเบียนผู้ใช้งาน
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={submitForm}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-name"
                    disabled
                    fullWidth
                    size="small"
                    label="Display Name"
                    value={displayName}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    autoComplete="given-name"
                    required
                    fullWidth
                    size="small"
                    label="ชื่อจริง"
                    onChange={(event) => setName(event.target.value)}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    label="นามสกุล"
                    onChange={(event) => setLastname(event.target.value)}
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    label="เบอร์โทรศัทพ์"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    onChange={(event) => setEmail(event.target.value)}
                    label="Email Address"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    disablePortal
                    id="asynchronous-demo"
                    fullWidth
                    size="small"
                    // open={open}
                    // onOpen={() => {
                    //   setOpen(true);
                    // }}
                    // onClose={() => {
                    //   setOpen(false);
                    // }}
                    isOptionEqualToValue={(option, value) =>
                      option.VendorID === value.VendorID
                    }
                    getOptionLabel={(option) => option.Vendor_Name}
                    options={options}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setVenderCode(newValue.Vendor_Code);
                      } else {
                        setVenderCode(undefined);
                      }
                    }}
                    renderOption={(props, jsonResults) => (
                      <Box component="li" {...props} key={jsonResults.VendorID}>
                        {jsonResults.Vendor_Name}
                      </Box>
                    )}
                    // loading={loading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="ชื่อ/บริษัท ของท่าน"
                      // InputProps={{
                      //   ...params.InputProps,
                      //   endAdornment: (
                      //     <React.Fragment>
                      //       {loading ? (
                      //         <CircularProgress color="inherit" size={20} />
                      //       ) : null}
                      //       {params.InputProps.endAdornment}
                      //     </React.Fragment>
                      //   ),
                      // }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Container>
      </React.Fragment>
    );
  } else if (step === 1) {
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
          <Typography variant="body2" color="text.secondary" align="center">
            {responseURL}
          </Typography>
          <Stack direction="row" spacing={3}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color={responseURL.indexOf('ลงทะเบียนสำเร็จ') > -1 ? 'success' : 'error'}
              onClick={handleCloseLiff}
              sx={{ mt: 3, mb: 2 }}
            >
              OK
            </Button>
          </Stack>
        </Box>
      </React.Fragment>
    );
  }
}
