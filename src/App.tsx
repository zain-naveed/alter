import "bootstrap/dist/css/bootstrap.min.css";
import { onMessageListener } from "firebase-auth";
import { useEffect } from "react";
import "react-image-crop/dist/ReactCrop.css";
import { useDispatch, useSelector } from "react-redux";
import Toast from "shared/components/toast";
import { setLiveUsers } from "shared/redux/reducers/liveUsersSlice";
import { setNotification } from "shared/redux/reducers/notificationSlice";
import AuthRoute from "shared/routes/authRoutes";
import { initSocket, socket } from "shared/services/socketService";
import { stripePublicKey } from "shared/utils/endpoints";
import { initialConfig } from "shared/utils/interceptor";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./App.css";
function App() {
  const dispatch = useDispatch();

  const { stream, notification } = useSelector((state: any) => state.root);

  const handleLiveStreams = (data: any) => {
    let resp = Object.values(data);
    dispatch(setLiveUsers({ users: resp }));
  };
  useEffect(() => {
    (window as any).Stripe.setPublishableKey(stripePublicKey);
    initialConfig();
    initSocket();
  }, []);
  useEffect(() => {
    if (stream?.liveResp) {
      if (socket.id) {
        socket.emit("rejoin-start-stream", stream?.liveResp);
      }
    }
  }, [stream?.liveResp, socket.id]);
  useEffect(() => {
    if (socket.id) {
      socket.on("live-streaming", handleLiveStreams);
    }
  }, [socket.id]);

  const requestPermission = () => {
    console.log("Requesting permission...");
    try {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setNotification({
            permission: true,
          });
          console.log("Notification permission granted.");
        } else {
          setNotification({
            permission: false,
          });
        }
      });
    } catch (err) {
      console.log("ERROR", err);
      setNotification({
        permission: false,
      });
    }
  };

  useEffect(() => {
    requestPermission();
    //@ts-ignore
  }, [navigator.serviceWorker]);
  try {
    onMessageListener((payload: any) => {
      console.log("Notification Received");
      let prevCount = notification?.count;
      prevCount++;
      dispatch(
        setNotification({
          count: prevCount,
        })
      );
    });
  } catch (err) {
    console.log("Error", err);
  }

  return (
    <div className="App">
      <AuthRoute />
      <Toast />
    </div>
  );
}

export default App;
