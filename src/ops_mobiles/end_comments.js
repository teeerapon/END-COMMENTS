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
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import config from '../config'
import ClearIcon from '@mui/icons-material/Clear';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

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
      กรุณาระบุขั้นตอนการปฏิบัติงานของท่าน
    </Typography>
  );
}

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function SignIn() {

  var today = new Date();
  var date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var time =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  var dateTime = date + ' ' + time;

  const [idToken, setIdToken] = React.useState();
  const [displayName, setDisplayName] = React.useState();
  const [statusMessage, setStatusMessage] = React.useState();
  const [userId, setUserId] = React.useState();

  // const stk_codeURL = window.location.search;
  const urlParams = new URLSearchParams(window.location.search);
  const stk_codeURL = urlParams.get('stk_code');
  const [valueComments, setValueComments] = React.useState();

  const [page, setPage] = React.useState(0);
  const [responseURL, setResponseURL] = React.useState();
  const [dataFiles, setDataFiles] = React.useState();
  const [beginDate, setBeginDate] = React.useState(dayjs());
  const [endDate, setEndDate] = React.useState(dayjs());
  const [dataFilesCount, setDataFilesCount] = React.useState()

  console.log(dataFilesCount);

  const handle_ChangeBeginDate = (newValue) => {
    setBeginDate(
      `${newValue.format('YYYY-MM-DD')}T${newValue.format('HH:mm:ss')}`
    );
  };

  const handle_ChangeEndDate = (newValue) => {
    setEndDate(
      `${newValue.format('YYYY-MM-DD')}T${newValue.format('HH:mm:ss')}`
    );
  };

  const handle_files = async (event) => {
    event.preventDefault();

    const fileBolb = URL.createObjectURL(event.target.files[0])

    if (!dataFilesCount) {
      setDataFilesCount([{
        ST_code: stk_codeURL,
        file: fileBolb,
        fileData: event.target.files[0],
        filename: event.target.files[0].name,
      }])
    } else {
      setDataFilesCount([...dataFilesCount, {
        ST_code: stk_codeURL,
        file: fileBolb,
        fileData: event.target.files[0],
        filename: event.target.files[0].name,
      }])
    }
  };

  const handleServiceRemove = (index) => {
    const list = [...dataFilesCount];
    list.splice(index, 1);
    setDataFilesCount(list);
  };

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

    const http_AttachFiles =
      config.http + '/STcheck_files';
    //'http://localhost:32001/STcheck_files';

    const http =
      // config.http + '/STrack_End_Comments';
      config.http + '/STrack_End_Comments';

    const body = {
      stk_code: stk_codeURL,
      userID: userId,
      End_Commetns: valueComments,
      BeginDate: beginDate === dayjs() ? dateTime : beginDate,
      EndDate: endDate === dayjs() ? dateTime : endDate,
    };

    await axios.post(http, body, { headers }).then(async (response) => {
      if (!response.data[0].res) {
        setResponseURL('สิ้นสุดการดำเนินรายการ ' + stk_codeURL);
        setPage(1);
        for (let i = 0; i < dataFilesCount.length; i++) {
          await axios.post(http_AttachFiles, dataFilesCount[i], { headers });
        }
      } else {
        setResponseURL(response.data[0].res);
        setPage(1);
      }
    });
  };

  const handleCloseLiff = () => {
    liff.closeWindow();
    window.close();
  };

  const logout = () => {
    liff.logout();
    window.location.reload();
  };

  const initLine = () => {
    liff.init(
      { liffId: '1657915988-KLn4ZXyE' },
      () => {
        if (liff.isLoggedIn()) {
          runApp();
        } else {
          const destinationUrl = window.location.href;
          liff.login({ redirectUri: destinationUrl });
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
              color={
                responseURL === 'UNSUCCESS, YOUR JOB IS NOT FINISH !!'
                  ? 'error'
                  : 'success'
              }
              onClick={handleCloseLiff}
              sx={{ mt: 3, mb: 2 }}
            >
              OK
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
        <Typography variant="body2" color="text.secondary" align="center">
          {`${stk_codeURL}`}
        </Typography>
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={[
                  'DateTimePicker',
                  'MobileDateTimePicker',
                  'DesktopDateTimePicker',
                  'StaticDateTimePicker',
                ]}
              >
                <MobileDateTimePicker
                  label="วันที่เริ่มต้นปฎิบัติงาน"
                  slotProps={{ textField: { size: 'small' } }}
                  defaultValue={beginDate}
                  onChange={handle_ChangeBeginDate}
                  ampm={false}
                />
                <MobileDateTimePicker
                  label="วันที่ปฎิบัติงานเสร็จสิ้น"
                  slotProps={{ textField: { size: 'small' } }}
                  defaultValue={endDate}
                  onChange={handle_ChangeEndDate}
                  ampm={false}
                />
              </DemoContainer>
            </LocalizationProvider>
            <ImageListItemBar
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 1)',
                color: 'rgba(255, 255, 255, 1)',
                mt: 2,
              }}
              position="below"
              title={
                <span>
                  &nbsp; &nbsp;
                  {dataFiles
                    ? `อัพโหลดไฟล์แล้ว ${dataFiles.length} รายการ`
                    : `กรุณาเลือกไฟล์รูปภาพ`}
                </span>
              }
              actionIcon={
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 1)' }}
                  component="label"
                >
                  <input
                    hidden
                    size="small"
                    type="file"
                    name="file"
                    multiple
                    onChange={handle_files}
                  />
                  <FilePresentIcon sx={{ fontSize: 20 }} />
                </IconButton>
              }
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
          <ImageList cols={1}>
            {dataFilesCount ? dataFilesCount.map((res, index) =>
              <ImageListItem style={{ maxWidth: 300 }}>
                <img
                  src={res.file}
                  srcSet={res.file}
                  alt={res.filename}
                  loading="lazy"
                />
                <ImageListItemBar
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 1)',
                    color: 'rgba(255, 255, 255, 1)',
                    mt: 2,
                  }}
                  position="below"
                  title={
                    <span>
                      &nbsp; &nbsp;{res.filename}
                    </span>
                  }
                  actionIcon={
                    <IconButton
                      sx={{ color: 'rgba(255, 255, 255, 1)' }}
                      component="label"
                      onClick={() => handleServiceRemove(index)}
                    >
                      <ClearIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  }
                />
              </ImageListItem>
            ) : null}
          </ImageList>
        </Box>
      </Container >
    );
  }
}
