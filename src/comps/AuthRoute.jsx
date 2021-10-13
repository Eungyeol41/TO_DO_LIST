import { useUserContext } from "../context";
import { useHistory } from "react-router-dom";
import { useEffect, useCallback } from "react";
import { fetchUser } from "../modules/fetchModule";

function AuthRoute({ children }) {
  const { user, setUser } = useUserContext();
  const history = useHistory();

  const fetchCallback = useCallback(async () => {
    await window.gapi.auth2.init({
      client_id: "711952279142-6jbvgq0ualkue79i1n2a19q0fir8bq82.apps.googleusercontent.com",
      scope: "profile email",
    });

    if (!window.gapi) {
      alert("Google API NOT FOUND");
      history.replace("/login");
    }

    // gapi(google API)로부터 auth2 객체를 조회하기
    const auth2 = await window?.gapi?.auth2.getAuthInstance();
    if (!auth2) {
      history.replace("/login");
    }

    // login되어있는 사용자 정보 getter
    const googleUser = await auth2.currentUser.get();
    const profile = await googleUser.getBasicProfile();
    if (!profile) {
      history.replace("/login");
    }

    const user = {
      userid: profile.getEmail(),
      name: profile.getName(),
      image: profile.getImageUrl(),
      Token: googleUser.getAuthResponse().id_token,
    };
  }, [history, setUser]);
  useEffect(fetchCallback, [fetchCallback]);
  return <>{children}</>;
}

export default AuthRoute;
