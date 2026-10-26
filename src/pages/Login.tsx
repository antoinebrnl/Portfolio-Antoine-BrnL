import { getLanguage } from "~/i18n";
import "moment/locale/fr";
import { localize } from "~/i18n";
import React from "react";
import { user } from "~/configs";
import type { MacActions } from "~/types";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";

export default function Login(props: MacActions) {
  const [password, setPassword] = useState("");
  const [sign, setSign] = useState("Press enter to login");
  const dark = useStore((state) => state.dark);
  const getWallpaper = useStore((state) => state.getWallpaper);
  const activeWallpaper = getWallpaper();
  const [isloginOpen, setIsLoginOpen] = useState(false);
  const [time, setTime] = useState(moment().locale(getLanguage()).format(getLanguage() === "fr" ? "HH:mm" : "h:mm"));
  const [period, setPeriod] = useState(moment().locale(getLanguage()).format("A"));
  const [date, setDate] = useState(moment().locale(getLanguage()).format("dddd, MMMM D"));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment().locale(getLanguage()).format(getLanguage() === "fr" ? "HH:mm" : "h:mm"));
      setPeriod(moment().locale(getLanguage()).format("A"));
      setDate(moment().locale(getLanguage()).format("dddd, MMMM D"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const keyPress = (e: React.KeyboardEvent) => {
    const keyCode = e.key;
    if (keyCode === "Enter" || keyCode === "Space" || keyCode === "Tab")
      props.setLogin(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  return (
    <div
      className="size-full login text-center relative overflow-hidden"
      style={{
        background: `url(${
          dark ? activeWallpaper.night : activeWallpaper.day
        }) center/cover no-repeat`,
      }}
      onClick={() => !isloginOpen && setIsLoginOpen(true)}
    >
      <AnimatePresence mode="wait">
        {localize(isloginOpen ? (
          <motion.div
            key="login-panel"
            className="size-full absolute inset-0"
            style={{
              backgroundColor: 'rgba(0,0,0,0.15)',
              backdropFilter: 'blur(60px) saturate(200%)',
              WebkitBackdropFilter: 'blur(60px) saturate(200%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            onKeyDown={keyPress}
          >
            <motion.div
              className="inline-block w-auto relative top-1/2"
              style={{ marginTop: '-160px' }}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Avatar with ring */}
              <div
                style={{
                  width: '88px',
                  height: '88px',
                  margin: '0 auto',
                  borderRadius: '50%',
                  padding: '3px',
                  background: 'rgba(255,255,255,0.2)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }}
              >
                <img
                  className="rounded-full size-full"
                  src={user.avatar}
                  alt={localize("avatar")}
                  style={{
                    objectFit: 'cover',
                    border: '2px solid rgba(255,255,255,0.15)',
                  }}
                />
              </div>

              {/* Name */}
              <div
                className="font-display"
                style={{
                  marginTop: '12px',
                  fontSize: '17px',
                  fontWeight: 500,
                  color: 'white',
                  letterSpacing: '0.3px',
                  textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }}
              >
                {localize(user.name)}
              </div>

              {/* Login button styled as password field */}
              <motion.div
                className="flex justify-center items-center mt-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '6px 24px',
                    borderRadius: '20px',
                    border: '0.5px solid rgba(255,255,255,0.25)',
                    background: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: 400,
                    letterSpacing: '0.3px',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(200, 106, 82, 0.25)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200, 106, 82, 0.6)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 0 12px rgba(200, 106, 82, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    props.setLogin(true);
                  }}
                  onKeyDown={keyPress}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 256 256" fill="currentColor" style={{ opacity: 0.8, flexShrink: 0 }}>
                    <path d="M184,128a8,8,0,0,1-8,8H99.31l34.35,34.34a8,8,0,0,1-11.32,11.32l-48-48a8,8,0,0,1,0-11.32l48-48a8,8,0,0,1,11.32,11.32L99.31,120H176A8,8,0,0,1,184,128ZM216,32V224a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Z" />
                  </svg>
                  {localize("Sign In")}</button>
              </motion.div>

              {/* Touch ID hint */}
              <motion.div
                style={{
                  marginTop: '16px',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.2px',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {localize("Press Enter to sign in")}</motion.div>
            </motion.div>

            {/* Power buttons */}
            <motion.div
              className="fixed bottom-12 inset-x-0 mx-auto flex flex-row space-x-6 w-max"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {localize([
                {
                  label: 'Sleep',
                  svg: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
                      <path d="M235.54,150.21a104,104,0,0,1-131-131A8,8,0,0,0,94.58,8.53a120,120,0,1,0,152.88,152.89,8,8,0,0,0-11.92-11.21ZM152,216A104.11,104.11,0,0,1,35.73,94.12a121,121,0,0,0,26.15,37A120.8,120.8,0,0,0,152,168a121.1,121.1,0,0,0,36.88-5.73A104.09,104.09,0,0,1,152,216Zm12-100a12,12,0,1,1,12,12A12,12,0,0,1,164,116Zm-12-36a12,12,0,1,1,12,12A12,12,0,0,1,152,80Zm44,24a12,12,0,1,1,12,12A12,12,0,0,1,196,104Z" />
                    </svg>
                  ),
                  action: props.sleepMac,
                },
                {
                  label: 'Restart',
                  svg: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
                      <path d="M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4l-20.58-19A96,96,0,0,0,32.55,140.27,8,8,0,0,1,16.71,137,112,112,0,0,1,201.55,66l21.6,19.89A8,8,0,0,1,240,56ZM239.29,119a112,112,0,0,1-184.84,71l-21.6-19.89A8,8,0,0,1,16,200V152a8,8,0,0,1,8-8H72a8,8,0,0,1,0,16H44.6l20.58,19A96,96,0,0,0,223.45,115.73,8,8,0,0,1,239.29,119Z" />
                    </svg>
                  ),
                  action: props.restartMac,
                },
                {
                  label: 'Shut Down',
                  svg: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
                      <path d="M120,128V48a8,8,0,0,1,16,0v80a8,8,0,0,1-16,0Zm60-80.57a8,8,0,1,0-8,13.86,80,80,0,1,1-88,0,8,8,0,1,0-8-13.86,96,96,0,1,0,104,0Z" />
                    </svg>
                  ),
                  action: props.shutMac,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center cursor-pointer group"
                  style={{ width: '72px' }}
                  onClick={(e) => item.action(e)}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '0.5px solid rgba(255,255,255,0.15)',
                      transition: 'background 0.2s ease, transform 0.15s ease',
                      color: 'white',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(200, 106, 82, 0.25)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200, 106, 82, 0.6)';
                      (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
                      (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                    }}
                  >
                    {localize(item.svg)}
                  </div>
                  <span
                    style={{
                      marginTop: '6px',
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.7)',
                      fontWeight: 400,
                    }}
                  >
                    {localize(item.label)}
                  </span>
                </div>
              )))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="lock-screen"
            className="size-full flex flex-col justify-between items-center relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
          >
            {/* Lock screen clock */}
            <motion.div
              className="flex flex-col items-center"
              style={{ paddingTop: 'clamp(60px, 12vh, 120px)' }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div
                className="font-rounded font-tabular"
                style={{
                  fontSize: 'clamp(72px, 12vw, 110px)',
                  fontWeight: 800,
                  color: 'white',
                  letterSpacing: '-2px',
                  lineHeight: 1,
                  textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                }}
              >
                {localize(time)}
              </div>
              <div
                className="font-rounded"
                style={{
                  marginTop: '8px',
                  fontSize: 'clamp(16px, 2.5vw, 22px)',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.85)',
                  letterSpacing: '0.5px',
                  textShadow: '0 1px 8px rgba(0,0,0,0.2)',
                }}
              >
                {localize(date)}
              </div>
            </motion.div>

            {/* Click to unlock hint */}
            <motion.div
              style={{
                paddingBottom: '48px',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: '0.5px',
                  animation: 'subtlePulse 3s ease-in-out infinite',
                  cursor: 'pointer',
                }}
              >
                {localize("Click anywhere to unlock")}</div>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
