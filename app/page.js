if (typeof window !== "undefined") {
  //This code is executed in the browser
  console.log(window.innerWidth)
}
"use client"
import { useEffect, useState } from "react";
import { initializeAgora, joinChannel, leaveChannel } from "./agora";

import styles from "./Home.module.css";

export default function Home() {
  useEffect(() => {
    initializeAgora();
  }, []);
  const [joined, setJoined] = useState(false)

  const handleJoinClick = async () => {
    setJoined(true)
    // Replace these values with your Agora credentials
    const appId = "ddf85a4012c64d70bf6a0686b13e8f09";
    const channelName = "dmm";
    const token = "007eJxTYBAUZ9jiNekBh8e+qqOK9tafre7YBQUEWV9UvDzB99i7RBEFhpSUNAvTRBMDQ6NkM5MUc4OkNLNEAzMLsyRD41SLNANL5+C/KQ2BjAwFyf1MjAwQCOIzM6Tk5jIwAACEPR0G";
    const uid = 0;
    await joinChannel(appId, channelName, token, uid);
  };

  const handleLeaveClick = async () => {
    setJoined(false)
    await leaveChannel();
  };

  return (
    <main className={styles.main}>
      <div className={styles.grid}>
        <h2 className={styles.leftAlign}>Get started with video calling</h2>
        <div className={styles.row}>
          <div>
            {!joined && (<button type="button" id="join" onClick={handleJoinClick}>
              Join
            </button>)}
            {
              joined && (<button type="button" id="leave" onClick={handleLeaveClick}>
                Leave
              </button>)
            }

          </div>
        </div>
      </div>
    </main>
  );
}
